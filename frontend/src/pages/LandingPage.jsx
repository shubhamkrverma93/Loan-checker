import React, { useState } from 'react';
import {
  Brain,
  TrendingUp,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  ChevronRight,
  Sliders
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function LandingPage({ setActivePage }) {
  // Live quick simulator state
  const [simCreditScore, setSimCreditScore] = useState(720);
  const [simIncome, setSimIncome] = useState(1200000);
  const [simRequested, setSimRequested] = useState(600000);
  const [simEmi, setSimEmi] = useState(15000);

  // Approximate client-side preview formula to give instant tactile responsiveness
  const monthlyInc = simIncome / 12;
  const simDti = simEmi / monthlyInc;
  const simProb = Math.min(0.98, Math.max(0.12, (
    ((simCreditScore - 350) / 530) * 0.45 +
    Math.max(0, 1 - (simDti / 0.6)) * 0.35 +
    Math.min(1, simIncome / simRequested) * 0.20
  )));

  const simRisk = simProb > 0.70 ? 'Low Risk' : simProb > 0.45 ? 'Medium Risk' : 'High Risk';
  const simApprovedAmount = Math.round(simRequested * (simProb > 0.5 ? Math.min(1.0, 0.7 + simProb * 0.3) : simProb * 0.6));

  return (
    <div>
      <DisclaimerBanner />

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem 4rem', maxWidth: '900px', margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'var(--accent-subtle)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '9999px',
            color: 'var(--accent-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}
        >
          <Sparkles size={16} /> Tri-Algorithm Intelligent Loan Assessment
        </div>

        <h1 style={{ fontSize: 'clamp(2.3rem, 5vw, 3.8rem)', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
          AI-Powered <span className="brand-text-highlight">Project Loan Analysis</span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          Analyze loan applications using Machine Learning. Our system synthesizes{' '}
          <strong style={{ color: 'var(--text-primary)' }}>Logistic Regression</strong> for approval classification,{' '}
          <strong style={{ color: 'var(--text-primary)' }}>Linear Regression</strong> for funding capacity, and{' '}
          <strong style={{ color: 'var(--text-primary)' }}>KNN</strong> for cohort risk profiling.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }}
            onClick={() => setActivePage('apply')}
          >
            Apply Now <ArrowRight size={18} />
          </button>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }}
            onClick={() => setActivePage('dashboard')}
          >
            View Dashboard <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* 3 Machine Learning Models Grid */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>
            Tri-Model Machine Learning Engine
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Distinct, purpose-built algorithms evaluating your project from multiple financial vectors.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {/* Logistic Regression Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Brain size={24} />
              </div>
              <div className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
                Classification
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                Logistic Regression
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Calculates the exact statistical probability of loan qualification. Classifies the proposal into
                Approved or Rejected based on multi-variate financial strength.
              </p>
            </div>
            <div
              style={{
                background: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Output:</div>
              <div style={{ fontWeight: 700, color: 'var(--success)' }}>Approved / Not Approved (Probability %)</div>
            </div>
          </div>

          {/* Linear Regression Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--info)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <TrendingUp size={24} />
              </div>
              <div className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
                Regression
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                Linear Regression
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Estimates the suitable sustainable credit limit for the enterprise. Protects against over-leveraging
                by matching debt service coverage to cash flow.
              </p>
            </div>
            <div
              style={{
                background: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Output:</div>
              <div style={{ fontWeight: 700, color: 'var(--info)' }}>Suitable Loan Capacity (₹ Amount)</div>
            </div>
          </div>

          {/* KNN Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Users size={24} />
              </div>
              <div className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
                Instance-Based
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                K-Nearest Neighbors (KNN)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Scans historical applicant space (K=5) to locate similar past ventures. Maps the risk profile into
                Low, Medium, or High Risk cohorts based on neighborhood performance.
              </p>
            </div>
            <div
              style={{
                background: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Output:</div>
              <div style={{ fontWeight: 700, color: 'var(--warning)' }}>Risk Tier + 5 Similar Profiles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick Simulation Playground */}
      <section
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 64, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          marginBottom: '4.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Sliders style={{ color: 'var(--accent-primary)' }} />
          <div>
            <h3 style={{ fontSize: '1.4rem' }}>Interactive Prediction Preview Sandbox</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Adjust applicant metrics to observe how financial features influence tri-model predictions in real-time.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="form-label" style={{ marginBottom: 0 }}>Credit Score</span>
                <strong style={{ color: 'var(--accent-primary)' }}>{simCreditScore}</strong>
              </div>
              <input
                type="range"
                min="350"
                max="850"
                step="5"
                value={simCreditScore}
                onChange={e => setSimCreditScore(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="form-label" style={{ marginBottom: 0 }}>Annual Income (₹)</span>
                <strong style={{ color: 'var(--text-primary)' }}>₹{simIncome.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min="300000"
                max="5000000"
                step="50000"
                value={simIncome}
                onChange={e => setSimIncome(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="form-label" style={{ marginBottom: 0 }}>Requested Loan (₹)</span>
                <strong style={{ color: 'var(--text-primary)' }}>₹{simRequested.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min="100000"
                max="3000000"
                step="50000"
                value={simRequested}
                onChange={e => setSimRequested(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="form-label" style={{ marginBottom: 0 }}>Existing Monthly EMI (₹)</span>
                <strong style={{ color: 'var(--text-primary)' }}>₹{simEmi.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="80000"
                step="2000"
                value={simEmi}
                onChange={e => setSimEmi(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
            </div>
          </div>

          {/* Real-time output preview */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '1.75rem',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estimated Approval Probability:</span>
              <strong style={{ fontSize: '1.4rem', color: simProb > 0.6 ? 'var(--success)' : 'var(--danger)' }}>
                {(simProb * 100).toFixed(1)}%
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Linear Reg. Capacity:</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--info)' }}>
                ₹{simApprovedAmount.toLocaleString()}
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>KNN Risk Cluster:</span>
              <span className={`badge badge-${simRisk === 'Low Risk' ? 'low-risk' : simRisk === 'Medium Risk' ? 'medium-risk' : 'high-risk'}`}>
                {simRisk}
              </span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => setActivePage('apply')}
              >
                Proceed to Full 5-Step Application <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Flow */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>Transparent Decision Pipeline</h2>
          <p style={{ color: 'var(--text-secondary)' }}>No black-box decisions. How data traverses from input to recommendation.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { step: '01', title: 'Data Ingestion', desc: 'Personal, financial & project features validation' },
            { step: '02', title: 'Feature Engineering', desc: 'DTI, LTV, profit-to-debt & standard scaling' },
            { step: '03', title: 'Tri-Model Inference', desc: 'Logistic (Class) + Linear (Amount) + KNN (Risk)' },
            { step: '04', title: 'Decision Synthesis', desc: 'Multi-model rule synthesis & explainability generation' },
            { step: '05', title: 'Database Audit', desc: 'Permanent SQLite history for transparency & admin metrics' }
          ].map(flow => (
            <div key={flow.step} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>
                {flow.step}
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{flow.title}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{flow.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
