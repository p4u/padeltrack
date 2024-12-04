import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import { initDb } from './db/config';

// Initialize the database
initDb().catch(error => {
  console.error('Failed to initialize the application:', error);
});

// Create root element
const root = createRoot(document.getElementById('root')!);

// Render the app
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker
registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});