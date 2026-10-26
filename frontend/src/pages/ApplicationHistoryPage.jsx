import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { api } from '../services/api';

export default function ApplicationHistoryPage({ onViewDetail }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRec, setFilterRec] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (filterRec) params.recommendation = filterRec;
      const data = await api.getApplications(params);
      setApplications(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch loan history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filterRec]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete application #${id}?`)) return;
    try {
      await api.deleteApplication(id);
      setApplications(prev => prev.filter(app => app.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const exportCSV = () => {
    if (!applications.length) return;
    const headers = [
      'ID', 'Date', 'Applicant Name', 'Project Name', 'Category',
      'Annual Income', 'Credit Score', 'Requested Amount',
      'Logistic Prob', 'Linear Amount', 'KNN Risk', 'Recommendation'
    ];
    const rows = applications.map(app => [
      app.id,
      new Date(app.created_at).toLocaleDateString(),
      `"${app.applicant_name}"`,
      `"${app.project_name}"`,
      app.project_category,
      app.annual_income,
      app.credit_score,
      app.requested_loan,
      app.prediction ? `${(app.prediction.logistic_probability * 100).toFixed(1)}%` : 'N/A',
      app.prediction ? app.prediction.linear_predicted_amount : 'N/A',
      app.prediction ? app.prediction.knn_risk : 'N/A',
      app.prediction ? app.prediction.recommendation : 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Loan_Applications_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <DisclaimerBanner />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', marginBottom: '0.25rem' }}>Loan Application Audit History</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Historical record of evaluated applications, ML predictions, and synthetic credit outcomes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={exportCSV} disabled={!applications.length}>
            <Download size={15} /> Export CSV
          </button>
          <button className="btn btn-secondary" onClick={fetchApplications}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by Applicant, Project Name, or Category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              className="form-select"
              value={filterRec}
              onChange={e => setFilterRec(e.target.value)}
            >
              <option value="">All Recommendations</option>
              <option value="Favorable">Favorable</option>
              <option value="Needs Review">Needs Review</option>
              <option value="Unfavorable">Unfavorable</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <Search size={16} /> Search
          </button>
        </form>
      </div>

      {/* Error / Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading application history from database...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--danger)' }}>{error}</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <History size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
          <h3>No Loan Applications Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            Try adjusting search filters or submit a new loan application.
          </p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Date</th>
                <th>Applicant</th>
                <th>Project Name</th>
                <th>Requested</th>
                <th>Approval Prob</th>
                <th>Suggested Amount</th>
                <th>Risk Tier</th>
                <th>Recommendation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => {
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
                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td><strong>{app.applicant_name}</strong></td>
                    <td>
                      <div>{app.project_name}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.project_category}</span>
                    </td>
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
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-icon-only"
                          style={{ width: '32px', height: '32px' }}
                          title="View Details"
                          onClick={() => setSelectedApp(app)}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-icon-only"
                          style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                          title="Delete Application"
                          onClick={(e) => handleDelete(app.id, e)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="glass-card"
            style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>
                Application #{selectedApp.id} Audit Details
              </h2>
              <button className="btn btn-icon-only" onClick={() => setSelectedApp(null)}>
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Applicant:</span> <strong>{selectedApp.applicant_name}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Age & Gender:</span> <strong>{selectedApp.age} yrs / {selectedApp.gender}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Employment:</span> <strong>{selectedApp.employment_type} ({selectedApp.employment_experience} yrs)</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Credit Score:</span> <strong style={{ color: 'var(--accent-primary)' }}>{selectedApp.credit_score}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Annual Income:</span> <strong>₹{Number(selectedApp.annual_income).toLocaleString()}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Existing Debt:</span> <strong>₹{Number(selectedApp.existing_loan).toLocaleString()} (EMI: ₹{Number(selectedApp.monthly_emi).toLocaleString()})</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Project:</span> <strong>{selectedApp.project_name}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Project Cost:</span> <strong>₹{Number(selectedApp.project_cost).toLocaleString()}</strong></div>
            </div>

            {selectedApp.prediction && (
              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Tri-Model Synthesis Result</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <div>Logistic Prob: <strong>{(selectedApp.prediction.logistic_probability * 100).toFixed(1)}% ({selectedApp.prediction.logistic_prediction})</strong></div>
                  <div>Suggested Limit: <strong style={{ color: 'var(--info)' }}>₹{Number(selectedApp.prediction.linear_predicted_amount).toLocaleString()}</strong></div>
                  <div>Risk: <strong style={{ color: 'var(--warning)' }}>{selectedApp.prediction.knn_risk}</strong></div>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {selectedApp.prediction.explanation}
                </p>
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
