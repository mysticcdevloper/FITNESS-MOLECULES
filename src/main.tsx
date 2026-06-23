import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Add dynamic global catch listeners to mitigate sandboxed iframe security issues and script cross-origin maskings
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.warn("Molecules Guard: Uncaught error captured inside secure frame context:", event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.warn("Molecules Guard: Unhandled rejection captured inside secure frame context:", event.reason);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

