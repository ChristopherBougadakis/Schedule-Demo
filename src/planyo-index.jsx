/**
 * Development/Testing Entry Point
 * Uses mock data instead of real Planyo API
 * Switch to real API by changing imports in BookingScheduler.jsx
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import PlanyoApp from './planyo/App';
import 'antd/dist/reset.css';

console.log('[planyo-index] Script loading');

const rootElement = document.getElementById('root');
console.log('[planyo-index] Root element:', rootElement);

if (!rootElement) {
  console.error('[planyo-index] ERROR: Root element not found!');
  document.body.innerHTML = '<h1 style="color:red;">ERROR: Root element not found!</h1>';
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    console.log('[planyo-index] React root created');

    root.render(
      <React.StrictMode>
        <PlanyoApp />
      </React.StrictMode>
    );
    console.log('[planyo-index] App rendered');
  } catch (error) {
    console.error('[planyo-index] ERROR rendering app:', error);
    document.body.innerHTML = '<h1 style="color:red;">ERROR: ' + error.message + '</h1>';
  }
}

console.log('%c🚀 Planyo Booking Scheduler - Development Mode', 'color: #1890ff; font-size: 16px; font-weight: bold');
console.log('%cUsing MOCK data. Configure .env to use real Planyo API.', 'color: #faad14; font-size: 12px');
