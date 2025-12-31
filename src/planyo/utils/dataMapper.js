/**
 * Data Mapper Utilities
 * Transforms Planyo API data to react-big-schedule format
 */

import dayjs from 'dayjs';

/**
 * Determine event color based on reservation status
 * @param {Object} reservation - Planyo reservation object
 * @returns {string} Hex color code
 */
export const getStatusColor = (reservation) => {
  if (reservation.cancelled) return '#f5222d'; // Red - Cancelled
  if (reservation.checked_in && !reservation.checked_out) return '#52c41a'; // Green - Checked In
  if (reservation.checked_out) return '#8c8c8c'; // Gray - Checked Out
  if (reservation.pending_payment) return '#faad14'; // Orange - Pending Payment
  if (reservation.confirmed) return '#1890ff'; // Blue - Confirmed
  return '#d9d9d9'; // Light Gray - Default/Unknown
};

/**
 * Get status label for display
 * @param {Object} reservation - Planyo reservation object
 * @returns {string} Status label
 */
export const getStatusLabel = (reservation) => {
  if (reservation.cancelled) return 'Cancelled';
  if (reservation.checked_out) return 'Checked Out';
  if (reservation.checked_in) return 'Checked In';
  if (reservation.pending_payment) return 'Pending Payment';
  if (reservation.confirmed) return 'Confirmed';
  return 'Pending';
};

/**
 * Map Planyo reservations to Scheduler events
 * @param {Array} planyoReservations - Array of Planyo reservation objects
 * @returns {Array} Array of scheduler event objects
 */
export const mapReservationsToEvents = (planyoReservations) => {
  if (!Array.isArray(planyoReservations)) {
    console.warn('mapReservationsToEvents: Invalid input, expected array');
    return [];
  }

  return planyoReservations
    .filter(reservation => reservation && reservation.id)
    .map(reservation => ({
      id: String(reservation.id),
      title: reservation.client_name || 'Unnamed Client',
      start: reservation.start_time,
      end: reservation.end_time,
      resourceId: String(reservation.service_id),
      bgColor: getStatusColor(reservation),
      // Store complete Planyo data for later use
      planyoData: {
        ...reservation,
        client_name: reservation.client_name || '',
        client_email: reservation.email || '',
        client_phone: reservation.phone || '',
        client_country: reservation.country || '',
        service_name: reservation.service_name || '',
        checked_in: reservation.checked_in || false,
        checked_out: reservation.checked_out || false,
        cancelled: reservation.cancelled || false,
        payment_status: reservation.payment_status || 'pending',
        total_amount: reservation.total_amount || 0,
        notes: reservation.notes || '',
        created_at: reservation.created_at || null,
      },
      // Control event behavior
      movable: !reservation.checked_in && !reservation.cancelled,
      resizable: !reservation.checked_in && !reservation.cancelled,
      showPopover: true,
    }))
    .sort((a, b) => new Date(a.start) - new Date(b.start)); // Sort by start time
};

/**
 * Map Planyo services to Scheduler resources
 * @param {Array} planyoServices - Array of Planyo service objects
 * @returns {Array} Array of scheduler resource objects
 */
export const mapServicesToResources = (planyoServices) => {
  if (!Array.isArray(planyoServices)) {
    console.warn('mapServicesToResources: Invalid input, expected array');
    return [];
  }

  return planyoServices
    .filter(service => service && service.id)
    .map(service => ({
      id: String(service.id),
      name: service.name || 'Unnamed Service',
      title: service.display_name || service.name || 'Unnamed Service',
      // Support for hierarchical grouping
      parentId: service.category_id ? String(service.category_id) : undefined,
      groupOnly: service.is_category || false,
    }));
};

/**
 * Map service categories to resources (for hierarchical display)
 * @param {Array} categories - Array of category objects
 * @returns {Array} Array of scheduler resource objects
 */
export const mapCategoriesToResources = (categories) => {
  if (!Array.isArray(categories)) {
    return [];
  }

  return categories
    .filter(category => category && category.id)
    .map(category => ({
      id: String(category.id),
      name: category.name || 'Unnamed Category',
      title: category.name || 'Unnamed Category',
      groupOnly: true,
    }));
};

/**
 * Combine categories and services into a single resources array
 * @param {Array} categories - Service categories
 * @param {Array} services - Services
 * @returns {Array} Combined resources array
 */
export const combineResources = (categories, services) => {
  const categoryResources = mapCategoriesToResources(categories);
  const serviceResources = mapServicesToResources(services);
  return [...categoryResources, ...serviceResources];
};

/**
 * Check if two dates are the same day
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean} True if same day
 */
export const isSameDate = (date1, date2) => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);
  return d1.format('YYYY-MM-DD') === d2.format('YYYY-MM-DD');
};

/**
 * Filter events by date
 * @param {Array} events - Array of events
 * @param {string} date - Date to filter by (YYYY-MM-DD)
 * @returns {Array} Filtered events
 */
export const filterEventsByDate = (events, date) => {
  return events.filter(event => isSameDate(event.start, date));
};

/**
 * Filter events by resource and date
 * @param {Array} events - Array of events
 * @param {string} resourceId - Resource ID
 * @param {string} date - Date to filter by
 * @returns {Array} Filtered events
 */
export const filterEventsByResourceAndDate = (events, resourceId, date) => {
  return events.filter(
    event =>
      event.resourceId === resourceId && isSameDate(event.start, date)
  );
};

/**
 * Calculate occupancy statistics
 * @param {Array} events - Array of events
 * @param {Array} resources - Array of resources
 * @returns {Object} Statistics object
 */
export const calculateOccupancyStats = (events, resources) => {
  const totalReservations = events.length;
  const checkedIn = events.filter(e => e.planyoData?.checked_in).length;
  const cancelled = events.filter(e => e.planyoData?.cancelled).length;
  const pending = events.filter(
    e => !e.planyoData?.checked_in && !e.planyoData?.cancelled
  ).length;

  const totalRevenue = events
    .filter(e => !e.planyoData?.cancelled)
    .reduce((sum, e) => sum + (e.planyoData?.total_amount || 0), 0);

  return {
    totalReservations,
    checkedIn,
    cancelled,
    pending,
    totalRevenue,
    occupancyRate: resources.length > 0 
      ? ((totalReservations / resources.length) * 100).toFixed(1)
      : 0,
  };
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount || 0);
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (dayjs format)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'MMM D, YYYY') => {
  return dayjs(date).format(format);
};

/**
 * Format time for display
 * @param {string|Date} date - Date/time to format
 * @param {string} format - Format string (default: h:mm A)
 * @returns {string} Formatted time string
 */
export const formatTime = (date, format = 'h:mm A') => {
  return dayjs(date).format(format);
};

/**
 * Get duration between two times
 * @param {string|Date} start - Start time
 * @param {string|Date} end - End time
 * @returns {string} Duration string (e.g., "2 hours")
 */
export const getDuration = (start, end) => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const hours = endDate.diff(startDate, 'hour');
  const minutes = endDate.diff(startDate, 'minute') % 60;

  if (hours === 0) {
    return `${minutes} minutes`;
  }
  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  return `${hours}h ${minutes}m`;
};
