"""
Prediction & Document Upload Endpoints.
Processes loan applications through ML pipeline and persists results.
"""

import os
import json
import uuid
import shutil
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from database import get_db
from models import Application, Prediction, User
from schemas import LoanApplicationCreate, PredictionResponse
from auth import get_optional_user
from ml_engine import ml_engine

router = APIRouter(prefix="/api", tags=["Prediction & Processing"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):
    """
    Validates and stores applicant documents (ID, Income Proof, Bank Statement, Proposal).
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Secure random filename
    unique_filename = f"{uuid.uuid4().hex}_{os.path.basename(file.filename)}"
    destination = os.path.join(UPLOAD_DIR, unique_filename)

    file_size = 0
    with open(destination, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):  # 1MB chunks
            file_size += len(chunk)
            if file_size > MAX_FILE_SIZE_BYTES:
                buffer.close()
                os.remove(destination)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="File exceeds maximum size limit of 10MB."
                )
            buffer.write(chunk)

    return {
        "filename": unique_filename,
        "original_name": file.filename,
        "size_bytes": file_size,
        "url": f"/uploads/{unique_filename}"
    }

@router.post("/predict", response_model=PredictionResponse)
def predict_loan(
    app_data: LoanApplicationCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """
    Executes multi-model ML inference (Logistic, Linear, KNN),
    synthesizes a transparent decision recommendation,
    and persists the application and prediction history.
    """
    # 1. Run Machine Learning Pipeline
    input_dict = app_data.model_dump()
    ml_output = ml_engine.predict(input_dict)

    # 2. Persist Application record
    monthly_income = app_data.monthly_income or round(app_data.annual_income / 12, 2)
    db_application = Application(
        user_id=current_user.id if current_user else None,
        applicant_name=app_data.applicant_name,
        age=app_data.age,
        gender=app_data.gender,
        employment_type=app_data.employment_type,
        employment_experience=app_data.employment_experience,
        annual_income=app_data.annual_income,
        monthly_income=monthly_income,
        credit_score=app_data.credit_score,
        existing_loan=app_data.existing_loan,
        monthly_emi=app_data.monthly_emi,
        requested_loan=app_data.requested_loan,
        loan_tenure=app_data.loan_tenure,
        interest_rate=app_data.interest_rate,
        loan_purpose=app_data.loan_purpose,
        project_name=app_data.project_name,
        project_category=app_data.project_category,
        project_cost=app_data.project_cost,
        expected_revenue=app_data.expected_revenue,
        expected_profit=app_data.expected_profit,
        project_experience=app_data.project_experience,
        identity_doc=app_data.identity_doc,
        income_proof=app_data.income_proof,
        bank_statement=app_data.bank_statement,
        project_proposal=app_data.project_proposal,
        status="Analyzed"
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    # 3. Persist Prediction record
    db_prediction = Prediction(
        application_id=db_application.id,
        logistic_prediction=ml_output["logistic_regression"]["prediction"],
        logistic_probability=ml_output["logistic_regression"]["probability"],
        linear_predicted_amount=ml_output["linear_regression"]["predicted_loan_amount"],
        knn_risk=ml_output["knn"]["risk_level"],
        recommendation=ml_output["recommendation"],
        explanation=ml_output["explanation"],
        factors_json=json.dumps(ml_output["key_factors"]),
        similar_neighbors_json=json.dumps(ml_output["knn"]["similar_profiles"])
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)

    ml_output["application_id"] = db_application.id
    ml_output["created_at"] = db_prediction.created_at

    return ml_output
