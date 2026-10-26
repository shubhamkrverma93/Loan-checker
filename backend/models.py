"""
SQLAlchemy ORM Models for User, Loan Application, ML Prediction, and Model Metrics.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="applicant")  # "applicant" or "admin"
    created_at = Column(DateTime, default=datetime.utcnow)
    
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Personal
    applicant_name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    employment_type = Column(String(50), nullable=False)
    employment_experience = Column(Float, nullable=False)
    
    # Financial
    annual_income = Column(Float, nullable=False)
    monthly_income = Column(Float, nullable=False)
    credit_score = Column(Integer, nullable=False)
    existing_loan = Column(Float, default=0.0)
    monthly_emi = Column(Float, default=0.0)
    
    # Loan Details
    requested_loan = Column(Float, nullable=False)
    loan_tenure = Column(Integer, nullable=False)
    interest_rate = Column(Float, default=10.5)
    loan_purpose = Column(String(100), nullable=False)
    
    # Project Details
    project_name = Column(String(150), nullable=False)
    project_category = Column(String(50), nullable=False)
    project_cost = Column(Float, nullable=False)
    expected_revenue = Column(Float, nullable=False)
    expected_profit = Column(Float, nullable=False)
    project_experience = Column(Float, default=0.0)
    
    # Document Records
    identity_doc = Column(String(255), nullable=True)
    income_proof = Column(String(255), nullable=True)
    bank_statement = Column(String(255), nullable=True)
    project_proposal = Column(String(255), nullable=True)
    
    status = Column(String(30), default="Submitted")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="applications")
    prediction = relationship("Prediction", back_populates="application", uselist=False, cascade="all, delete-orphan")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True, nullable=False)
    
    # Logistic Regression
    logistic_prediction = Column(String(30), nullable=False)  # "Approved" or "Not Approved"
    logistic_probability = Column(Float, nullable=False)      # e.g. 0.87
    
    # Linear Regression
    linear_predicted_amount = Column(Float, nullable=False)   # e.g. 420000.0
    
    # KNN
    knn_risk = Column(String(30), nullable=False)             # "Low Risk", "Medium Risk", "High Risk"
    
    # Transparent Rule Engine Outcome
    recommendation = Column(String(50), nullable=False)       # "Favorable", "Needs Review", "Unfavorable"
    explanation = Column(Text, nullable=True)
    factors_json = Column(Text, nullable=True)               # JSON encoded key factors
    similar_neighbors_json = Column(Text, nullable=True)     # JSON encoded nearest neighbors info
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    application = relationship("Application", back_populates="prediction")

class ModelMetrics(Base):
    __tablename__ = "model_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    rmse = Column(Float, nullable=True)
    r2_score = Column(Float, nullable=True)
    metrics_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
