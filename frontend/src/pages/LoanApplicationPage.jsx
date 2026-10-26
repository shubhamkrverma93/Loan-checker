import React, { useState } from 'react';
import {
  User,
  DollarSign,
  Briefcase,
  FileText,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Building,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { api } from '../services/api';

export default function LoanApplicationPage({ onPredictionSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    applicant_name: '',
    age: 32,
    gender: 'Male',
    employment_type: 'Salaried',
    employment_experience: 5.0,

    // Step 2: Financial
    annual_income: 900000,
    monthly_income: 75000,
    credit_score: 740,
    existing_loan: 100000,
    monthly_emi: 8000,

    // Step 3: Loan
    requested_loan: 600000,
    loan_tenure: 36,
    interest_rate: 10.5,
    loan_purpose: 'Working Capital',

    // Step 4: Project
    project_name: 'AI Retail Automation Suite',
    project_category: 'Technology',
    project_cost: 1000000,
    expected_revenue: 1800000,
    expected_profit: 450000,
    project_experience: 4.0,

    // Step 5: Documents
    identity_doc: '',
    income_proof: '',
    bank_statement: '',
    project_proposal: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadingField, setUploadingField] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-compute monthly income if annual income changes
      if (field === 'annual_income') {
        updated.monthly_income = Math.round(Number(value) / 12);
      }
      return updated;
    });
  };

  // Preset Auto-fill
  const loadPreset = (presetType) => {
    if (presetType === 'favorable') {
      setFormData({
        applicant_name: 'Dr. Vikram Malhotra',
        age: 38,
        gender: 'Male',
        employment_type: 'Business Owner',
        employment_experience: 12.0,
        annual_income: 2400000,
        monthly_income: 200000,
        credit_score: 810,
        existing_loan: 200000,
        monthly_emi: 15000,
        requested_loan: 1200000,
        loan_tenure: 48,
        interest_rate: 9.8,
        loan_purpose: 'Business Expansion',
        project_name: 'Precision CNC Robotics Facility',
        project_category: 'Manufacturing',
        project_cost: 2800000,
        expected_revenue: 5500000,
        expected_profit: 1400000,
        project_experience: 8.5,
        identity_doc: 'id_vikram_aadhaar.pdf',
        income_proof: 'itr_2025_2026.pdf',
        bank_statement: 'hdfc_statement_12m.pdf',
        project_proposal: 'cnc_project_dpr.pdf'
      });
      setUploadedFiles({
        identity_doc: 'id_vikram_aadhaar.pdf',
        income_proof: 'itr_2025_2026.pdf',
        bank_statement: 'hdfc_statement_12m.pdf',
        project_proposal: 'cnc_project_dpr.pdf'
      });
    } else if (presetType === 'review') {
      setFormData({
        applicant_name: 'Pooja Sundaram',
        age: 28,
        gender: 'Female',
        employment_type: 'Salaried',
        employment_experience: 4.5,
        annual_income: 850000,
        monthly_income: 70833,
        credit_score: 660,
        existing_loan: 180000,
        monthly_emi: 18000,
        requested_loan: 550000,
        loan_tenure: 36,
        interest_rate: 11.2,
        loan_purpose: 'Equipment Purchase',
        project_name: 'Artisan Bakery Boutique & Cafe',
        project_category: 'Retail',
        project_cost: 900000,
        expected_revenue: 1600000,
        expected_profit: 290000,
        project_experience: 2.5,
        identity_doc: 'pooja_id.pdf',
        income_proof: 'salary_slip_3m.pdf',
        bank_statement: 'icici_6m.pdf',
        project_proposal: 'bakery_plan.pdf'
      });
      setUploadedFiles({
        identity_doc: 'pooja_id.pdf',
        income_proof: 'salary_slip_3m.pdf',
        bank_statement: 'icici_6m.pdf',
        project_proposal: 'bakery_plan.pdf'
      });
    } else if (presetType === 'unfavorable') {
      setFormData({
        applicant_name: 'Anil Verma',
        age: 44,
        gender: 'Male',
        employment_type: 'Freelancer',
        employment_experience: 2.0,
        annual_income: 420000,
        monthly_income: 35000,
        credit_score: 530,
        existing_loan: 350000,
        monthly_emi: 22000,
        requested_loan: 750000,
        loan_tenure: 60,
        interest_rate: 15.0,
        loan_purpose: 'Working Capital',
        project_name: 'Used Vehicle Fleet Transport',
        project_category: 'Services',
        project_cost: 850000,
        expected_revenue: 950000,
        expected_profit: 85000,
        project_experience: 1.0,
        identity_doc: 'anil_pan.pdf',
        income_proof: 'bank_statement_3m.pdf',
        bank_statement: 'pnb_statement.pdf',
        project_proposal: 'fleet_proposal.pdf'
      });
      setUploadedFiles({
        identity_doc: 'anil_pan.pdf',
        income_proof: 'bank_statement_3m.pdf',
        bank_statement: 'pnb_statement.pdf',
        project_proposal: 'fleet_proposal.pdf'
      });
    }
    setErrorMessage('');
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;
    setUploadingField(field);
    try {
      const res = await api.uploadDocument(file);
      setFormData(prev => ({ ...prev, [field]: res.filename }));
      setUploadedFiles(prev => ({ ...prev, [field]: file.name }));
    } catch (err) {
      alert(`File upload failed: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  const validateStep = (step) => {
    setErrorMessage('');
    if (step === 1) {
      if (!formData.applicant_name.trim()) return 'Please enter applicant full name.';
      if (formData.age < 18 || formData.age > 80) return 'Age must be between 18 and 80.';
      if (formData.employment_experience < 0) return 'Employment experience cannot be negative.';
    } else if (step === 2) {
      if (formData.annual_income <= 0) return 'Please specify a valid annual income.';
      if (formData.credit_score < 300 || formData.credit_score > 900) return 'Credit score must be between 300 and 900.';
      if (formData.monthly_emi < 0 || formData.existing_loan < 0) return 'Loan/EMI amounts cannot be negative.';
    } else if (step === 3) {
      if (formData.requested_loan <= 0) return 'Requested loan amount must be greater than zero.';
      if (formData.loan_tenure <= 0) return 'Loan tenure must be greater than zero.';
    } else if (step === 4) {
      if (!formData.project_name.trim()) return 'Project name is required.';
      if (formData.project_cost <= 0) return 'Project cost must be greater than zero.';
    }
    return null;
  };

  const nextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      setErrorMessage(error);
      return;
    }
    setCurrentStep(prev => Math.min(5, prev + 1));
  };

  const prevStep = () => {
    setErrorMessage('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmitApplication = async () => {
    const error = validateStep(4);
    if (error) {
      setErrorMessage(error);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        applicant_name: formData.applicant_name,
        age: parseInt(formData.age),
        gender: formData.gender,
        employment_type: formData.employment_type,
        employment_experience: parseFloat(formData.employment_experience),
        annual_income: parseFloat(formData.annual_income),
        monthly_income: parseFloat(formData.monthly_income),
        credit_score: parseInt(formData.credit_score),
        existing_loan: parseFloat(formData.existing_loan),
        monthly_emi: parseFloat(formData.monthly_emi),
        requested_loan: parseFloat(formData.requested_loan),
        loan_tenure: parseInt(formData.loan_tenure),
        interest_rate: parseFloat(formData.interest_rate),
        loan_purpose: formData.loan_purpose,
        project_name: formData.project_name,
        project_category: formData.project_category,
        project_cost: parseFloat(formData.project_cost),
        expected_revenue: parseFloat(formData.expected_revenue),
        expected_profit: parseFloat(formData.expected_profit),
        project_experience: parseFloat(formData.project_experience),
        identity_doc: formData.identity_doc || null,
        income_proof: formData.income_proof || null,
        bank_statement: formData.bank_statement || null,
        project_proposal: formData.project_proposal || null
      };

      const result = await api.predictLoan(payload);
      onPredictionSuccess(result, formData);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit loan application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Personal Info' },
    { num: 2, title: 'Financials' },
    { num: 3, title: 'Loan Details' },
    { num: 4, title: 'Project Info' },
    { num: 5, title: 'Review & Submit' }
  ];

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto' }}>
      <DisclaimerBanner />

      {/* Header and Preset Helpers */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', marginBottom: '0.35rem' }}>Loan Application Evaluation</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Submit your personal, financial, and project parameters for tri-model Machine Learning analysis.
          </p>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            onClick={() => loadPreset('favorable')}
          >
            <Sparkles size={14} style={{ color: 'var(--success)' }} /> Demo: Favorable Case
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            onClick={() => loadPreset('review')}
          >
            <Sparkles size={14} style={{ color: 'var(--warning)' }} /> Demo: Review Case
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            onClick={() => loadPreset('unfavorable')}
          >
            <Sparkles size={14} style={{ color: 'var(--danger)' }} /> Demo: Unfavorable
          </button>
        </div>
      </div>

      {/* Step Wizard Bar */}
      <div className="wizard-steps">
        {steps.map(step => (
          <div
            key={step.num}
            className={`wizard-step ${currentStep === step.num ? 'active' : currentStep > step.num ? 'completed' : ''}`}
            onClick={() => {
              if (step.num < currentStep) setCurrentStep(step.num);
            }}
          >
            <div className="wizard-step-circle">
              {currentStep > step.num ? <CheckCircle2 size={20} /> : step.num}
            </div>
            <div className="wizard-step-title">{step.title}</div>
          </div>
        ))}
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div
          style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            border: '1px solid var(--danger-border)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Main Multi-Step Form Card */}
      <div className="glass-card">
        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <User style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.35rem' }}>Step 1: Personal Information</h2>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name of Applicant *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rahul Sharma"
                value={formData.applicant_name}
                onChange={e => handleInputChange('applicant_name', e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Age (Years) *</label>
                <input
                  type="number"
                  className="form-input"
                  min="18"
                  max="80"
                  value={formData.age}
                  onChange={e => handleInputChange('age', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={e => handleInputChange('gender', e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Employment Type *</label>
                <select
                  className="form-select"
                  value={formData.employment_type}
                  onChange={e => handleInputChange('employment_type', e.target.value)}
                >
                  <option value="Salaried">Salaried (Private / Govt)</option>
                  <option value="Self-Employed">Self-Employed Professional</option>
                  <option value="Business Owner">Business Owner / Proprietor</option>
                  <option value="Freelancer">Independent Consultant / Freelancer</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Total Employment Experience (Years) *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="50"
                  className="form-input"
                  value={formData.employment_experience}
                  onChange={e => handleInputChange('employment_experience', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FINANCIAL INFORMATION */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <DollarSign style={{ color: 'var(--success)' }} />
              <h2 style={{ fontSize: '1.35rem' }}>Step 2: Financial Information</h2>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Annual Income (₹ INR) *</label>
                <input
                  type="number"
                  step="10000"
                  className="form-input"
                  placeholder="e.g. 1200000"
                  value={formData.annual_income}
                  onChange={e => handleInputChange('annual_income', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Income (₹ INR)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.monthly_income}
                  onChange={e => handleInputChange('monthly_income', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Credit Score (CIBIL / Experian: 300 - 900) *</label>
                <input
                  type="number"
                  min="300"
                  max="900"
                  className="form-input"
                  value={formData.credit_score}
                  onChange={e => handleInputChange('credit_score', e.target.value)}
                  required
                />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  750+ = Excellent, 650-749 = Good/Moderate, &lt;650 = Higher Risk
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Total Existing Outstanding Loan (₹ INR)</label>
                <input
                  type="number"
                  step="10000"
                  className="form-input"
                  value={formData.existing_loan}
                  onChange={e => handleInputChange('existing_loan', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Current Monthly EMI Obligations (₹ INR)</label>
              <input
                type="number"
                step="1000"
                className="form-input"
                value={formData.monthly_emi}
                onChange={e => handleInputChange('monthly_emi', e.target.value)}
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Used by the preprocessor to compute the critical Debt-To-Income (DTI) ratio.
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LOAN INFORMATION */}
        {currentStep === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Briefcase style={{ color: 'var(--info)' }} />
              <h2 style={{ fontSize: '1.35rem' }}>Step 3: Loan Information</h2>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Requested Loan Amount (₹ INR) *</label>
                <input
                  type="number"
                  step="25000"
                  className="form-input"
                  value={formData.requested_loan}
                  onChange={e => handleInputChange('requested_loan', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Loan Tenure (Months) *</label>
                <select
                  className="form-select"
                  value={formData.loan_tenure}
                  onChange={e => handleInputChange('loan_tenure', e.target.value)}
                >
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                  <option value="48">48 Months (4 Years)</option>
                  <option value="60">60 Months (5 Years)</option>
                  <option value="84">84 Months (7 Years)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expected Interest Rate (% per annum)</label>
                <input
                  type="number"
                  step="0.1"
                  min="5"
                  max="30"
                  className="form-input"
                  value={formData.interest_rate}
                  onChange={e => handleInputChange('interest_rate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Loan Purpose *</label>
                <select
                  className="form-select"
                  value={formData.loan_purpose}
                  onChange={e => handleInputChange('loan_purpose', e.target.value)}
                >
                  <option value="Working Capital">Working Capital</option>
                  <option value="Equipment Purchase">Equipment / Machinery Purchase</option>
                  <option value="Business Expansion">Business & Facility Expansion</option>
                  <option value="Research & Development">Research & Product Development</option>
                  <option value="Inventory Procurement">Inventory Procurement</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PROJECT INFORMATION */}
        {currentStep === 4 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Building style={{ color: 'var(--warning)' }} />
              <h2 style={{ fontSize: '1.35rem' }}>Step 4: Project Information</h2>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Project / Venture Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Organic Produce Cold-Storage Facility"
                  value={formData.project_name}
                  onChange={e => handleInputChange('project_name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Industry / Category *</label>
                <select
                  className="form-select"
                  value={formData.project_category}
                  onChange={e => handleInputChange('project_category', e.target.value)}
                >
                  <option value="Technology">Technology & Software</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Manufacturing">Manufacturing & Engineering</option>
                  <option value="Healthcare">Healthcare & Bio-Pharma</option>
                  <option value="Agriculture">Agriculture & Food Processing</option>
                  <option value="Services">Professional & Commercial Services</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Total Estimated Project Cost (₹ INR) *</label>
                <input
                  type="number"
                  step="50000"
                  className="form-input"
                  value={formData.project_cost}
                  onChange={e => handleInputChange('project_cost', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Relevant Experience (Years)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.project_experience}
                  onChange={e => handleInputChange('project_experience', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expected Annual Revenue (₹ INR) *</label>
                <input
                  type="number"
                  step="50000"
                  className="form-input"
                  value={formData.expected_revenue}
                  onChange={e => handleInputChange('expected_revenue', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expected Annual Net Profit (₹ INR) *</label>
                <input
                  type="number"
                  step="25000"
                  className="form-input"
                  value={formData.expected_profit}
                  onChange={e => handleInputChange('expected_profit', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DOCUMENTS & REVIEW */}
        {currentStep === 5 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <FileCheck style={{ color: 'var(--success)' }} />
              <h2 style={{ fontSize: '1.35rem' }}>Step 5: Document Upload & Final Review</h2>
            </div>

            {/* Document Upload Grid */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.85rem' }}>Document Verification (PDF, PNG, JPG)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { id: 'identity_doc', label: 'Identity Proof (PAN / Aadhaar)' },
                  { id: 'income_proof', label: 'Income Proof / ITR Slip' },
                  { id: 'bank_statement', label: 'Bank Statement (6 Months)' },
                  { id: 'project_proposal', label: 'Project Proposal / DPR' }
                ].map(doc => (
                  <div
                    key={doc.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px dashed var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      textAlign: 'center'
                    }}
                  >
                    <UploadCloud size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.4rem' }} />
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>{doc.label}</div>
                    {uploadedFiles[doc.id] ? (
                      <div style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                        <CheckCircle2 size={13} /> {uploadedFiles[doc.id]}
                      </div>
                    ) : (
                      <label style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', cursor: 'pointer', textDecoration: 'underline' }}>
                        {uploadingField === doc.id ? 'Uploading...' : 'Browse file'}
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          style={{ display: 'none' }}
                          onChange={e => handleFileUpload(doc.id, e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Review Summary Table */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>Application Parameter Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', fontSize: '0.88rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Applicant:</span> <strong>{formData.applicant_name || 'N/A'}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Employment:</span> <strong>{formData.employment_type} ({formData.employment_experience} yrs)</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Annual Income:</span> <strong>₹{Number(formData.annual_income).toLocaleString()}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Credit Score:</span> <strong style={{ color: 'var(--accent-primary)' }}>{formData.credit_score}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Existing Debt:</span> <strong>₹{Number(formData.existing_loan).toLocaleString()} (EMI: ₹{Number(formData.monthly_emi).toLocaleString()})</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Requested Loan:</span> <strong style={{ color: 'var(--info)' }}>₹{Number(formData.requested_loan).toLocaleString()}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Tenure & Rate:</span> <strong>{formData.loan_tenure} Mo @ {formData.interest_rate}%</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Project:</span> <strong>{formData.project_name}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Project Cost:</span> <strong>₹{Number(formData.project_cost).toLocaleString()}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Projected Profit:</span> <strong>₹{Number(formData.expected_profit).toLocaleString()}/yr</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          {currentStep > 1 ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={prevStep}
              disabled={isSubmitting}
            >
              <ArrowLeft size={16} /> Previous
            </button>
          ) : <div />}

          {currentStep < 5 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={nextStep}
            >
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '0.85rem 2.2rem', fontSize: '1.05rem', background: 'var(--accent-gradient)' }}
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Running Tri-Model ML Analysis...' : 'Evaluate & Submit Application'} <Sparkles size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
