"""
Preprocessing Pipeline for Machine Learning Based Project Loan Approval System
Handles:
- Missing value imputation
- Feature engineering (DTI, Loan-to-Cost, Profit-to-Loan ratios)
- One-hot encoding for categorical variables
- Standard scaling for numerical variables
"""

import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from typing import Tuple, List, Dict, Any

NUMERICAL_COLS = [
    "age",
    "employment_experience",
    "annual_income",
    "monthly_income",
    "credit_score",
    "existing_loan",
    "monthly_emi",
    "project_cost",
    "expected_revenue",
    "expected_profit",
    "project_experience",
    "requested_loan",
    "loan_tenure",
    "interest_rate",
    # Engineered features
    "debt_to_income_ratio",
    "loan_to_project_cost",
    "loan_to_income_ratio",
    "profit_to_loan_ratio",
]

CATEGORICAL_COLS = [
    "gender",
    "employment_type",
    "project_category",
    "loan_purpose"
]

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes domain-specific financial risk and affordability ratios.
    """
    df = df.copy()
    
    # Ensure numerical types
    num_fields = [
        "age", "employment_experience", "annual_income", "monthly_income",
        "credit_score", "existing_loan", "monthly_emi", "project_cost",
        "expected_revenue", "expected_profit", "project_experience",
        "requested_loan", "loan_tenure", "interest_rate"
    ]
    for col in num_fields:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0.0)
            
    # Monthly income fallback if missing or 0
    if "monthly_income" not in df.columns or (df["monthly_income"] <= 0).all():
        df["monthly_income"] = df["annual_income"] / 12.0
    df["monthly_income"] = df["monthly_income"].replace(0, 1.0)
    
    # Financial Ratios
    df["debt_to_income_ratio"] = df["monthly_emi"] / df["monthly_income"]
    df["loan_to_project_cost"] = df["requested_loan"] / (df["project_cost"] + 1.0)
    df["loan_to_income_ratio"] = df["requested_loan"] / (df["annual_income"] + 1.0)
    df["profit_to_loan_ratio"] = df["expected_profit"] / (df["requested_loan"] + 1.0)
    
    # Fill any nulls with default safe values
    for col in CATEGORICAL_COLS:
        if col not in df.columns:
            df[col] = "Other"
        else:
            df[col] = df[col].fillna("Other").astype(str)
            
    return df

def create_preprocessor() -> ColumnTransformer:
    """
    Constructs a ColumnTransformer suitable for tabular financial data.
    """
    numeric_transformer = Pipeline(steps=[
        ("scaler", StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, NUMERICAL_COLS),
            ("cat", categorical_transformer, CATEGORICAL_COLS)
        ],
        remainder="drop"
    )
    return preprocessor

def get_feature_names(preprocessor: ColumnTransformer) -> List[str]:
    """
    Extracts human-readable feature names after transformations.
    """
    output_features = list(NUMERICAL_COLS)
    try:
        cat_encoder = preprocessor.named_transformers_["cat"].named_steps["onehot"]
        encoded_cat_names = cat_encoder.get_feature_names_out(CATEGORICAL_COLS)
        output_features.extend(list(encoded_cat_names))
    except Exception:
        pass
    return output_features

def dict_to_features_df(data: Dict[str, Any]) -> pd.DataFrame:
    """
    Converts a single application dictionary into a DataFrame suitable for inference.
    """
    # Normalize key aliases if needed
    cleaned = {
        "applicant_name": data.get("applicant_name", "Applicant"),
        "age": float(data.get("age", 30)),
        "gender": str(data.get("gender", "Male")),
        "employment_type": str(data.get("employment_type", "Salaried")),
        "employment_experience": float(data.get("employment_experience", 5)),
        "annual_income": float(data.get("annual_income", 600000)),
        "monthly_income": float(data.get("monthly_income", float(data.get("annual_income", 600000)) / 12)),
        "credit_score": int(data.get("credit_score", 700)),
        "existing_loan": float(data.get("existing_loan", 0)),
        "monthly_emi": float(data.get("monthly_emi", 0)),
        "project_name": str(data.get("project_name", "Business Venture")),
        "project_category": str(data.get("project_category", "Technology")),
        "project_cost": float(data.get("project_cost", 1000000)),
        "expected_revenue": float(data.get("expected_revenue", 1500000)),
        "expected_profit": float(data.get("expected_profit", 350000)),
        "project_experience": float(data.get("project_experience", 3)),
        "requested_loan": float(data.get("requested_loan", 500000)),
        "loan_tenure": int(data.get("loan_tenure", 36)),
        "interest_rate": float(data.get("interest_rate", 10.5)),
        "loan_purpose": str(data.get("loan_purpose", "Working Capital")),
    }
    df = pd.DataFrame([cleaned])
    return engineer_features(df)
