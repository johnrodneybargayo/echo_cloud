// src/components/Dashboard/DashboardNavigation.tsx
import React from 'react';

interface DashboardNavigationProps {
  selectedView: 'admin' | 'question';
  setSelectedView: React.Dispatch<React.SetStateAction<'admin' | 'question'>>;
}

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({ selectedView, setSelectedView }) => (
  <div className="fixed left-4 top-32 space-y-4 w-64">
    <h2 className="text-white text-2xl font-bold mb-4">Dashboard</h2>
    <button
      className={`w-full text-white py-4 text-xl font-bold rounded-lg ${
        selectedView === 'admin' ? 'bg-[#ff6b6b]' : 'bg-[#ff6b6b]/50'
      } hover:bg-[#ff6b6b]/90`}
      onClick={() => setSelectedView('admin')}
    >
      ADMIN PANEL
    </button>
    <button
      className={`w-full text-white py-4 text-xl font-bold rounded-lg ${
        selectedView === 'question' ? 'bg-[#ff9838]' : 'bg-[#ff9838]/50'
      } hover:bg-[#ff9838]/90`}
      onClick={() => setSelectedView('question')}
    >
      QUESTION MANAGER
    </button>
  </div>
);

export default DashboardNavigation;
