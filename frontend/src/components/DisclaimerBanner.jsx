import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner({ text }) {
  return (
    <div className="educational-disclaimer" role="alert">
      <AlertTriangle className="disclaimer-icon" size={20} />
      <div>
        <strong style={{ display: 'block', marginBottom: '0.2rem' }}>
          Educational ML Project Disclaimer:
        </strong>
        {text || (
          "This system is an educational Machine Learning project. Predictions and recommendations " +
          "are generated from synthetic demonstration data using Scikit-Learn models and must NOT " +
          "be construed as actual banking, legal, or financial credit decisions."
        )}
      </div>
    </div>
  );
}
