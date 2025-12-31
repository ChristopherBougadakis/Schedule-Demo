/**
 * Mock Data for Testing Planyo Integration
 * Use this when Planyo API is not yet configured
 */

export const mockServices = [
  {
    id: 'service-1',
    name: 'Massage Therapy',
    display_name: 'Professional Massage Therapy',
    category_id: null,
    is_category: false,
  },
  {
    id: 'service-2',
    name: 'Facial Treatment',
    display_name: 'Luxury Facial Treatment',
    category_id: null,
    is_category: false,
  },
  {
    id: 'service-3',
    name: 'Spa Package',
    display_name: 'Complete Spa Package',
    category_id: null,
    is_category: false,
  },
  {
    id: 'service-4',
    name: 'Yoga Session',
    display_name: 'Private Yoga Session',
    category_id: null,
    is_category: false,
  },
];

export const mockReservations = [
  {
    id: '1',
    client_name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0101',
    country: 'United States',
    service_id: 'service-1',
    service_name: 'Massage Therapy',
    start_time: '2025-12-30 10:00:00',
    end_time: '2025-12-30 11:30:00',
    checked_in: true,
    checked_out: false,
    cancelled: false,
    payment_status: 'paid',
    total_amount: 120.00,
    notes: 'Regular customer, prefers light pressure',
    created_at: '2025-12-20 14:30:00',
  },
  {
    id: '2',
    client_name: 'Emma Johnson',
    email: 'emma.j@email.com',
    phone: '+1-555-0102',
    country: 'Canada',
    service_id: 'service-2',
    service_name: 'Facial Treatment',
    start_time: '2025-12-30 14:00:00',
    end_time: '2025-12-30 15:00:00',
    checked_in: false,
    checked_out: false,
    cancelled: false,
    payment_status: 'pending',
    total_amount: 85.00,
    notes: 'First time customer',
    created_at: '2025-12-28 09:15:00',
  },
  {
    id: '3',
    client_name: 'Michael Brown',
    email: 'michael.b@email.com',
    phone: '+1-555-0103',
    country: 'United States',
    service_id: 'service-3',
    service_name: 'Spa Package',
    start_time: '2025-12-31 09:00:00',
    end_time: '2025-12-31 12:00:00',
    checked_in: false,
    checked_out: false,
    cancelled: false,
    payment_status: 'paid',
    total_amount: 250.00,
    notes: 'Anniversary gift',
    created_at: '2025-12-15 16:45:00',
  },
  {
    id: '4',
    client_name: 'Sarah Davis',
    email: 'sarah.d@email.com',
    phone: '+1-555-0104',
    country: 'United Kingdom',
    service_id: 'service-1',
    service_name: 'Massage Therapy',
    start_time: '2025-12-31 13:00:00',
    end_time: '2025-12-31 14:00:00',
    checked_in: false,
    checked_out: false,
    cancelled: false,
    payment_status: 'paid',
    total_amount: 95.00,
    notes: 'Focus on lower back',
    created_at: '2025-12-27 11:20:00',
  },
  {
    id: '5',
    client_name: 'James Wilson',
    email: 'james.w@email.com',
    phone: '+1-555-0105',
    country: 'Australia',
    service_id: 'service-4',
    service_name: 'Yoga Session',
    start_time: '2026-01-01 08:00:00',
    end_time: '2026-01-01 09:00:00',
    checked_in: false,
    checked_out: false,
    cancelled: true,
    payment_status: 'refunded',
    total_amount: 60.00,
    notes: 'Cancelled due to travel plans',
    created_at: '2025-12-10 08:30:00',
  },
  {
    id: '6',
    client_name: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    phone: '+1-555-0106',
    country: 'United States',
    service_id: 'service-2',
    service_name: 'Facial Treatment',
    start_time: '2026-01-02 11:00:00',
    end_time: '2026-01-02 12:00:00',
    checked_in: false,
    checked_out: false,
    cancelled: false,
    payment_status: 'paid',
    total_amount: 85.00,
    notes: 'Sensitive skin',
    created_at: '2025-12-29 13:10:00',
  },
  {
    id: '7',
    client_name: 'Robert Taylor',
    email: 'robert.t@email.com',
    phone: '+1-555-0107',
    country: 'United States',
    service_id: 'service-3',
    service_name: 'Spa Package',
    start_time: '2026-01-02 14:00:00',
    end_time: '2026-01-02 17:00:00',
    checked_in: true,
    checked_out: true,
    cancelled: false,
    payment_status: 'paid',
    total_amount: 250.00,
    notes: 'Completed session',
    created_at: '2025-12-18 10:00:00',
  },
  {
    id: '8',
    client_name: 'Maria Garcia',
    email: 'maria.g@email.com',
    phone: '+1-555-0108',
    country: 'Spain',
    service_id: 'service-1',
    service_name: 'Massage Therapy',
    start_time: '2026-01-03 10:00:00',
    end_time: '2026-01-03 11:00:00',
    checked_in: false,
    checked_out: false,
    cancelled: false,
    payment_status: 'pending',
    total_amount: 100.00,
    notes: 'Pregnant - prenatal massage',
    created_at: '2025-12-28 15:40:00',
  },
];

/**
 * Mock API functions that return promises with delays
 * Replace these with actual Planyo API calls when ready
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockFetchReservations = async (startDate, endDate) => {
  await delay(500); // Simulate network delay
  console.log(`[MOCK] Fetching reservations from ${startDate} to ${endDate}`);
  return mockReservations;
};

export const mockFetchServices = async () => {
  await delay(300);
  console.log('[MOCK] Fetching services');
  return mockServices;
};

export const mockCheckInClient = async (reservationId) => {
  await delay(400);
  console.log(`[MOCK] Checking in reservation ${reservationId}`);
  return { success: true, message: 'Client checked in' };
};

export const mockCheckOutClient = async (reservationId) => {
  await delay(400);
  console.log(`[MOCK] Checking out reservation ${reservationId}`);
  return { success: true, message: 'Client checked out' };
};

export const mockCancelReservation = async (reservationId, reason) => {
  await delay(500);
  console.log(`[MOCK] Cancelling reservation ${reservationId}: ${reason}`);
  return { success: true, message: 'Reservation cancelled' };
};

export const mockProcessRefund = async (reservationId, amount) => {
  await delay(600);
  console.log(`[MOCK] Processing refund of $${amount} for reservation ${reservationId}`);
  return { success: true, message: `Refund of $${amount} processed` };
};

export const mockUpdateReservationTime = async (reservationId, newStart, newEnd, serviceId) => {
  await delay(500);
  console.log(`[MOCK] Updating reservation ${reservationId} to ${newStart} - ${newEnd}`);
  return { success: true, message: 'Reservation updated' };
};
