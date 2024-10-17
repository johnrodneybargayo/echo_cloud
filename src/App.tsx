import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EnterWord from './pages/EnterWord';
import DisplayWordCloud from './pages/DisplayWordCloud';
import HomePage from './pages/HomePage'; // Assuming you have a HomePage component

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Page to enter a word */}
        <Route path="/enter" element={<EnterWord />} />

        {/* Page to display word cloud */}
        <Route path="/display" element={<DisplayWordCloud />} />
      </Routes>
    </Router>
  );
}

export default App;
