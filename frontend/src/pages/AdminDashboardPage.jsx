import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  CreditCard,
  Building2,
  PieChart,
  BarChart2,
  Activity,
  RefreshCw,
  Users
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { api } from '../services/api';

export default function AdminDashboardPage({ setActivePage }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <Activity size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-primary)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Compiling operational credit analytics...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error || 'Unable to load dashboard.'}</p>
        <button className="btn btn-primary" onClick={fetchDashboard}>
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  const {
    total_applications = 0,
    approved_predictions = 0,
    review_cases = 0,
    unfavorable_predictions = 0,
    approval_rate = 0,
    total_requested_volume = 0,
    total_predicted_volume = 0,
    average_credit_score = 0,
    risk_distribution = {},
    recommendation_distribution = {},
    category_distribution = {},
    recent_applications = []
  } = dashboardData;

  const lowRiskCount = risk_distribution['Low Risk'] || 0;
  const medRiskCount = risk_distribution['Medium Risk'] || 0;
  const highRiskCount = risk_distribution['High Risk'] || 0;
  const totalRisks = (lowRiskCount + medRiskCount + highRiskCount) || 1;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <DisclaimerBanner />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Executive ML Analytics Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Real-time portfolio metrics, risk clusters, and credit throughput.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={fetchDashboard}>
          <RefreshCw size={15} /> Refresh Analytics
        </button>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="metric-grid">
        {/* Card 1: Total Applications */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Applications</span>
            <div className="metric-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
              <LayoutDashboard size={20} />
            </div>
          </div>
          <div className="metric-value">{total_applications}</div>
          <div className="metric-subtext">Processed through Tri-Model ML pipeline</div>
        </div>

        {/* Card 2: Favorable Approvals */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Favorable Outcomes</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--success)' }}>{approved_predictions}</div>
          <div className="metric-subtext">Approval Rate: {approval_rate}% of total</div>
        </div>

        {/* Card 3: Needs Review */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Review Cases</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--warning)' }}>{review_cases}</div>
          <div className="metric-subtext">Mixed signals requiring secondary scrutiny</div>
        </div>

        {/* Card 4: Unfavorable */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Unfavorable Outcomes</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
              <XCircle size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--danger)' }}>{unfavorable_predictions}</div>
          <div className="metric-subtext">Deficit in DTI or creditworthiness</div>
        </div>
      </div>

      {/* Secondary Financial KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>TOTAL REQUESTED VOLUME</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{(total_requested_volume / 100000).toFixed(2)} Lakhs
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>LINEAR REG. RECOMMENDED VOLUME</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--info)' }}>
            ₹{(total_predicted_volume / 100000).toFixed(2)} Lakhs
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>PORTFOLIO AVG. CREDIT SCORE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {average_credit_score || 'N/A'}
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
        {/* Chart 1: KNN Risk Distribution */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>KNN Risk Tier Distribution</h3>
            <Users size={18} style={{ color: 'var(--warning)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {/* Low Risk */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="badge-dot" style={{ background: 'var(--success)' }} /> Low Risk Cohort
                </span>
                <strong>{lowRiskCount} ({Math.round((lowRiskCount / totalRisks) * 100)}%)</strong>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'var(--bg-secondary)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${(lowRiskCount / totalRisks) * 100}%`, height: '100%', background: 'var(--success)' }} />
              </div>
            </div>

            {/* Medium Risk */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="badge-dot" style={{ background: 'var(--warning)' }} /> Medium Risk Cohort
                </span>
                <strong>{medRiskCount} ({Math.round((medRiskCount / totalRisks) * 100)}%)</strong>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'var(--bg-secondary)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${(medRiskCount / totalRisks) * 100}%`, height: '100%', background: 'var(--warning)' }} />
              </div>
            </div>

            {/* High Risk */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="badge-dot" style={{ background: 'var(--danger)' }} /> High Risk Cohort
                </span>
                <strong>{highRiskCount} ({Math.round((highRiskCount / totalRisks) * 100)}%)</strong>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'var(--bg-secondary)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${(highRiskCount / totalRisks) * 100}%`, height: '100%', background: 'var(--danger)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Project Category Breakdown */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Industry Category Breakdown</h3>
            <Building2 size={18} style={{ color: 'var(--info)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.keys(category_distribution).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No category data yet.</p>
            ) : (
              Object.entries(category_distribution).map(([cat, count]) => {
                const pct = Math.round((count / Math.max(1, total_applications)) * 100);
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      <span>{cat}</span>
                      <strong>{count} ({pct}%)</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications Feed */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem' }}>Recent Portfolio Submissions</h2>
          <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }} onClick={() => setActivePage('history')}>
            View All in History
          </button>
        </div>

        {recent_applications.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No applications submitted yet.</p>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Applicant</th>
                  <th>Project Name</th>
                  <th>Requested Amount</th>
                  <th>Logistic Prob</th>
                  <th>Linear Suggested</th>
                  <th>Risk Tier</th>
                  <th>Synthesis</th>
                </tr>
              </thead>
              <tbody>
                {recent_applications.map(app => {
                  const pred = app.prediction;
                  const rec = pred?.recommendation || 'Pending';
                  const badgeClass =
                    rec === 'Favorable'
                      ? 'badge-favorable'
                      : rec === 'Needs Review'
                      ? 'badge-review'
                      : 'badge-unfavorable';

                  return (
                    <tr key={app.id}>
                      <td><strong>#{app.id}</strong></td>
                      <td>{app.applicant_name}</td>
                      <td>{app.project_name}</td>
                      <td>₹{Number(app.requested_loan).toLocaleString()}</td>
                      <td>
                        {pred ? (
                          <strong style={{ color: pred.logistic_probability >= 0.5 ? 'var(--success)' : 'var(--danger)' }}>
                            {(pred.logistic_probability * 100).toFixed(1)}%
                          </strong>
                        ) : 'N/A'}
                      </td>
                      <td>
                        {pred ? (
                          <span style={{ color: 'var(--info)' }}>
                            ₹{Number(pred.linear_predicted_amount).toLocaleString()}
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td>
                        {pred ? (
                          <span className={`badge badge-${pred.knn_risk === 'Low Risk' ? 'low-risk' : pred.knn_risk === 'Medium Risk' ? 'medium-risk' : 'high-risk'}`} style={{ fontSize: '0.72rem' }}>
                            {pred.knn_risk}
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td>
                        <span className={`badge ${badgeClass}`} style={{ fontSize: '0.72rem' }}>
                          {rec}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
