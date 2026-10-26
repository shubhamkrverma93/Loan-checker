"""
Dashboard analytics and ML model performance metrics endpoints.
"""

import json
from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from database import get_db
from models import Application, Prediction, ModelMetrics
from schemas import DashboardMetrics
from ml_engine import ml_engine

router = APIRouter(prefix="/api", tags=["Analytics & Dashboard"])

@router.get("/dashboard", response_model=DashboardMetrics)
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_apps = db.query(Application).count()
    
    # Defaults if no applications submitted yet
    if total_apps == 0:
        return {
            "total_applications": 0,
            "approved_predictions": 0,
            "review_cases": 0,
            "unfavorable_predictions": 0,
            "approval_rate": 0.0,
            "total_requested_volume": 0.0,
            "total_predicted_volume": 0.0,
            "average_credit_score": 0.0,
            "risk_distribution": {"Low Risk": 0, "Medium Risk": 0, "High Risk": 0},
            "recommendation_distribution": {"Favorable": 0, "Needs Review": 0, "Unfavorable": 0},
            "category_distribution": {},
            "recent_applications": []
        }

    # Aggregate counts
    favorable_count = db.query(Prediction).filter(Prediction.recommendation == "Favorable").count()
    review_count = db.query(Prediction).filter(Prediction.recommendation == "Needs Review").count()
    unfavorable_count = db.query(Prediction).filter(Prediction.recommendation == "Unfavorable").count()

    total_requested = db.query(func.sum(Application.requested_loan)).scalar() or 0.0
    total_predicted = db.query(func.sum(Prediction.linear_predicted_amount)).scalar() or 0.0
    avg_credit = db.query(func.avg(Application.credit_score)).scalar() or 0.0

    approval_rate = round((favorable_count / total_apps) * 100, 2) if total_apps > 0 else 0.0

    # Risk distribution
    risks = db.query(Prediction.knn_risk, func.count(Prediction.id)).group_by(Prediction.knn_risk).all()
    risk_dict = {"Low Risk": 0, "Medium Risk": 0, "High Risk": 0}
    for r, count in risks:
        if r in risk_dict:
            risk_dict[r] = count
        else:
            risk_dict[r] = count

    # Recommendation distribution
    recs = db.query(Prediction.recommendation, func.count(Prediction.id)).group_by(Prediction.recommendation).all()
    rec_dict = {"Favorable": 0, "Needs Review": 0, "Unfavorable": 0}
    for r, count in recs:
        rec_dict[r] = count

    # Category distribution
    categories = db.query(Application.project_category, func.count(Application.id)).group_by(Application.project_category).all()
    cat_dict = {cat: count for cat, count in categories}

    # Recent 8 applications
    recent = db.query(Application).outerjoin(Prediction).order_by(desc(Application.created_at)).limit(8).all()

    return {
        "total_applications": total_apps,
        "approved_predictions": favorable_count,
        "review_cases": review_count,
        "unfavorable_predictions": unfavorable_count,
        "approval_rate": approval_rate,
        "total_requested_volume": round(float(total_requested), 2),
        "total_predicted_volume": round(float(total_predicted), 2),
        "average_credit_score": round(float(avg_credit), 1),
        "risk_distribution": risk_dict,
        "recommendation_distribution": rec_dict,
        "category_distribution": cat_dict,
        "recent_applications": recent
    }

@router.get("/model-performance")
def get_model_performance(db: Session = Depends(get_db)):
    """
    Returns verified evaluation metrics across all 3 algorithms:
    Logistic Regression, Linear Regression, and K-Nearest Neighbors.
    """
    return {
        "status": "success",
        "models": ml_engine.metrics,
        "disclaimer": "Educational evaluation based on train-test cross-validation of synthetic loan data."
    }
