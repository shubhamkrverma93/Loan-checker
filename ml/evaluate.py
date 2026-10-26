"""
Model Evaluation Script for Machine Learning Based Project Loan Approval System
Provides detailed performance reports, metric tables, and model comparisons.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix, r2_score, mean_absolute_error, mean_squared_error
from preprocess import engineer_features, NUMERICAL_COLS, CATEGORICAL_COLS

def run_evaluation_report():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, "dataset.csv")
    
    if not os.path.exists(dataset_path):
        print("Dataset not found. Please run generate_dataset.py first.")
        return
        
    df = pd.read_csv(dataset_path)
    df = engineer_features(df)
    
    feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS
    X = df[feature_cols]
    y_class = df["loan_approved"].astype(int)
    y_reg = df["approved_loan_amount"].astype(float)
    y_knn = df["risk_level"].astype(str)
    
    # Load models
    preprocessor = joblib.load(os.path.join(base_dir, "preprocessor.pkl"))
    log_model = joblib.load(os.path.join(base_dir, "logistic_model.pkl"))
    lin_model = joblib.load(os.path.join(base_dir, "linear_model.pkl"))
    knn_model = joblib.load(os.path.join(base_dir, "knn_model.pkl"))
    
    X_trans = preprocessor.transform(X)
    
    print("=" * 65)
    print("MACHINE LEARNING PROJECT LOAN APPROVAL SYSTEM - EVALUATION REPORT")
    print("=" * 65)
    
    # 1. Logistic Regression
    y_pred_log = log_model.predict(X_trans)
    print("\n1. LOGISTIC REGRESSION (Approval Classification)")
    print("-" * 50)
    print(classification_report(y_class, y_pred_log, target_names=["Not Approved", "Approved"]))
    print("Confusion Matrix:")
    print(confusion_matrix(y_class, y_pred_log))
    
    # 2. Linear Regression
    y_pred_lin = lin_model.predict(X_trans)
    mae = mean_absolute_error(y_reg, y_pred_lin)
    rmse = np.sqrt(mean_squared_error(y_reg, y_pred_lin))
    r2 = r2_score(y_reg, y_pred_lin)
    print("\n2. LINEAR REGRESSION (Loan Amount Prediction)")
    print("-" * 50)
    print(f"Mean Absolute Error (MAE):     INR {mae:,.2f}")
    print(f"Root Mean Squared Error (RMSE): INR {rmse:,.2f}")
    print(f"R-squared Score (R2):          {r2:.4f} ({r2*100:.2f}%)")
    
    # 3. KNN
    y_pred_knn = knn_model.predict(X_trans)
    print("\n3. K-NEAREST NEIGHBORS (Risk Level Classification)")
    print("-" * 50)
    print(classification_report(y_knn, y_pred_knn))
    print("Confusion Matrix:")
    print(confusion_matrix(y_knn, y_pred_knn, labels=knn_model.classes_))
    print("Classes:", list(knn_model.classes_))
    
    print("\n" + "=" * 65)
    print("DISCLAIMER: This is an educational ML evaluation report.")
    print("Models are trained on synthetic demonstration data.")
    print("=" * 65)

if __name__ == "__main__":
    run_evaluation_report()
