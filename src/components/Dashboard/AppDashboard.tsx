import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import Sidebar from './Sidebar';
import AdminSettings from './AdminSettings';
import QuestionManager from './QuestionManager';
import './Dashboard.css';
import { useAuth } from '../../context/AuthContext';
import Loader from '../loader/Loader';

const AppDashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'admin' | 'question'>('question');
  const { user, isLoading } = useAuth(); // Destructuring the user info from auth context
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login'); // Redirect to login if user is not authenticated
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <Loader />; // Show loader while checking authentication
  }

  // Ensure fallback values for fullName and photoURL
  const fullname = user?.displayName || 'User'; // Default to 'User' if displayName is not available
  const photoURL = user?.photoURL || 'https://via.placeholder.com/150'; // Default placeholder if photoURL is not available

  return (
    <div className="dashboard">
      <TopNavigation
        fullName={fullname} // Passing the fullName from user
        photoURL={photoURL} // Passing the photoURL from user
      />
      <div className="dashboard-container">
        <Sidebar selectedView={selectedView} setSelectedView={setSelectedView} />
        <main className="dashboard-content">
          {selectedView === 'admin' ? <AdminSettings /> : <QuestionManager />}
        </main>
      </div>
    </div>
  );
};

export default AppDashboard;
