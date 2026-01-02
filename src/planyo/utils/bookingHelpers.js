/**
 * Booking Helper Functions
 */
import dayjs from 'dayjs';

/**
 * Check for time overlap on a specific boat
 */
export const checkBoatTimeOverlap = (date, startTime, endTime, boatId, excludeEventId, events) => {
  const newStart = date.clone().hour(startTime.hour()).minute(startTime.minute()).toDate();
  const newEnd = date.clone().hour(endTime.hour()).minute(endTime.minute()).toDate();

  return events.some(event => {
    if (event.id === excludeEventId) return false;
    if (event.resourceId !== boatId) return false;

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // Check if times overlap
    return (newStart < eventEnd && newEnd > eventStart);
  });
};

/**
 * Update event status (cancelled, refunded, etc.)
 */
export const updateEventStatus = (events, eventId, status) => {
  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex !== -1) {
    events[eventIndex].eventStatus = status;
    if (status === 'cancelled') {
      // Remove from events array
      events.splice(eventIndex, 1);
    } else if (status === 'refunded') {
      // Update color to gray to show refunded
      events[eventIndex].bgColor = '#d9d9d9';
      events[eventIndex].title = `[REFUNDED] ${events[eventIndex].title.replace(/^\[REFUNDED\]\s/, '')}`;
    }
  }
  return events;
};

/**
 * Calculate refund amount based on percentage
 */
export const calculateRefund = (price, percentage) => {
  return (price * percentage / 100).toFixed(2);
};
