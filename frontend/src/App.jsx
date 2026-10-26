import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoanApplicationPage from './pages/LoanApplicationPage';
import PredictionResultPage from './pages/PredictionResultPage';
import ModelComparisonPage from './pages/ModelComparisonPage';
import ApplicationHistoryPage from './pages/ApplicationHistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AuthPage from './pages/AuthPage';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [currentResult, setCurrentResult] = useState(null);
  const [currentInputData, setCurrentInputData] = useState(null);

  const handlePredictionSuccess = (predictionResult, inputData) => {
    setCurrentResult(predictionResult);
    setCurrentInputData(inputData);
    setActivePage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetailFromHistory = (app) => {
    if (app.prediction) {
      setCurrentResult({
        application_id: app.id,
        logistic_regression: {
          prediction: app.prediction.logistic_prediction,
          probability: app.prediction.logistic_probability,
          confidence_percentage: Math.round(app.prediction.logistic_probability * 100)
        },
        linear_regression: {
          predicted_loan_amount: app.prediction.linear_predicted_amount,
          ratio_of_requested: app.prediction.linear_predicted_amount / (app.requested_loan || 1),
          difference_from_requested: app.prediction.linear_predicted_amount - app.requested_loan
        },
        knn: {
          risk_level: app.prediction.knn_risk,
          nearest_neighbors_count: 5,
          similar_profiles: []
        },
        recommendation: app.prediction.recommendation,
        explanation: app.prediction.explanation,
        key_factors: app.prediction.factors_json ? JSON.parse(app.prediction.factors_json) : [],
        disclaimer: "Educational model output, not a lending decision."
      });
      setCurrentInputData(app);
      setActivePage('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        {activePage === 'landing' && <LandingPage setActivePage={setActivePage} />}
        {activePage === 'apply' && <LoanApplicationPage onPredictionSuccess={handlePredictionSuccess} />}
        {activePage === 'result' && (
          <PredictionResultPage
            result={currentResult}
            inputData={currentInputData}
            setActivePage={setActivePage}
          />
        )}
        {activePage === 'models' && <ModelComparisonPage />}
        {activePage === 'history' && <ApplicationHistoryPage onViewDetail={handleViewDetailFromHistory} />}
        {activePage === 'dashboard' && <AdminDashboardPage setActivePage={setActivePage} />}
        {activePage === 'auth' && <AuthPage setActivePage={setActivePage} />}
      </main>

      <Footer />
    </div>
  );
}
