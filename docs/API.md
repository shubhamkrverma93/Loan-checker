# REST API Documentation

## Machine Learning Based Project Loan Approval API

Base URL: `http://127.0.0.1:8000`  
Interactive Swagger Docs: `http://127.0.0.1:8000/docs`  
ReDoc Documentation: `http://127.0.0.1:8000/redoc`

---

## 1. Authentication Endpoints

### Register User
* **Method:** `POST`
* **Endpoint:** `/api/auth/register`
* **Payload:**
```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "securepassword123",
  "role": "applicant"
}
```
* **Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Aarav Sharma",
    "email": "aarav@example.com",
    "role": "applicant",
    "created_at": "2026-10-18T10:30:00"
  }
}
```

### Login
* **Method:** `POST`
* **Endpoint:** `/api/auth/login`
* **Payload:**
```json
{
  "email": "admin@loanapproval.ai",
  "password": "admin123"
}
```

### Current User Profile
* **Method:** `GET`
* **Endpoint:** `/api/auth/me`
* **Headers:** `Authorization: Bearer <TOKEN>`

---

## 2. Prediction & Loan Evaluation Endpoints

### Multi-Model Loan Prediction
* **Method:** `POST`
* **Endpoint:** `/api/predict`
* **Headers:** Optional `Authorization: Bearer <TOKEN>`
* **Payload:**
```json
{
  "applicant_name": "Rajesh Singhania",
  "age": 36,
  "gender": "Male",
  "employment_type": "Business Owner",
  "employment_experience": 10.0,
  "annual_income": 2200000,
  "monthly_income": 183333,
  "credit_score": 785,
  "existing_loan": 150000,
  "monthly_emi": 12000,
  "requested_loan": 1000000,
  "loan_tenure": 48,
  "interest_rate": 10.0,
  "loan_purpose": "Business Expansion",
  "project_name": "Automated Warehousing Facility",
  "project_category": "Technology",
  "project_cost": 2000000,
  "expected_revenue": 4200000,
  "expected_profit": 1100000,
  "project_experience": 6.0
}
```

* **Response (200 OK):**
```json
{
  "application_id": 4,
  "logistic_regression": {
    "prediction": "Approved",
    "probability": 0.9999,
    "confidence_percentage": 99.99
  },
  "linear_regression": {
    "predicted_loan_amount": 1100000.0,
    "ratio_of_requested": 1.1,
    "difference_from_requested": 100000.0
  },
  "knn": {
    "risk_level": "Low Risk",
    "nearest_neighbors_count": 5,
    "similar_profiles": [
      {
        "project_name": "Retail Business Phase I",
        "project_category": "Retail",
        "credit_score": 668,
        "requested_loan": 2245000.0,
        "loan_approved": false,
        "risk_level": "High Risk",
        "similarity_distance": 2.996
      }
    ]
  },
  "recommendation": "Favorable",
  "explanation": "Application demonstrates strong convergence across all models. Logistic Regression predicts an approval probability of 100.0%...",
  "key_factors": [
    {
      "factor": "Credit Score",
      "impact": "Positive",
      "description": "Excellent credit score (785) indicates exemplary historical debt discipline."
    }
  ],
  "disclaimer": "Educational model output, not a lending decision...",
  "created_at": "2026-10-18T05:50:25"
}
```

### Document Upload
* **Method:** `POST`
* **Endpoint:** `/api/upload-document`
* **Content-Type:** `multipart/form-data`
* **Form Field:** `file` (Supports `.pdf`, `.png`, `.jpg`, `.jpeg` up to 10MB)

---

## 3. Application Audit & History Endpoints

### List Applications
* **Method:** `GET`
* **Endpoint:** `/api/applications`
* **Query Parameters:**
  * `skip` (int, default 0)
  * `limit` (int, default 50)
  * `search` (string, optional)
  * `recommendation` (string, optional: `Favorable`, `Needs Review`, `Unfavorable`)

### Get Application By ID
* **Method:** `GET`
* **Endpoint:** `/api/application/{id}`

### Delete Application
* **Method:** `DELETE`
* **Endpoint:** `/api/application/{id}`

---

## 4. Analytics & Model Performance Endpoints

### Executive Dashboard Metrics
* **Method:** `GET`
* **Endpoint:** `/api/dashboard`
* **Response (200 OK):**
```json
{
  "total_applications": 4,
  "approved_predictions": 1,
  "review_cases": 1,
  "unfavorable_predictions": 2,
  "approval_rate": 25.0,
  "total_requested_volume": 3600000.0,
  "total_predicted_volume": 2969300.0,
  "average_credit_score": 696.3,
  "risk_distribution": {
    "Low Risk": 1,
    "Medium Risk": 1,
    "High Risk": 2
  },
  "recommendation_distribution": {
    "Favorable": 1,
    "Needs Review": 1,
    "Unfavorable": 2
  },
  "category_distribution": {
    "Manufacturing": 1,
    "Retail": 1,
    "Services": 1,
    "Technology": 1
  },
  "recent_applications": [...]
}
```

### Model Performance Benchmarks
* **Method:** `GET`
* **Endpoint:** `/api/model-performance`
* **Response (200 OK):** Returns accuracy, precision, recall, F1-scores, confusion matrices, ROC-AUC, R², RMSE, and MAE across Logistic Regression, Linear Regression, and K-Nearest Neighbors.
