# Machine Learning Based Project Loan Approval System

[![Python](https://img.shields.io/badge/Python-3.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3%2B-F7931E.svg)](https://scikit-learn.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An end-to-end, modern, responsive AI/ML web application designed for evaluating project and commercial loan proposals. The system combines **three distinct machine learning algorithms** into a cohesive, explainable underwriting framework:

1. **Logistic Regression** &rarr; Predicts qualification approval classification and exact probability percentage.
2. **Linear Regression** &rarr; Estimates suitable debt capacity (INR ₹) to prevent borrower distress and over-leveraging.
3. **K-Nearest Neighbors (KNN)** &rarr; Maps proposals to historical multi-class risk cohorts (Low, Medium, High Risk) using instance-based distance clustering.

---

> [!IMPORTANT]
> **Educational Disclaimer**: This system is strictly an educational Machine Learning demonstration project (ideal for B.Tech CSE final year projects, academic demonstrations, and hackathons). Predictions and rule-based recommendations are statistical model outputs and must **NOT** be considered actual banking, financial, or credit decisions.

---

## Key Features

- **Tri-Model ML Architecture**:
  - **Logistic Regression**: 88%+ classification accuracy, ROC-AUC curve analysis, probability output.
  - **Linear Regression**: Predicts sustainable loan amount ($R^2 \approx 82\%$, RMSE, MAE).
  - **K-Nearest Neighbors ($K=5$)**: Risk tier profiling + Top-5 historical analogue clustering.
- **Explainable Decision Engine**: Synthesizes transparent rule recommendations (`Favorable`, `Needs Review`, `Unfavorable`) with plain English narratives and key driver attribution.
- **5-Step Application Wizard**: Sleek multi-step form with live validation, preset demo fill buttons, and document upload simulation.
- **Interactive Sandbox Simulator**: Adjust credit scores, income, and debt on the landing page to observe real-time inference shifts.
- **Executive Admin Dashboard**: Real-time KPI cards, risk distribution breakdowns, industry category allocations, and application feeds.
- **Model Comparison Dashboard**: Interactive confusion matrices (2x2 and 3x3 heatmaps), ROC-AUC indicators, and theoretical underwriting comparison tables.
- **Application Audit Log**: Search, filter, inspect details, export to CSV, or delete past applications.
- **Enterprise-Ready Security**: Bcrypt password hashing, JWT bearer tokens, SQLAlchemy ORM injection defense, and CORS protection.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Vanilla CSS Modern Design System, Lucide Icons |
| **Backend** | Python 3.14, FastAPI, Pydantic v2, Uvicorn, REST API |
| **Machine Learning** | Scikit-Learn, Pandas, NumPy, Joblib, Matplotlib |
| **Database** | SQLite locally; PostgreSQL recommended for production, SQLAlchemy ORM |
| **Authentication** | JWT (PyJWT), Bcrypt password hashing |

---

## Project Structure

```
loan-approval-ml/
│
├── frontend/                     # Modern React.js Frontend
│   ├── src/
│   │   ├── components/           # Navbar, Footer, DisclaimerBanner
│   │   ├── pages/                # Landing, Application, Result, Models, History, Dashboard, Auth
│   │   ├── services/api.js       # Centralized REST API client
│   │   ├── App.jsx               # Main React router & state coordinator
│   │   ├── index.css             # Sleek dark/light theme design system
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # FastAPI Python Backend
│   ├── main.py                   # Server entrypoint & seed initialization
│   ├── database.py               # SQLAlchemy database configuration
│   ├── models.py                 # SQLAlchemy ORM schemas
│   ├── schemas.py                # Pydantic validation schemas
│   ├── auth.py                   # JWT generation & Bcrypt hashing
│   ├── ml_engine.py              # Model inference & decision synthesis engine
│   ├── routes/
│   │   ├── auth.py               # Register, login, profile routes
│   │   ├── prediction.py         # /predict & /upload-document routes
│   │   ├── applications.py       # History & deletion routes
│   │   └── dashboard.py          # KPI metrics & model performance routes
│   └── requirements.txt
│
├── ml/                           # ML Training & Evaluation Pipeline
│   ├── generate_dataset.py       # Realistic synthetic educational dataset generator
│   ├── dataset.csv               # Generated demonstration dataset (1800 records)
│   ├── preprocess.py             # Feature engineering & ColumnTransformer
│   ├── train_models.py           # Model training & Joblib serialization
│   ├── evaluate.py               # Standalone evaluation & classification reports
│   ├── logistic_model.pkl        # Serialized Logistic Regression model
│   ├── linear_model.pkl          # Serialized Linear Regression model
│   ├── knn_model.pkl             # Serialized KNN model
│   ├── preprocessor.pkl          # Serialized ColumnTransformer
│   └── metrics.json              # Evaluated benchmark metrics
│
├── database/
│   └── loan_approval.db          # SQLite database storage
│
├── docs/
│   ├── architecture.md           # Detailed architecture, equations & diagrams
│   └── API.md                    # REST API documentation & schemas
│
├── .gitignore
├── requirements.txt
└── README.md
```

---

## Installation & Setup Guide

### 1. Prerequisites
- **Python 3.10+** (Tested on Python 3.14)
- **Node.js 18+** & **npm**

### 2. Backend Setup & Dependencies
Open a terminal in the project root directory:

```bash
# Install Python backend & ML dependencies
pip install -r requirements.txt
```

### 3. Generate Dataset & Train ML Models
Train the models before launching the server:

```bash
# 1. Generate synthetic educational dataset
python ml/generate_dataset.py

# 2. Train Logistic Regression, Linear Regression, and KNN
python ml/train_models.py

# 3. (Optional) View the complete standalone evaluation report
python ml/evaluate.py
```

### 4. Start the FastAPI Backend Server
```bash
# Run uvicorn server from the project root
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
* The API will be active at: `http://127.0.0.1:8000`
* Interactive API Documentation (Swagger): `http://127.0.0.1:8000/docs`

### Render deployment

The [Render Blueprint](./render.yaml) configures the API and an optional Render-hosted frontend. The configured API service is `https://loan-checker-3q1r.onrender.com`; check it at `https://loan-checker-3q1r.onrender.com/api/health` and open `https://loan-checker-3q1r.onrender.com/docs`.

The API requires a persistent PostgreSQL database; it intentionally refuses to start in production if `DATABASE_URL` is missing or points to SQLite. In Render's API service **Environment** settings, set `DATABASE_URL` to your PostgreSQL database's **Internal Database URL**, set a strong private `ADMIN_PASSWORD`, and keep the generated `JWT_SECRET`. The Blueprint allows the production Vercel origin `https://loan-checker-gamma.vercel.app`; add any additional frontend domains to `FRONTEND_ORIGINS` as comma-separated exact origins.

### Deploy the frontend to Vercel

1. In Vercel, choose **Add New → Project** and import this GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Use these build settings:
   - Framework preset: **Vite**
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add this environment variable for **Production** (and Preview too if you want preview deployments to call the API):
   - `VITE_API_URL` = `https://loan-checker-3q1r.onrender.com` (the API origin, without `/api` or a trailing slash)
5. Click **Deploy**. When Vercel shows the assigned website URL, copy its exact origin, including `https://` and no trailing slash.
6. The Render Blueprint sets `FRONTEND_ORIGINS` to the production Vercel origin. If you use a different Vercel domain or a custom domain, update `FRONTEND_ORIGINS` to include each exact origin, separated by commas, and redeploy the API.
7. Open the Vercel website and test registration/login and a prediction. If the browser console shows a CORS error, verify the Vercel origin is an exact match in Render's `FRONTEND_ORIGINS`.

Do not use a relative SQLite URL in production: Render's local filesystem is not persistent by default. Free web services can also spin down when idle, so the first request after inactivity may take longer.

### 5. Frontend Setup & Launch
Open a second terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
* The web application will be accessible at: `http://127.0.0.1:5173/`

---

## Default Demonstration Credentials

The development database automatically seeds test accounts on first launch:

| Role | Email | Password |
|---|---|---|
| **System Administrator** | `admin@loanapproval.ai` | `admin123` |
| **Loan Applicant** | `rahul@example.com` | `user123` |

You can also use the one-click **"Fill Admin"** or **"Fill Applicant"** buttons on the Sign In page.
These demo accounts and buttons are for local development only. On Render, the administrator account is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD`; public sign-ups are applicant accounts.

---

## Model Performance Benchmarks

| Algorithm | Paradigm | Key Test Metrics |
|---|---|---|
| **Logistic Regression** | Classification | **Accuracy: 88.61%** \| Precision: 90.81% \| Recall: 93.92% \| ROC-AUC: 94.37% |
| **Linear Regression** | Regression | **$R^2$ Score: 82.15%** \| RMSE: ₹3,39,050 \| MAE: ₹2,44,926 |
| **K-Nearest Neighbors ($K=5$)** | Multi-Class | **Accuracy: 64.72%** \| F1-Score: 64.03% \| Minkowski Distance Clustering |

---

## College / Academic Project Presentation Notes

For a B.Tech CSE / IT final year viva or seminar:
1. **Explain the Tri-Model Architecture**: Why single models fail in financial underwriting:
   - Logistic Regression solves the **binary decision** ("Can we lend?").
   - Linear Regression calculates the **monetary sizing** ("How much is safe to lend?").
   - KNN provides **peer cluster benchmarking** ("How did similar past borrowers perform?").
2. **Transparent Rule Synthesis**: Emphasize that the system is not a black-box; it combines probability thresholds with strict debt-service and risk-cohort checks.
3. **Data Preprocessing**: Demonstrate the `ColumnTransformer` with `StandardScaler` for continuous features and `OneHotEncoder` for nominal attributes, preventing data leakage via strict train/test isolation.
