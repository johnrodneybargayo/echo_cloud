import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom'; 
import { QuestionsProvider } from './context/QuestionsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import WaitingRoom from './components/WaitingRoom';
import LoginPage from './pages/LoginPage';
import { getPresentationStatus, listenToPresentationStatus } from './utils/realTimeSync';

// Lazy load components
const WordInput = React.lazy(() => import('./components/WordInput'));
const DisplayWordCloudWrapper = React.lazy(() => import('./components/DisplayWordCloudWrapper'));
const HappinessInput = React.lazy(() => import('./components/HappinessInput'));
const HappinessBarChart = React.lazy(() => import('./pages/HappinessBarChart'));
const ThankYouPage = React.lazy(() => import('./pages/ThankYouPage'));
const AppDashboard = React.lazy(() => import('./components/Dashboard/AppDashboard'));

/**
 * ProtectedRoute component for role-based access control.
 * Redirects users based on their authentication and role.
 */
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

/**
 * ProtectedQuestionRoute component for presentation-based access control.
 * Redirects participants to waiting room if presentation is not active.
 */
const ProtectedQuestionRoute = ({ children }: { children: React.ReactNode }) => {
  const [presentationActive, setPresentationActive] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkStatus = async () => {
      const status = await getPresentationStatus();
      setPresentationActive(status === 'active');
    };
    checkStatus();
    
    const unsubscribe = listenToPresentationStatus((status) => {
      setPresentationActive(status === 'active');
    });
    
    return unsubscribe;
  }, []);
  
  if (presentationActive === null) {
    return <div>Loading...</div>;
  }
  
  if (!presentationActive) {
    return <Navigate to="/waiting-room" replace />;
  }
  
  return <>{children}</>;
};

/**
 * Wrapper component to pass the `questionId` to HappinessInput.
 */
const HappinessInputWrapper = () => {
  const { questionId } = useParams<{ questionId: string }>();

  if (!questionId) {
    console.error("Question ID is missing.");
    return <Navigate to="/thank-you" replace />;
  }

  return <HappinessInput questionId={questionId} />;
};

/**
 * App Component - Main Router and Context Providers.
 */
function App() {
  return (
    <AuthProvider>
      <QuestionsProvider>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Default route redirects to LoginPage */}
              {/* Change from login redirect to waiting room redirect */}
              <Route path="/" element={<Navigate to="/waiting-room" replace />} />
              
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected question routes */}
              <Route path="/enter/:questionId" element={
                <ProtectedQuestionRoute>
                  <WordInput />
                </ProtectedQuestionRoute>
              } />
              <Route path="/display/:questionId" element={
                <ProtectedQuestionRoute>
                  <DisplayWordCloudWrapper />
                </ProtectedQuestionRoute>
              } />
              <Route path="/happiness-scale/:questionId" element={
                <ProtectedQuestionRoute>
                  <HappinessInputWrapper />
                </ProtectedQuestionRoute>
              } />
              <Route path="/happiness-bar-chart/:questionId" element={<HappinessBarChart />} />
              <Route path="/thank-you" element={<ThankYouPage />} />

              {/* Protected dashboard route */}
              <Route path="/dashboard" element={<ProtectedRoute component={AppDashboard} role="admin" />} />
              
              <Route path="/waiting-room" element={<WaitingRoom />} />
            </Routes>
          </Suspense>
        </Router>
      </QuestionsProvider>
    </AuthProvider>
  );
}

export default App;
