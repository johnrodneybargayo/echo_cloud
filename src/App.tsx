import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EnterWord from './pages/EnterWord';
import DisplayWordCloud from './pages/DisplayWordCloud';
import HappinessInput from './components/HappinessInput'; // Import the new component
// import HomePage from './pages/HomePage'; // Commented out to disable the home page
import HappinessBarChart from './pages/HappinessBarChart';

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
        {/* Add the happiness page */}
        <Route path="/happiness-scale" element={<HappinessInput />} /> 
        {/* Add the happiness bar chartpage */}
        <Route path="/happiness-bar-chart" element={<HappinessBarChart />} />
      </Routes>
    </Router>
  );
}

export default App;
