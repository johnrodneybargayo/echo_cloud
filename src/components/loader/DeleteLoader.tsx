// src/components/loader/DeleteLoader.tsx
import React from 'react';
import './DeleteLoader.css'; // Make sure to import the correct CSS file

const DeleteLoader: React.FC = () => {
    return (
        <div className="loader-overlay"> {/* Dark overlay for the loader */}
            <div className="delete-loader">Deleting</div>
        </div>
    );
};

export default DeleteLoader;
