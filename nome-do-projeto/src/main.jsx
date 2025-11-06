import React from 'react';
import ReactDOM from 'react-dom/client'; // Importe de 'react-dom/client'
import App from './App';

// Crie o "root"
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderize o App dentro do root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);