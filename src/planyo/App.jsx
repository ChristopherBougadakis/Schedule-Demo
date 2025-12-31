/**
 * Planyo Booking Application
 * Standalone app entry point
 */

import React, { useEffect } from 'react';
import BookingScheduler from './components/BookingScheduler';

function PlanyoApp() {
  useEffect(() => {
    // Force landscape orientation on mobile devices
    if (window.screen && window.screen.orientation) {
      try {
        window.screen.orientation.lock('landscape').catch(() => {
          // Fallback if lock fails
          console.log('Landscape lock not supported');
        });
      } catch (error) {
        console.log('Screen orientation API not available');
      }
    }
  }, []);

  return <BookingScheduler />;
}

export default PlanyoApp;
