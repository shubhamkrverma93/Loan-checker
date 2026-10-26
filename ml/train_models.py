"""
Model Training Script for Machine Learning Based Project Loan Approval System
Trains:
1. Logistic Regression -> Binary Classification (Approved / Not Approved)
2. Linear Regression   -> Regression (Approved / Suitable Loan Amount)
3. K-Nearest Neighbors -> Multi-class Classification (Risk Level: Low / Medium / High)

Saves trained models via Joblib and writes metrics to JSON for API consumption.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, roc_auc_score, mean_absolute_error,
    mean_squared_error, r2_score
)

from preprocess import (
    engineer_features, create_preprocessor,
    NUMERICAL_COLS, CATEGORICAL_COLS
)

def train_and_evaluate():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, "dataset.csv")
    
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}. Run generate_dataset.py first.")
        
    print(f"Loading dataset from: {dataset_path}")
    raw_df = pd.read_csv(dataset_path)
    print(f"Loaded {len(raw_df)} records.")
    
    # 1. Feature Engineering
    df = engineer_features(raw_df)
    
    # Targets
    y_class = df["loan_approved"].astype(int)
    y_reg = df["approved_loan_amount"].astype(float)
    y_knn = df["risk_level"].astype(str)
    
    # Feature columns
    feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS
    X = df[feature_cols]
    
    # Split: 80% train, 20% test (stratified on loan_approved)
    indices = np.arange(len(df))
    train_idx, test_idx = train_test_split(
        indices, test_size=0.20, random_state=42, stratify=y_class
    )
    
    X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
    
    # 2. Preprocessor Pipeline
    preprocessor = create_preprocessor()
    print("Fitting preprocessor on training data...")
    X_train_trans = preprocessor.fit_transform(X_train)
    X_test_trans = preprocessor.transform(X_test)
    
    # Target splits
    y_class_train, y_class_test = y_class.iloc[train_idx], y_class.iloc[test_idx]
    y_reg_train, y_reg_test = y_reg.iloc[train_idx], y_reg.iloc[test_idx]
    y_knn_train, y_knn_test = y_knn.iloc[train_idx], y_knn.iloc[test_idx]
    
    # ========================================================
    # 1. LOGISTIC REGRESSION (Approval Classification)
    # ========================================================
    print("\n--- Training Logistic Regression ---")
    logistic_model = LogisticRegression(max_iter=1000, C=1.0, random_state=42)
    logistic_model.fit(X_train_trans, y_class_train)
    
    y_class_pred = logistic_model.predict(X_test_trans)
    y_class_prob = logistic_model.predict_proba(X_test_trans)[:, 1]
    
    log_acc = float(accuracy_score(y_class_test, y_class_pred))
    log_prec = float(precision_score(y_class_test, y_class_pred, zero_division=0))
    log_rec = float(recall_score(y_class_test, y_class_pred, zero_division=0))
    log_f1 = float(f1_score(y_class_test, y_class_pred, zero_division=0))
    log_cm = confusion_matrix(y_class_test, y_class_pred).tolist()
    log_auc = float(roc_auc_score(y_class_test, y_class_prob))
    
    print(f"Accuracy:  {log_acc:.4f} ({log_acc*100:.2f}%)")
    print(f"Precision: {log_prec:.4f}")
    print(f"Recall:    {log_rec:.4f}")
    print(f"F1-Score:  {log_f1:.4f}")
    print(f"ROC-AUC:   {log_auc:.4f}")
    print(f"Confusion Matrix:\n{log_cm}")
    
    # ========================================================
    # 2. LINEAR REGRESSION (Suitable Loan Amount Prediction)
    # ========================================================
    print("\n--- Training Linear Regression ---")
    linear_model = LinearRegression()
    linear_model.fit(X_train_trans, y_reg_train)
    
    y_reg_pred = linear_model.predict(X_test_trans)
    
    lin_mae = float(mean_absolute_error(y_reg_test, y_reg_pred))
    lin_mse = float(mean_squared_error(y_reg_test, y_reg_pred))
    lin_rmse = float(np.sqrt(lin_mse))
    lin_r2 = float(r2_score(y_reg_test, y_reg_pred))
    
    print(f"MAE:       INR {lin_mae:,.2f}")
    print(f"RMSE:      INR {lin_rmse:,.2f}")
    print(f"R² Score:  {lin_r2:.4f} ({lin_r2*100:.2f}%)")
    
    # ========================================================
    # 3. K-NEAREST NEIGHBORS (Risk Assessment)
    # ========================================================
    print("\n--- Training K-Nearest Neighbors (KNN) ---")
    knn_model = KNeighborsClassifier(n_neighbors=5, metric="minkowski", p=2)
    knn_model.fit(X_train_trans, y_knn_train)
    
    y_knn_pred = knn_model.predict(X_test_trans)
    
    knn_acc = float(accuracy_score(y_knn_test, y_knn_pred))
    knn_prec = float(precision_score(y_knn_test, y_knn_pred, average="weighted", zero_division=0))
    knn_rec = float(recall_score(y_knn_test, y_knn_pred, average="weighted", zero_division=0))
    knn_f1 = float(f1_score(y_knn_test, y_knn_pred, average="weighted", zero_division=0))
    knn_classes = list(knn_model.classes_)
    knn_cm = confusion_matrix(y_knn_test, y_knn_pred, labels=knn_classes).tolist()
    
    print(f"Classes:   {knn_classes}")
    print(f"Accuracy:  {knn_acc:.4f} ({knn_acc*100:.2f}%)")
    print(f"Precision: {knn_prec:.4f}")
    print(f"Recall:    {knn_rec:.4f}")
    print(f"F1-Score:  {knn_f1:.4f}")
    print(f"Confusion Matrix:\n{knn_cm}")
    
    # ========================================================
    # 4. SAVE MODELS AND METRICS
    # ========================================================
    preprocessor_path = os.path.join(base_dir, "preprocessor.pkl")
    logistic_path = os.path.join(base_dir, "logistic_model.pkl")
    linear_path = os.path.join(base_dir, "linear_model.pkl")
    knn_path = os.path.join(base_dir, "knn_model.pkl")
    metrics_path = os.path.join(base_dir, "metrics.json")
    
    joblib.dump(preprocessor, preprocessor_path)
    joblib.dump(logistic_model, logistic_path)
    joblib.dump(linear_model, linear_path)
    joblib.dump(knn_model, knn_path)
    
    metrics = {
        "logistic_regression": {
            "model_name": "Logistic Regression",
            "type": "Classification (Approval / Rejection)",
            "accuracy": round(log_acc * 100, 2),
            "precision": round(log_prec * 100, 2),
            "recall": round(log_rec * 100, 2),
            "f1_score": round(log_f1 * 100, 2),
            "roc_auc": round(log_auc * 100, 2),
            "confusion_matrix": log_cm,
            "classes": ["Not Approved", "Approved"],
            "test_samples": len(y_class_test)
        },
        "linear_regression": {
            "model_name": "Linear Regression",
            "type": "Regression (Loan Amount Prediction)",
            "mae": round(lin_mae, 2),
            "mse": round(lin_mse, 2),
            "rmse": round(lin_rmse, 2),
            "r2_score": round(lin_r2 * 100, 2),
            "raw_r2": round(lin_r2, 4),
            "test_samples": len(y_reg_test)
        },
        "knn": {
            "model_name": "K-Nearest Neighbors (KNN)",
            "type": "Classification (Risk Tier: Low / Medium / High)",
            "n_neighbors": 5,
            "accuracy": round(knn_acc * 100, 2),
            "precision": round(knn_prec * 100, 2),
            "recall": round(knn_rec * 100, 2),
            "f1_score": round(knn_f1 * 100, 2),
            "classes": knn_classes,
            "confusion_matrix": knn_cm,
            "test_samples": len(y_knn_test)
        },
        "metadata": {
            "dataset_samples": len(df),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "split_ratio": "80/20",
            "is_synthetic": True,
            "label": "DEMO / SYNTHETIC EDUCATIONAL DATASET"
        }
    }
    
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
        
    print("\nSaved artifacts successfully:")
    print(f"- {preprocessor_path}")
    print(f"- {logistic_path}")
    print(f"- {linear_path}")
    print(f"- {knn_path}")
    print(f"- {metrics_path}")

if __name__ == "__main__":
    train_and_evaluate()
