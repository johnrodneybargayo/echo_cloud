// src/components/Dashboard/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  selectedView: "admin" | "question";
  setSelectedView: React.Dispatch<React.SetStateAction<"admin" | "question">>;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedView, setSelectedView }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">DASHBOARD</h2> {/* Title for the sidebar */}
      <div className="sidebar-buttons"> {/* Container for buttons */}
        <button
          className={`sidebar-button ${selectedView === "admin" ? "active" : ""}`}
          onClick={() => setSelectedView("admin")}
        >
          Admin Settings
        </button>
        <button
          className={`sidebar-button ${selectedView === "question" ? "active" : ""}`}
          onClick={() => setSelectedView("question")}
        >
          Question Manager
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
