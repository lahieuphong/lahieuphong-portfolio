import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { initPortfolio } from '../js/main.js';
import '../css/style.css';

createRoot(document.getElementById('root')).render(<App />);

requestAnimationFrame(() => {
  initPortfolio();
});
