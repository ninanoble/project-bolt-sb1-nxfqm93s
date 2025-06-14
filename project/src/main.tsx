import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Add global styles
const globalStyles = {
  backgroundColor: '#000000',
  minHeight: '100vh',
  width: '100%',
  margin: 0,
  padding: 0,
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Apply styles to root element
Object.assign(rootElement.style, globalStyles);

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);