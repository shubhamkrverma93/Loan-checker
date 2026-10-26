import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Brain,
  TrendingUp,
  Users,
  ShieldCheck,
  ArrowRight,
  Printer,
  History,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function PredictionResultPage({ result, inputData, setActivePage }) {
  if (!result) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>No Active Prediction Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Please complete and submit a loan application first to generate ML predictions.
        </p>
        <button className="btn btn-primary" onClick={() => setActivePage('apply')}>
          Go to Application Form
        </button>
      </div>
    );
  }

  const {
    application_id,
    logistic_regression,
    linear_regression,
    knn,
    recommendation,
    explanation,
    key_factors = [],
    disclaimer
  } = result;

  const isFavorable = recommendation === 'Favorable';
  const isReview = recommendation === 'Needs Review';
  const isUnfavorable = recommendation === 'Unfavorable';

  const badgeClass = isFavorable
    ? 'badge-favorable'
    : isReview
    ? 'badge-review'
    : 'badge-unfavorable';

  const OutcomeIcon = isFavorable ? CheckCircle2 : isReview ? AlertTriangle : XCircle;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <DisclaimerBanner text={disclaimer} />

      {/* Hero Outcome Card */}
      <div
        className="glass-card"
        style={{
          border: `1px solid ${isFavorable ? 'var(--success-border)' : isReview ? 'var(--warning-border)' : 'var(--danger-border)'}`,
          background: isFavorable
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(23, 31, 48, 0.85) 100%)'
            : isReview
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(23, 31, 48, 0.85) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(23, 31, 48, 0.85) 100%)',
          marginBottom: '2rem',
          textAlign: 'center',
          padding: '2.5rem 1.5rem'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span className={`badge ${badgeClass}`} style={{ fontSize: '0.9rem', padding: '0.45rem 1.1rem' }}>
            <span className="badge-dot" />
            SYNTHESIS: {recommendation.toUpperCase()}
          </span>
          {application_id && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              (Application #{application_id})
            </span>
          )}
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '0.75rem' }}>
          Loan Analysis Result
        </h1>

        <p
          style={{
            maxWidth: '750px',
            margin: '0 auto 1.5rem',
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            lineHeight: '1.6'
          }}
        >
          {explanation}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print / Export PDF
          </button>
          <button className="btn btn-secondary" onClick={() => setActivePage('history')}>
            <History size={16} /> View in History
          </button>
          <button className="btn btn-primary" onClick={() => setActivePage('apply')}>
            <RotateCcw size={16} /> New Application
          </button>
        </div>
      </div>

      {/* Tri-Model Individual Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* 1. Logistic Regression */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Brain size={20} style={{ color: 'var(--accent-primary)' }} />
                <strong style={{ fontSize: '1.1rem' }}>Logistic Regression</strong>
              </div>
              <span className="badge badge-info">Classification</span>
            </div>

            <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                APPROVAL PROBABILITY
              </div>
              <div
                style={{
                  fontSize: '2.8rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: logistic_regression.probability >= 0.5 ? 'var(--success)' : 'var(--danger)'
                }}
              >
                {(logistic_regression.probability * 100).toFixed(1)}%
              </div>
              <div
                style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: logistic_regression.prediction === 'Approved' ? 'var(--success)' : 'var(--danger)'
                }}
              >
                Prediction: {logistic_regression.prediction.toUpperCase()}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Evaluates binary qualification cutoff at 50% sigmoid threshold based on financial features.
          </div>
        </div>

        {/* 2. Linear Regression */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} style={{ color: 'var(--info)' }} />
                <strong style={{ fontSize: '1.1rem' }}>Linear Regression</strong>
              </div>
              <span className="badge badge-info">Regression</span>
            </div>

            <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                PREDICTED SUITABLE LOAN AMOUNT
              </div>
              <div
                style={{
                  fontSize: '2.3rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--info)'
                }}
              >
                ₹{Number(linear_regression.predicted_loan_amount).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {inputData && inputData.requested_loan ? (
                  <span>
                    Requested: ₹{Number(inputData.requested_loan).toLocaleString()} ({Math.round(linear_regression.ratio_of_requested * 100)}%)
                  </span>
                ) : 'Calculated Sustainable Capacity'}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Calculates revenue-backed debt capacity to prevent over-leverage and default.
          </div>
        </div>

        {/* 3. KNN */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} style={{ color: 'var(--warning)' }} />
                <strong style={{ fontSize: '1.1rem' }}>K-Nearest Neighbors</strong>
              </div>
              <span className="badge badge-info">K = 5</span>
            </div>

            <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                CLUSTER RISK ASSESSMENT
              </div>
              <div style={{ margin: '0.75rem 0' }}>
                <span
                  className={`badge badge-${knn.risk_level === 'Low Risk' ? 'low-risk' : knn.risk_level === 'Medium Risk' ? 'medium-risk' : 'high-risk'}`}
                  style={{ fontSize: '1.25rem', padding: '0.6rem 1.4rem' }}
                >
                  {knn.risk_level.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Compared with 5 nearest historical cases
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Minkowski distance mapping across credit score, debt obligations, and project margins.
          </div>
        </div>
      </div>

      {/* Key Contributing Factors */}
      {key_factors && key_factors.length > 0 && (
        <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
            Key Predictive Drivers & Risk Factors
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Transparent breakdown of domain indicators influencing the multi-model decision engine.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {key_factors.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{item.factor}</strong>
                  <span
                    className={`badge badge-${item.impact === 'Positive' ? 'approved' : item.impact === 'Warning' ? 'medium-risk' : 'high-risk'}`}
                    style={{ fontSize: '0.72rem' }}
                  >
                    {item.impact}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KNN Similar Historical Applications */}
      {knn.similar_profiles && knn.similar_profiles.length > 0 && (
        <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} style={{ color: 'var(--warning)' }} />
            K-Nearest Historical Project Analogues
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Top 5 closest profiles identified in training dataset feature space.
          </p>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Venture Name</th>
                  <th>Category</th>
                  <th>Credit Score</th>
                  <th>Requested Amount</th>
                  <th>Training Outcome</th>
                  <th>Risk Tier</th>
                  <th>Distance</th>
                </tr>
              </thead>
              <tbody>
                {knn.similar_profiles.map((profile, i) => (
                  <tr key={i}>
                    <td><strong>{profile.project_name}</strong></td>
                    <td>{profile.project_category}</td>
                    <td>{profile.credit_score}</td>
                    <td>₹{Number(profile.requested_loan).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${profile.loan_approved ? 'badge-approved' : 'badge-rejected'}`}>
                        {profile.loan_approved ? 'Approved' : 'Rejected'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${profile.risk_level === 'Low Risk' ? 'low-risk' : profile.risk_level === 'Medium Risk' ? 'medium-risk' : 'high-risk'}`}>
                        {profile.risk_level}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{profile.similarity_distance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Input Summary */}
      {inputData && (
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Applicant Input Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
            <div><span style={{ color: 'var(--text-muted)' }}>Applicant Name:</span> <strong>{inputData.applicant_name}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Credit Score:</span> <strong style={{ color: 'var(--accent-primary)' }}>{inputData.credit_score}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Annual Income:</span> <strong>₹{Number(inputData.annual_income).toLocaleString()}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Monthly EMI:</span> <strong>₹{Number(inputData.monthly_emi).toLocaleString()}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Requested Loan:</span> <strong>₹{Number(inputData.requested_loan).toLocaleString()}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Tenure:</span> <strong>{inputData.loan_tenure} Months</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Project:</span> <strong>{inputData.project_name}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Category:</span> <strong>{inputData.project_category}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}
