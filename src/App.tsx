import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import WordInput from './components/WordInput';
import DisplayWordCloudWrapper from './components/DisplayWordCloudWrapper'; // Use the new wrapper component
import HappinessInput from './components/HappinessInput';
import HappinessBarChart from './pages/HappinessBarChart';
import ThankYouPage from './pages/ThankYouPage';
import AdminPage from './pages/AdminPage';
import QuestionManager from './components/QuestionManager';
import QuestionDisplay from './components/QuestionDisplay';
import { QuestionsProvider } from './context/QuestionsContext';

function App() {
  return (
    <QuestionsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/manage-questions" />} />
          <Route path="/manage-questions" element={<QuestionManager />} />
          <Route path="/enter/:questionId" element={<WordInput />} />
          <Route path="/display/:questionId" element={<DisplayWordCloudWrapper />} />
          <Route path="/happiness-scale" element={<HappinessInput />} />
          <Route path="/happiness-bar-chart" element={<HappinessBarChart />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/question-display/:questionId" element={<QuestionDisplay />} />
        </Routes>
      </Router>
    </QuestionsProvider>
  );
}

export default App;
