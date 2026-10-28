import os
import sys

# Ensure backend directory is in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import engine, Base, SessionLocal
from models import User, Application, Prediction
from auth import hash_password
from routes import auth, prediction, applications, dashboard
from ml_engine import ml_engine


# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Machine Learning Project Loan Approval API",
    description="Educational AI/ML System with Logistic Regression, Linear Regression, and K-Nearest Neighbors",
    version="1.0.0"
)

# CORS setup
allowed_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
allowed_origins.append("https://loan-checker-gamma.vercel.app")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Uploads directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(prediction.router)
app.include_router(applications.router)
app.include_router(dashboard.router)

@app.on_event("startup")
def seed_initial_data():
    """
    Seeds default admin and demonstration applications if the database is newly initialized.
    """
    db = SessionLocal()
    try:
        is_production = os.getenv("ENVIRONMENT", "development").lower() == "production"
        admin_email = os.getenv("ADMIN_EMAIL", "admin@loanapproval.ai")
        admin_password = os.getenv("ADMIN_PASSWORD")
        if is_production and not admin_password:
            raise RuntimeError("ADMIN_PASSWORD must be configured in production.")

        # Check if users exist
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            if admin_password:
                db.add(User(
                    name="System Administrator",
                    email=admin_email,
                    password_hash=hash_password(admin_password),
                    role="admin"
                ))
            elif not is_production:
                db.add_all([
                    User(
                        name="System Administrator",
                        email=admin_email,
                        password_hash=hash_password("admin123"),
                        role="admin"
                    ),
                    User(
                        name="Rahul Sharma",
                        email="rahul@example.com",
                        password_hash=hash_password("user123"),
                        role="applicant"
                    )
                ])
                print(f"Default users seeded: {admin_email} / admin123, rahul@example.com / user123")
            db.commit()

        # Seed initial applications if table is empty
        app_count = db.query(Application).count()
        if app_count == 0:
            demo_apps = [
                {
                    "applicant_name": "Aarav Patel",
                    "age": 34,
                    "gender": "Male",
                    "employment_type": "Business Owner",
                    "employment_experience": 8.5,
                    "annual_income": 1800000.0,
                    "monthly_income": 150000.0,
                    "credit_score": 790,
                    "existing_loan": 250000.0,
                    "monthly_emi": 18000.0,
                    "requested_loan": 1200000.0,
                    "loan_tenure": 48,
                    "interest_rate": 10.2,
                    "loan_purpose": "Business Expansion",
                    "project_name": "Solar Tech Manufacturing Line",
                    "project_category": "Manufacturing",
                    "project_cost": 2500000.0,
                    "expected_revenue": 4800000.0,
                    "expected_profit": 1150000.0,
                    "project_experience": 6.0,
                },
                {
                    "applicant_name": "Priya Nair",
                    "age": 29,
                    "gender": "Female",
                    "employment_type": "Salaried",
                    "employment_experience": 6.0,
                    "annual_income": 950000.0,
                    "monthly_income": 79166.0,
                    "credit_score": 670,
                    "existing_loan": 120000.0,
                    "monthly_emi": 14000.0,
                    "requested_loan": 600000.0,
                    "loan_tenure": 36,
                    "interest_rate": 11.5,
                    "loan_purpose": "Equipment Purchase",
                    "project_name": "Cloud Kitchen Infrastructure",
                    "project_category": "Retail",
                    "project_cost": 1000000.0,
                    "expected_revenue": 1900000.0,
                    "expected_profit": 380000.0,
                    "project_experience": 3.0,
                },
                {
                    "applicant_name": "Vikram Malhotra",
                    "age": 42,
                    "gender": "Male",
                    "employment_type": "Freelancer",
                    "employment_experience": 3.5,
                    "annual_income": 480000.0,
                    "monthly_income": 40000.0,
                    "credit_score": 540,
                    "existing_loan": 380000.0,
                    "monthly_emi": 24000.0,
                    "requested_loan": 800000.0,
                    "loan_tenure": 60,
                    "interest_rate": 14.5,
                    "loan_purpose": "Working Capital",
                    "project_name": "Logistics Dispatch Hub",
                    "project_category": "Services",
                    "project_cost": 900000.0,
                    "expected_revenue": 1100000.0,
                    "expected_profit": 95000.0,
                    "project_experience": 1.5,
                }
            ]

            for item in demo_apps:
                # Run through ml_engine to create genuine model predictions
                pred_out = ml_engine.predict(item)
                
                app_row = Application(
                    applicant_name=item["applicant_name"],
                    age=item["age"],
                    gender=item["gender"],
                    employment_type=item["employment_type"],
                    employment_experience=item["employment_experience"],
                    annual_income=item["annual_income"],
                    monthly_income=item["monthly_income"],
                    credit_score=item["credit_score"],
                    existing_loan=item["existing_loan"],
                    monthly_emi=item["monthly_emi"],
                    requested_loan=item["requested_loan"],
                    loan_tenure=item["loan_tenure"],
                    interest_rate=item["interest_rate"],
                    loan_purpose=item["loan_purpose"],
                    project_name=item["project_name"],
                    project_category=item["project_category"],
                    project_cost=item["project_cost"],
                    expected_revenue=item["expected_revenue"],
                    expected_profit=item["expected_profit"],
                    project_experience=item["project_experience"],
                    status="Analyzed"
                )
                db.add(app_row)
                db.commit()
                db.refresh(app_row)

                pred_row = Prediction(
                    application_id=app_row.id,
                    logistic_prediction=pred_out["logistic_regression"]["prediction"],
                    logistic_probability=pred_out["logistic_regression"]["probability"],
                    linear_predicted_amount=pred_out["linear_regression"]["predicted_loan_amount"],
                    knn_risk=pred_out["knn"]["risk_level"],
                    recommendation=pred_out["recommendation"],
                    explanation=pred_out["explanation"],
                    factors_json=json.dumps(pred_out["key_factors"]),
                    similar_neighbors_json=json.dumps(pred_out["knn"]["similar_profiles"])
                )
                db.add(pred_row)
                db.commit()

            print(f"Seeded {len(demo_apps)} initial analyzed demonstration applications.")

    finally:
        db.close()

@app.get("/")
def root():
    return {
        "system": "Machine Learning Based Project Loan Approval System",
        "status": "online",
        "api_documentation": "/docs",
        "models_loaded": {
            "logistic_regression": "Classification (Approval)",
            "linear_regression": "Regression (Loan Amount)",
            "knn": "Classification (Risk Assessment)"
        },
        "disclaimer": "Educational ML Project. Model outputs are for demonstration purposes."
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Loan Approval ML Backend"}
