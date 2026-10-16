import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import './index.css';

// Accounts and orders used to be kept in the browser (passwords included); they now live on the server.
try {
  localStorage.removeItem('threadline-auth');
  localStorage.removeItem('threadline-orders');
} catch {
  // Storage can be unavailable (e.g. privacy modes); nothing to clean up then.
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
