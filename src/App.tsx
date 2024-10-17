import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EnterWord from './pages/EnterWord';
import DisplayWordCloud from './pages/DisplayWordCloud';
// import HomePage from './pages/HomePage'; // Commented out to disable the home page

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
      </Routes>
    </Router>
  );
}

export default App;
