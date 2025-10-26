import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import factoryLogo from './assets/images/logo.png';

// Dynamically set the favicon to the factory logo
(function setFavicon() {
  try {
    const head = document.head || document.getElementsByTagName('head')[0];
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'icon');
      head.appendChild(link);
    }
    // If the href is already our logo, skip
    if (!link.getAttribute('href') || !link.getAttribute('href').includes('logo')) {
      link.setAttribute('href', factoryLogo);
    }
  } catch (_e) {
    // no-op if document/head is unavailable (e.g., SSR)
  }
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();