import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EnterWord from './pages/EnterWord';
import DisplayWordCloud from './pages/DisplayWordCloud';
import HappinessInput from './components/HappinessInput'; // Import the Happiness Input component
import HappinessBarChart from './pages/HappinessBarChart';
import ThankYouPage from './pages/ThankYouPage';
import AdminPage from './pages/AdminPage'; // Import the AdminPage component

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect the home route to /enter */}
        <Route path="/" element={<Navigate to="/enter" />} />

        {/* Page to enter a word */}
        <Route path="/enter" element={<EnterWord />} />

        {/* Page to display word cloud */}
        <Route path="/display" element={<DisplayWordCloud />} />

        {/* Add the happiness input page */}
        <Route path="/happiness-scale" element={<HappinessInput />} />

        {/* Add the happiness bar chart page */}
        <Route path="/happiness-bar-chart" element={<HappinessBarChart />} />

        {/* Thank You page */}
        <Route path="/thank-you" element={<ThankYouPage />} />

        {/* Admin page to clear Firebase database */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
