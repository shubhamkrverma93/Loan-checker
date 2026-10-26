import React from 'react';
import { Brain, Cpu, Database, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.25rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Brain size={16} style={{ color: 'var(--accent-primary)' }} /> Logistic Regression (Approval)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={16} style={{ color: 'var(--info)' }} /> Linear Regression (Capacity)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} style={{ color: 'var(--warning)' }} /> KNN Classifier (Risk Cohort)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Database size={16} style={{ color: 'var(--success)' }} /> FastAPI + SQLite ORM
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Academic Project: Machine Learning Based Project Loan Approval System
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          DISCLAIMER: This system is strictly an educational tool. Model recommendations do not constitute actual credit or banking commitments.
        </p>
      </div>
    </footer>
  );
}
