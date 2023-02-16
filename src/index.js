import React from 'react';
import ReactDOM from 'react-dom/client'; // Using ReactDOM.createRoot for React 18+
import './index.css'; // Assuming a global CSS file for basic styles, or App.css for app-specific styles
import App from './App';
import reportWebVitals from './reportWebVitals'; // For performance monitoring

/**
 * The entry point of the React application.
 * This file sets up the root component and mounts it to the DOM.
 */

// Get the root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');

// Create a root for the React application using ReactDOM.createRoot.
// This is the recommended way to render React apps starting with React 18.
const root = ReactDOM.createRoot(rootElement);

// Render the main App component into the root.
// React.StrictMode is used to highlight potential problems in an application.
// It activates additional checks and warnings for its descendants.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();