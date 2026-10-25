import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './design/tokens.css';
import { applyTheme, getInitialTheme } from './lib/theme';

applyTheme(getInitialTheme());

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
