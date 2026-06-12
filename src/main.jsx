import React from 'react';
import { createRoot } from 'react-dom/client';
import AppSecure from './AppSecure.jsx';
import CompanyAdminPreview from './company-admin-new/CompanyAdminPreview.jsx';
import { startClientTextSanitizer } from './utils/clientTextSanitizer.js';
import { startLeadActivityPopupEnhancer } from './utils/leadActivityPopupEnhancer.js';
import './styles.css';

startClientTextSanitizer();
startLeadActivityPopupEnhancer();

const root = createRoot(document.querySelector('#root'));
const path = window.location.pathname;

root.render(path.startsWith('/company-admin-preview') ? <CompanyAdminPreview /> : <AppSecure />);
