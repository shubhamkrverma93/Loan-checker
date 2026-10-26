import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle,
  HelpCircle,
  Activity,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { api } from '../services/api';

export default function ModelComparisonPage() {
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getModelPerformance();
      setMetricsData(res.models);
    } catch (err) {
      setError(err.message || 'Failed to load model performance metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <Activity size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-primary)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Retrieving cross-validation performance benchmarks...</p>
      </div>
    );
  }

  if (error || !metricsData) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error || 'No metrics found.'}</p>
        <button className="btn btn-primary" onClick={fetchMetrics}>
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  const { logistic_regression: logReg, linear_regression: linReg, knn, metadata } = metricsData;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <DisclaimerBanner />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Tri-Model Machine Learning Evaluation</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Empirical validation benchmarks calculated on stratified test partitions ({metadata?.split_ratio || '80/20'} split).
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchMetrics}>
          <RefreshCw size={15} /> Refresh Metrics
        </button>
      </div>

      {/* Top 3 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* 1. Logistic Regression Card */}
        <div className="glass-card" style={{ borderTop: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={22} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.25rem' }}>Logistic Regression</h2>
            </div>
            <span className="badge badge-info">Classification</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ACCURACY</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--success)' }}>
                {logReg.accuracy}%
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>F1 SCORE</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {logReg.f1_score}%
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PRECISION</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{logReg.precision}%</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ROC-AUC</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--info)' }}>{logReg.roc_auc}%</div>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>Purpose:</strong> Binary qualification probability and default threshold classification.
          </div>
        </div>

        {/* 2. Linear Regression Card */}
        <div className="glass-card" style={{ borderTop: '4px solid var(--info)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={22} style={{ color: 'var(--info)' }} />
              <h2 style={{ fontSize: '1.25rem' }}>Linear Regression</h2>
            </div>
            <span className="badge badge-info">Regression</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>R² SCORE</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--info)' }}>
                {linReg.r2_score}%
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>RMSE</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ₹{(linReg.rmse / 1000).toFixed(0)}k
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>MAE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>₹{(linReg.mae / 1000).toFixed(0)}k</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>TEST SET</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{linReg.test_samples} Samples</div>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>Purpose:</strong> Projects sustainable debt ceiling aligned with project revenue margins.
          </div>
        </div>

        {/* 3. KNN Card */}
        <div className="glass-card" style={{ borderTop: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={22} style={{ color: 'var(--warning)' }} />
              <h2 style={{ fontSize: '1.25rem' }}>K-Nearest Neighbors</h2>
            </div>
            <span className="badge badge-info">Multi-Class (K=5)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ACCURACY</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--warning)' }}>
                {knn.accuracy}%
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>F1 SCORE</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                {knn.f1_score}%
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PRECISION</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{knn.precision}%</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>RECALL</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{knn.recall}%</div>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>Purpose:</strong> Multi-class risk segment profiling (Low, Medium, High Risk) via instance clusters.
          </div>
        </div>
      </div>

      {/* Visual Metric Comparison Graph */}
      <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={20} style={{ color: 'var(--accent-primary)' }} />
          Comparative Accuracy & Variance Across Algorithms
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Logistic Regression Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
              <strong>Logistic Regression (Classification Accuracy)</strong>
              <strong style={{ color: 'var(--success)' }}>{logReg.accuracy}%</strong>
            </div>
            <div style={{ width: '100%', height: '14px', background: 'var(--bg-secondary)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${logReg.accuracy}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #6366f1)', borderRadius: '9999px', transition: 'width 1s ease' }} />
            </div>
          </div>

          {/* Linear Regression R2 Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
              <strong>Linear Regression (R² Explained Variance)</strong>
              <strong style={{ color: 'var(--info)' }}>{linReg.r2_score}%</strong>
            </div>
            <div style={{ width: '100%', height: '14px', background: 'var(--bg-secondary)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${linReg.r2_score}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', borderRadius: '9999px', transition: 'width 1s ease' }} />
            </div>
          </div>

          {/* KNN Multi-Class Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
              <strong>K-Nearest Neighbors (Multi-Class Risk Accuracy)</strong>
              <strong style={{ color: 'var(--warning)' }}>{knn.accuracy}%</strong>
            </div>
            <div style={{ width: '100%', height: '14px', background: 'var(--bg-secondary)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${knn.accuracy}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ec4899)', borderRadius: '9999px', transition: 'width 1s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Confusion Matrices Heatmaps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Logistic Confusion Matrix */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Logistic Regression: Confusion Matrix</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Binary predictions on {logReg.test_samples} validation samples.
          </p>

          {logReg.confusion_matrix && (
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '6px', textAlign: 'center', fontSize: '0.85rem' }}>
              <div></div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Pred Rejected</div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Pred Approved</div>

              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>Actual Rejected</div>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '8px', fontWeight: 700 }}>
                {logReg.confusion_matrix[0][0]} (TN)
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '1rem', borderRadius: '8px', fontWeight: 700 }}>
                {logReg.confusion_matrix[0][1]} (FP)
              </div>

              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>Actual Approved</div>
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '1rem', borderRadius: '8px', fontWeight: 700 }}>
                {logReg.confusion_matrix[1][0]} (FN)
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.35)', padding: '1rem', borderRadius: '8px', fontWeight: 700 }}>
                {logReg.confusion_matrix[1][1]} (TP)
              </div>
            </div>
          )}
        </div>

        {/* KNN Confusion Matrix */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>KNN (K=5): Multi-Class Matrix</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Risk classes mapping: High Risk, Low Risk, Medium Risk.
          </p>

          {knn.confusion_matrix && (
            <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(3, 1fr)', gap: '6px', textAlign: 'center', fontSize: '0.8rem' }}>
                <div></div>
                {knn.classes.map(c => (
                  <div key={c} style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Pred {c.split(' ')[0]}</div>
                ))}

                {knn.confusion_matrix.map((row, rIdx) => (
                  <React.Fragment key={rIdx}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                      Act {knn.classes[rIdx].split(' ')[0]}
                    </div>
                    {row.map((val, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          background: rIdx === cIdx ? 'rgba(99, 102, 241, 0.3)' : 'var(--bg-secondary)',
                          padding: '0.75rem 0.5rem',
                          borderRadius: '6px',
                          fontWeight: rIdx === cIdx ? 700 : 500
                        }}
                      >
                        {val}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Synthesis Methodology Table */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Architectural Rationale: Why Tri-Algorithm Assessment?</h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Mathematical Paradigm</th>
                <th>Underwriting Responsibility</th>
                <th>Key Evaluation Metrics</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Logistic Regression</strong></td>
                <td>Linear Log-Odds & Sigmoid Activation</td>
                <td>Determines whether borrower creditworthiness meets the approval threshold.</td>
                <td>Accuracy ({logReg.accuracy}%), F1 ({logReg.f1_score}%), ROC-AUC ({logReg.roc_auc}%)</td>
              </tr>
              <tr>
                <td><strong>Linear Regression</strong></td>
                <td>Ordinary Least Squares (OLS) Optimization</td>
                <td>Determines the sustainable monetary debt capacity to prevent financial distress.</td>
                <td>R² ({linReg.r2_score}%), RMSE (₹{(linReg.rmse/1000).toFixed(0)}k), MAE (₹{(linReg.mae/1000).toFixed(0)}k)</td>
              </tr>
              <tr>
                <td><strong>K-Nearest Neighbors</strong></td>
                <td>Non-parametric Euclidean / Minkowski Clustering</td>
                <td>Compares loan proposals against 5 nearest historical borrowers in multidimensional space.</td>
                <td>Accuracy ({knn.accuracy}%), Weighted F1 ({knn.f1_score}%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
