"""
Dataset Generator for Machine Learning Based Project Loan Approval System
Generates realistic synthetic educational data for training:
1. Logistic Regression (Loan Approval Classification)
2. Linear Regression (Predicted Suitable Loan Amount)
3. K-Nearest Neighbors (Risk Level Classification)

LABEL: DEMO / SYNTHETIC EDUCATIONAL DATASET
"""

import numpy as np
import pandas as pd
import os

def generate_loan_dataset(num_samples: int = 1500, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)
    
    genders = ["Male", "Female", "Other"]
    gender_dist = [0.58, 0.39, 0.03]
    
    employment_types = ["Salaried", "Self-Employed", "Business Owner", "Freelancer"]
    emp_dist = [0.45, 0.30, 0.18, 0.07]
    
    project_categories = ["Technology", "Retail", "Manufacturing", "Healthcare", "Agriculture", "Services"]
    proj_dist = [0.25, 0.20, 0.18, 0.12, 0.10, 0.15]
    
    purposes = ["Equipment Purchase", "Working Capital", "Business Expansion", "Research & Development", "Inventory Procurement"]
    purpose_dist = [0.30, 0.28, 0.22, 0.08, 0.12]
    
    data = []
    
    for i in range(num_samples):
        # Personal
        age = int(np.clip(np.random.normal(38, 9), 21, 65))
        gender = np.random.choice(genders, p=gender_dist)
        emp_type = np.random.choice(employment_types, p=emp_dist)
        max_exp = max(0, age - 20)
        emp_exp = round(float(np.clip(np.random.beta(2, 3) * max_exp, 0.5, max_exp)), 1)
        
        # Financial
        # Annual income roughly log-normal between 3L and 40L
        base_income = np.random.lognormal(mean=13.8, sigma=0.55)
        annual_income = round(float(np.clip(base_income, 300000, 5000000)), -3)
        monthly_income = round(annual_income / 12, 2)
        
        # Credit Score between 350 and 880 (centered ~ 690)
        credit_score = int(np.clip(np.random.normal(685, 95), 350, 880))
        
        # Existing debt depends on income and age
        has_debt = np.random.rand() < 0.65
        if has_debt:
            existing_loan = round(float(np.random.uniform(0.1, 1.5) * annual_income), -3)
            # Monthly EMI for existing loan
            monthly_emi = round(float(np.clip((existing_loan / 36) * np.random.uniform(0.9, 1.15), 2000, monthly_income * 0.7)), -2)
        else:
            existing_loan = 0.0
            monthly_emi = 0.0
            
        # Debt-to-income ratio
        dti = monthly_emi / max(monthly_income, 1.0)
        
        # Project information
        category = np.random.choice(project_categories, p=proj_dist)
        purpose = np.random.choice(purposes, p=purpose_dist)
        proj_exp = round(float(np.clip(np.random.uniform(0, min(emp_exp, 20)), 0, 25)), 1)
        
        # Project cost between 2L and 80L
        cost_multiplier = np.random.uniform(0.8, 3.5)
        project_cost = round(float(np.clip(annual_income * cost_multiplier, 200000, 8000000)), -3)
        
        # Expected Revenue & Profit
        revenue_margin = np.random.uniform(1.1, 2.4)
        expected_revenue = round(float(project_cost * revenue_margin), -3)
        profit_margin = np.random.uniform(0.12, 0.38)
        expected_profit = round(float(expected_revenue * profit_margin), -3)
        
        # Requested loan typically 40% to 80% of project cost
        loan_ratio = np.random.uniform(0.35, 0.85)
        requested_loan = round(float(np.clip(project_cost * loan_ratio, 100000, 5000000)), -3)
        
        loan_tenure = int(np.random.choice([12, 24, 36, 48, 60, 84]))
        interest_rate = round(float(np.random.uniform(8.5, 15.5)), 2)
        
        # Project Name generator
        proj_name = f"{category} {purpose.split()[0]} Phase {np.random.choice(['I', 'II', 'III', 'Alpha', 'NextGen'])}"
        
        # -----------------
        # GROUND TRUTH DETERMINATION (Simulating Realistic Banking Criteria)
        # -----------------
        # Credit score factor: 300 to 900 -> 0 to 1
        cs_factor = (credit_score - 350) / (880 - 350)
        
        # DTI factor: lower is better (<0.3 is great, >0.5 is poor)
        dti_factor = np.clip(1.0 - (dti / 0.6), 0.0, 1.0)
        
        # Financial health: requested loan vs annual income
        affordability = annual_income / max(requested_loan, 100000)
        affordability_factor = np.clip(affordability / 1.5, 0.0, 1.0)
        
        # Project strength: expected profit vs requested loan
        profit_coverage = expected_profit / max(requested_loan * 0.3, 10000)
        profit_factor = np.clip(profit_coverage / 2.0, 0.0, 1.0)
        
        # Experience factor
        exp_factor = np.clip((emp_exp + proj_exp) / 20.0, 0.0, 1.0)
        
        # Composite score
        composite_score = (
            0.35 * cs_factor +
            0.20 * dti_factor +
            0.20 * affordability_factor +
            0.15 * profit_factor +
            0.10 * exp_factor +
            np.random.normal(0, 0.05)
        )
        
        # Target 1: Approval (1 or 0)
        # Threshold set so ~64% approved, ~36% rejected
        is_approved = 1 if composite_score >= 0.53 and credit_score >= 600 and dti < 0.52 else 0
        
        # Target 2: Approved Loan Amount (Linear Regression target)
        if is_approved == 1:
            amount_ratio = np.clip(0.72 + (composite_score - 0.50) * 0.50, 0.65, 1.0)
            approved_loan_amount = round(float(requested_loan * amount_ratio), -3)
        else:
            amount_ratio = np.clip(composite_score * 0.60, 0.15, 0.55)
            approved_loan_amount = round(float(requested_loan * amount_ratio), -3)
            
        # Target 3: Risk Level (KNN target)
        if composite_score >= 0.65 and credit_score >= 710 and dti < 0.38:
            risk_level = "Low Risk"
        elif composite_score >= 0.48 and credit_score >= 580 and dti < 0.55:
            risk_level = "Medium Risk"
        else:
            risk_level = "High Risk"
            
        row = {
            "applicant_name": f"Applicant_{i+101}",
            "age": age,
            "gender": gender,
            "employment_type": emp_type,
            "employment_experience": emp_exp,
            "annual_income": annual_income,
            "monthly_income": monthly_income,
            "credit_score": credit_score,
            "existing_loan": existing_loan,
            "monthly_emi": monthly_emi,
            "project_name": proj_name,
            "project_category": category,
            "project_cost": project_cost,
            "expected_revenue": expected_revenue,
            "expected_profit": expected_profit,
            "project_experience": proj_exp,
            "requested_loan": requested_loan,
            "loan_tenure": loan_tenure,
            "interest_rate": interest_rate,
            "loan_purpose": purpose,
            "loan_approved": is_approved,
            "approved_loan_amount": approved_loan_amount,
            "risk_level": risk_level
        }
        data.append(row)
        
    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(current_dir, "dataset.csv")
    df = generate_loan_dataset(num_samples=1800, random_seed=42)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} records saved to {output_path}")
    print("Class distribution for loan_approved:")
    print(df["loan_approved"].value_counts(normalize=True))
    print("\nRisk Level distribution:")
    print(df["risk_level"].value_counts(normalize=True))
    print(f"\nAverage Requested: INR {df['requested_loan'].mean():,.2f}")
    print(f"Average Approved: INR {df['approved_loan_amount'].mean():,.2f}")

