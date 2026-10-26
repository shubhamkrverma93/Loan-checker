"""
Application management endpoints: retrieval, detail view, and deletion.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import get_db
from models import Application, Prediction
from schemas import ApplicationOut

router = APIRouter(prefix="/api", tags=["Applications"])

@router.get("/applications", response_model=List[ApplicationOut])
def list_applications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    search: Optional[str] = None,
    recommendation: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Application).outerjoin(Prediction)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            (Application.applicant_name.ilike(search_filter)) |
            (Application.project_name.ilike(search_filter)) |
            (Application.project_category.ilike(search_filter))
        )

    if recommendation:
        query = query.filter(Prediction.recommendation.ilike(f"%{recommendation.strip()}%"))

    applications = query.order_by(desc(Application.created_at)).offset(skip).limit(limit).all()
    return applications

@router.get("/application/{app_id}", response_model=ApplicationOut)
def get_application(app_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID {app_id} was not found."
        )
    return app

@router.delete("/application/{app_id}")
def delete_application(app_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID {app_id} was not found."
        )
    db.delete(app)
    db.commit()
    return {"message": f"Application {app_id} and its associated predictions were successfully deleted."}
