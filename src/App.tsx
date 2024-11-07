// App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QuestionsProvider } from './context/QuestionsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import WaitingRoom from './components/WaitingRoom';
import LoginPage from './pages/LoginPage'; // Import LoginPage

// Lazy load components
const WordInput = React.lazy(() => import('./components/WordInput'));
const DisplayWordCloudWrapper = React.lazy(() => import('./components/DisplayWordCloudWrapper'));
const HappinessInput = React.lazy(() => import('./components/HappinessInput'));
const HappinessBarChart = React.lazy(() => import('./pages/HappinessBarChart'));
const ThankYouPage = React.lazy(() => import('./pages/ThankYouPage'));
const AppDashboard = React.lazy(() => import('./components/Dashboard/AppDashboard')); // Main Dashboard

// ProtectedRoute component for role-based access control
function ProtectedRoute({ component: Component, role }: { component: React.FC; role: "admin" | "participant" }) {
  const { user, role: userRole } = useAuth();

  if (!user) {
    console.log("Redirecting to '/login' because user is not logged in.");
    return <Navigate to="/login" replace />;
  }
  
  if (userRole !== role) {
    console.log("Redirecting to '/waiting' because user does not have the required role.");
    return <Navigate to="/waiting" replace />;
  }

  return <Component />;
}

function App() {
  return (
    <AuthProvider>
      <QuestionsProvider>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Default route redirects to LoginPage */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/enter/:questionId" element={<WordInput />} />
              <Route path="/display/:questionId" element={<DisplayWordCloudWrapper />} />
              <Route path="/happiness-scale" element={<HappinessInput />} />
              <Route path="/happiness-bar-chart" element={<HappinessBarChart />} />
              <Route path="/thank-you" element={<ThankYouPage />} />

              {/* Protected dashboard route */}
              <Route path="/dashboard" element={<ProtectedRoute component={AppDashboard} role="admin" />} />
              
              <Route path="/waiting" element={<WaitingRoom />} />
            </Routes>
          </Suspense>
        </Router>
      </QuestionsProvider>
    </AuthProvider>
  );
}

export default App;
