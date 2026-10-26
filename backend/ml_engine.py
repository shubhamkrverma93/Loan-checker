"""
Machine Learning Engine for Loan Approval Inference, Risk Scoring,
and Explainable Multi-Model Decision Synthesis.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, List

# Add base and ml folders to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)
ML_DIR = os.path.join(BASE_DIR, "ml")
if ML_DIR not in sys.path:
    sys.path.append(ML_DIR)

try:
    from ml.preprocess import dict_to_features_df, NUMERICAL_COLS, CATEGORICAL_COLS
except ImportError:
    from ml.preprocess import dict_to_features_df, NUMERICAL_COLS, CATEGORICAL_COLS


class MLEngine:
    def __init__(self):
        self.preprocessor = None
        self.logistic_model = None
        self.linear_model = None
        self.knn_model = None
        self.metrics = {}
        self.training_df = None
        self.load_models()

    def load_models(self):
        preprocessor_path = os.path.join(ML_DIR, "preprocessor.pkl")
        logistic_path = os.path.join(ML_DIR, "logistic_model.pkl")
        linear_path = os.path.join(ML_DIR, "linear_model.pkl")
        knn_path = os.path.join(ML_DIR, "knn_model.pkl")
        metrics_path = os.path.join(ML_DIR, "metrics.json")
        dataset_path = os.path.join(ML_DIR, "dataset.csv")

        if not all(os.path.exists(p) for p in [preprocessor_path, logistic_path, linear_path, knn_path]):
            raise FileNotFoundError(
                "Trained model artifacts not found. Please run 'python ml/train_models.py' first."
            )

        self.preprocessor = joblib.load(preprocessor_path)
        self.logistic_model = joblib.load(logistic_path)
        self.linear_model = joblib.load(linear_path)
        self.knn_model = joblib.load(knn_path)

        if os.path.exists(metrics_path):
            with open(metrics_path, "r", encoding="utf-8") as f:
                self.metrics = json.load(f)

        if os.path.exists(dataset_path):
            self.training_df = pd.read_csv(dataset_path)

    def predict(self, app_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes inference across all 3 models and combines into explainable outcome.
        """
        # Convert input dict to feature DataFrame
        df_feat = dict_to_features_df(app_data)
        feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS
        X = df_feat[feature_cols]
        X_trans = self.preprocessor.transform(X)

        # 1. LOGISTIC REGRESSION (Approval)
        log_prob_arr = self.logistic_model.predict_proba(X_trans)[0]
        # Class 1 is "Approved"
        prob_approved = float(log_prob_arr[1])
        log_prediction = "Approved" if prob_approved >= 0.50 else "Not Approved"

        # 2. LINEAR REGRESSION (Suitable Loan Amount)
        raw_pred_amount = float(self.linear_model.predict(X_trans)[0])
        requested_loan = float(app_data.get("requested_loan", 500000))
        # Ensure predicted amount is positive and within a practical educational envelope
        predicted_amount = max(0.0, round(raw_pred_amount, -2))
        # Cap at requested loan * 1.1 for realism
        predicted_amount = min(predicted_amount, round(requested_loan * 1.1, -2))
        ratio_of_requested = round(predicted_amount / max(requested_loan, 1.0), 4)
        diff_from_requested = round(predicted_amount - requested_loan, 2)

        # 3. K-NEAREST NEIGHBORS (Risk Assessment & Nearest Profiles)
        knn_risk = str(self.knn_model.predict(X_trans)[0])
        
        # Extract 5 nearest neighbors
        distances, indices = self.knn_model.kneighbors(X_trans, n_neighbors=5)
        similar_profiles = []
        if self.training_df is not None:
            for dist, idx in zip(distances[0], indices[0]):
                if idx < len(self.training_df):
                    row = self.training_df.iloc[idx]
                    similar_profiles.append({
                        "project_name": str(row.get("project_name", "Historical Venture")),
                        "project_category": str(row.get("project_category", "General")),
                        "credit_score": int(row.get("credit_score", 700)),
                        "requested_loan": float(row.get("requested_loan", 0)),
                        "loan_approved": bool(row.get("loan_approved", 1)),
                        "risk_level": str(row.get("risk_level", "Medium Risk")),
                        "similarity_distance": round(float(dist), 3)
                    })

        # 4. DECISION ENGINE (Rule-Based Synthesis)
        credit_score = int(app_data.get("credit_score", 650))
        annual_income = float(app_data.get("annual_income", 500000))
        monthly_emi = float(app_data.get("monthly_emi", 0))
        monthly_income = float(app_data.get("monthly_income") or annual_income / 12)
        dti = monthly_emi / max(monthly_income, 1.0)
        expected_profit = float(app_data.get("expected_profit", 100000))

        recommendation, explanation = self._synthesize_recommendation(
            prob_approved=prob_approved,
            log_prediction=log_prediction,
            predicted_amount=predicted_amount,
            requested_loan=requested_loan,
            knn_risk=knn_risk,
            credit_score=credit_score,
            dti=dti
        )

        key_factors = self._generate_key_factors(
            credit_score=credit_score,
            dti=dti,
            requested_loan=requested_loan,
            annual_income=annual_income,
            expected_profit=expected_profit,
            employment_exp=float(app_data.get("employment_experience", 0)),
            project_cost=float(app_data.get("project_cost", 1000000))
        )

        return {
            "logistic_regression": {
                "prediction": log_prediction,
                "probability": round(prob_approved, 4),
                "confidence_percentage": round(prob_approved * 100, 2)
            },
            "linear_regression": {
                "predicted_loan_amount": round(predicted_amount, 2),
                "ratio_of_requested": ratio_of_requested,
                "difference_from_requested": diff_from_requested
            },
            "knn": {
                "risk_level": knn_risk,
                "nearest_neighbors_count": 5,
                "similar_profiles": similar_profiles
            },
            "recommendation": recommendation,
            "explanation": explanation,
            "key_factors": key_factors,
            "disclaimer": (
                "Educational model output, not a lending decision. This system is an educational "
                "Machine Learning project. Predictions are generated from training data and statistical "
                "models and must not be considered a real banking or credit decision."
            )
        }

    def _synthesize_recommendation(
        self, prob_approved: float, log_prediction: str,
        predicted_amount: float, requested_loan: float,
        knn_risk: str, credit_score: int, dti: float
    ) -> Tuple[str, str]:
        """
        Synthesizes rule-based recommendation across all 3 models.
        """
        amount_ratio = predicted_amount / max(requested_loan, 1.0)

        # Favorable condition
        if prob_approved >= 0.70 and knn_risk == "Low Risk" and amount_ratio >= 0.70 and credit_score >= 680:
            rec = "Favorable"
            expl = (
                f"Application demonstrates strong convergence across all models. "
                f"Logistic Regression predicts an approval probability of {prob_approved*100:.1f}%. "
                f"The KNN model places this profile in the 'Low Risk' cluster with high neighbor consistency. "
                f"Linear Regression estimated a viable loan capacity of INR {predicted_amount:,.0f} "
                f"({amount_ratio*100:.0f}% of requested INR {requested_loan:,.0f})."
            )
        # Unfavorable condition
        elif prob_approved < 0.45 or knn_risk == "High Risk" or credit_score < 580 or dti > 0.55:
            rec = "Unfavorable"
            reasons = []
            if prob_approved < 0.45:
                reasons.append(f"approval probability is restrained at {prob_approved*100:.1f}%")
            if knn_risk == "High Risk":
                reasons.append("KNN mapped this profile to a High Risk cohort")
            if credit_score < 580:
                reasons.append(f"credit score of {credit_score} is below benchmark")
            if dti > 0.55:
                reasons.append(f"existing debt-to-income of {dti*100:.1f}% exceeds safe repayment limits")

            expl = (
                f"Application encounters model headwinds: {', '.join(reasons)}. "
                f"Linear Regression projects a constrained credit threshold of INR {predicted_amount:,.0f}. "
                f"Model consensus suggests an unfavorable outcome under current financial parameters."
            )
        # Mixed / Needs Review
        else:
            rec = "Needs Review"
            expl = (
                f"Application exhibits mixed signals across algorithms. "
                f"Logistic Regression indicates an approval likelihood of {prob_approved*100:.1f}% ({log_prediction}), "
                f"while KNN classifies the risk profile as '{knn_risk}'. "
                f"Linear Regression recommends INR {predicted_amount:,.0f} against requested INR {requested_loan:,.0f}. "
                f"A secondary review is advised to reconcile project collateral and debt servicing."
            )

        return rec, expl

    def _generate_key_factors(
        self, credit_score: int, dti: float, requested_loan: float,
        annual_income: float, expected_profit: float,
        employment_exp: float, project_cost: float
    ) -> List[Dict[str, str]]:
        factors = []

        # Credit Score factor
        if credit_score >= 740:
            factors.append({
                "factor": "Credit Score",
                "impact": "Positive",
                "description": f"Excellent credit score ({credit_score}) indicates exemplary historical debt discipline."
            })
        elif credit_score >= 640:
            factors.append({
                "factor": "Credit Score",
                "impact": "Neutral",
                "description": f"Fair credit score ({credit_score}) meets basic requirements but warrants verification."
            })
        else:
            factors.append({
                "factor": "Credit Score",
                "impact": "Negative",
                "description": f"Sub-prime credit score ({credit_score}) significantly increases default risk score."
            })

        # Debt to Income
        if dti <= 0.30:
            factors.append({
                "factor": "Debt-to-Income (DTI)",
                "impact": "Positive",
                "description": f"Low existing monthly EMI burden ({dti*100:.1f}%) provides ample cash buffer."
            })
        elif dti <= 0.50:
            factors.append({
                "factor": "Debt-to-Income (DTI)",
                "impact": "Warning",
                "description": f"Moderate DTI ({dti*100:.1f}%). Ongoing commitments take up a substantial portion of earnings."
            })
        else:
            factors.append({
                "factor": "Debt-to-Income (DTI)",
                "impact": "Negative",
                "description": f"Elevated DTI ({dti*100:.1f}%) exceeds standard institutional risk tolerance."
            })

        # Project Viability
        profit_ratio = expected_profit / max(requested_loan, 1.0)
        if profit_ratio >= 0.25:
            factors.append({
                "factor": "Project Profitability",
                "impact": "Positive",
                "description": f"Expected annual profit of INR {expected_profit:,.0f} comfortably covers debt servicing."
            })
        else:
            factors.append({
                "factor": "Project Profitability",
                "impact": "Warning",
                "description": f"Expected profit (INR {expected_profit:,.0f}) provides narrow debt coverage margins."
            })

        # Financing ratio
        loan_to_cost = requested_loan / max(project_cost, 1.0)
        if loan_to_cost <= 0.65:
            factors.append({
                "factor": "Promoter Equity / LTV",
                "impact": "Positive",
                "description": f"Loan-to-cost ratio ({loan_to_cost*100:.1f}%) shows strong applicant equity commitment."
            })
        else:
            factors.append({
                "factor": "Promoter Equity / LTV",
                "impact": "Warning",
                "description": f"High loan-to-cost ratio ({loan_to_cost*100:.1f}%) requires heavy leverage for project execution."
            })

        return factors

# Global singleton
ml_engine = MLEngine()
