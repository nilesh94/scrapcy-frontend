// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the modern client API
import './index.css';                   // IMPORTANT: Import the global styles here
import App from './App';                 // Import the main App component

// Get the root element from public/index.html
const rootElement = document.getElementById('root'); 

// Create the root container and render the application
const root = ReactDOM.createRoot(rootElement);

root.render(
  // StrictMode helps identify potential problems in an application (recommended practice)
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);

// Note: If you were using any advanced global context providers (like Redux or a global AuthContext), 
// they would also wrap the <App /> component here.
