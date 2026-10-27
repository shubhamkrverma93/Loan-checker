"""
Pydantic schemas for data validation and API serialization.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# ----------------- User Schemas -----------------
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ----------------- Application Schemas -----------------
class LoanApplicationCreate(BaseModel):
    # Personal
    applicant_name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=18, le=80)
    gender: str = Field("Male")
    employment_type: str = Field(..., description="Salaried, Self-Employed, Business Owner, Freelancer")
    employment_experience: float = Field(..., ge=0, le=50)

    # Financial
    annual_income: float = Field(..., ge=50000)
    monthly_income: Optional[float] = None
    credit_score: int = Field(..., ge=300, le=900)
    existing_loan: float = Field(0.0, ge=0)
    monthly_emi: float = Field(0.0, ge=0)

    # Loan
    requested_loan: float = Field(..., ge=10000)
    loan_tenure: int = Field(..., ge=6, le=180, description="Tenure in months")
    interest_rate: float = Field(10.5, ge=1.0, le=36.0)
    loan_purpose: str = Field("Working Capital")

    # Project
    project_name: str = Field(..., min_length=2, max_length=150)
    project_category: str = Field(..., description="Technology, Retail, Manufacturing, Healthcare, Agriculture, Services")
    project_cost: float = Field(..., ge=20000)
    expected_revenue: float = Field(..., ge=0)
    expected_profit: float = Field(..., ge=0)
    project_experience: float = Field(0.0, ge=0, le=50)

    # Documents
    identity_doc: Optional[str] = None
    income_proof: Optional[str] = None
    bank_statement: Optional[str] = None
    project_proposal: Optional[str] = None

# ----------------- Prediction Schemas -----------------
class LogisticResult(BaseModel):
    prediction: str
    probability: float
    confidence_percentage: float

class LinearResult(BaseModel):
    predicted_loan_amount: float
    ratio_of_requested: float
    difference_from_requested: float

class KNNResult(BaseModel):
    risk_level: str
    nearest_neighbors_count: int
    similar_profiles: List[Dict[str, Any]] = []

class ContributingFactor(BaseModel):
    factor: str
    impact: str  # "Positive", "Warning", "Negative"
    description: str

class PredictionResponse(BaseModel):
    application_id: Optional[int] = None
    logistic_regression: LogisticResult
    linear_regression: LinearResult
    knn: KNNResult
    recommendation: str
    explanation: str
    key_factors: List[ContributingFactor]
    disclaimer: str
    created_at: Optional[datetime] = None

# ----------------- Detailed Application Output -----------------
class PredictionSummary(BaseModel):
    id: int
    logistic_prediction: str
    logistic_probability: float
    linear_predicted_amount: float
    knn_risk: str
    recommendation: str
    explanation: Optional[str] = None
    factors_json: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ApplicationOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    applicant_name: str
    age: int
    gender: str
    employment_type: str
    employment_experience: float
    annual_income: float
    monthly_income: float
    credit_score: int
    existing_loan: float
    monthly_emi: float
    requested_loan: float
    loan_tenure: int
    interest_rate: float
    loan_purpose: str
    project_name: str
    project_category: str
    project_cost: float
    expected_revenue: float
    expected_profit: float
    project_experience: float
    identity_doc: Optional[str] = None
    income_proof: Optional[str] = None
    bank_statement: Optional[str] = None
    project_proposal: Optional[str] = None
    status: str
    created_at: datetime
    prediction: Optional[PredictionSummary] = None

    class Config:
        from_attributes = True

# ----------------- Dashboard & Analytics Schemas -----------------
class DashboardMetrics(BaseModel):
    total_applications: int
    approved_predictions: int
    review_cases: int
    unfavorable_predictions: int
    approval_rate: float
    total_requested_volume: float
    total_predicted_volume: float
    average_credit_score: float
    risk_distribution: Dict[str, int]
    recommendation_distribution: Dict[str, int]
    category_distribution: Dict[str, int]
    recent_applications: List[ApplicationOut]
