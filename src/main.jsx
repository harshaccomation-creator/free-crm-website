import React from 'react';
import { createRoot } from 'react-dom/client';
import AppSecure from './AppSecure.jsx';
import './styles.css';

createRoot(document.querySelector('#root')).render(<AppSecure />);
