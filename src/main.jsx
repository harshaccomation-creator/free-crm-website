import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const container = document.querySelector('#root');
createRoot(container).render(<App />);
