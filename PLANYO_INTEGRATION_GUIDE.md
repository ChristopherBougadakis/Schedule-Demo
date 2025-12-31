# COMPREHENSIVE INTEGRATION GUIDE: Planyo API → React-Big-Schedule

## PROJECT OVERVIEW

You are building a booking management application that replaces Planyo's default scheduler with react-big-schedule (an advanced React scheduler component). The system will fetch reservation data from Planyo API and display it in an interactive, feature-rich scheduler where users can manage check-ins, view client details, and perform administrative actions.

---

## FINAL GOAL

Create a fully functional reservation management system with:

1. **Data Integration**: Fetch JSON data from Planyo API (reservations, clients, services)
2. **Visual Display**: Show reservations as event boxes on the scheduler timeline
3. **Interactive UI**: Click on service boxes to open popups showing all clients for that service/date
4. **Client Management**: Click individual clients to view full details and perform actions
5. **Admin Features**: Check-in/check-out, refunds, cancellations, manual check-ins
6. **Real-time Updates**: Sync changes back to Planyo database

---

## STEP-BY-STEP IMPLEMENTATION GUIDE

### PHASE 1: Understanding the Codebase Structure

#### **File: `/src/components/SchedulerData.js`** (Core Data Model)

- **What it does**: Main data controller for the scheduler
- **Key methods to understand**:
  - `setResources()` - Sets the rows (e.g., service types, rooms)
  - `setEvents()` - Sets the reservation boxes on the timeline
  - `addEvent()`, `updateEvent()`, `moveEvent()` - Modify events
- **Your task**: Learn how data flows from SchedulerData to the UI

#### **File: `/src/components/index.jsx`** (Main Scheduler Component)

- **What it does**: Renders the complete scheduler UI
- **Props to study**:
  - `schedulerData` - The data model instance
  - `eventItemClick` - Handler when clicking an event
  - `newEvent` - Handler for creating new reservations
  - `updateEventStart/End` - Handlers for dragging/resizing events
- **Your task**: Understand the component lifecycle and event handlers

#### **File: `/src/components/EventItem.jsx`** (Individual Reservation Box)

- **What it does**: Renders each reservation as a colored box
- **Key features**: Drag-and-drop, resizing, click handlers
- **Your task**: Identify where to add custom click handlers for your popup

#### **File: `/src/components/EventItemPopover.jsx`** (Current Popup)

- **What it does**: Shows basic event details on hover/click
- **Your task**: This will be replaced/extended with your custom client list popup

---

### PHASE 2: Planyo API Integration

#### **Step 2.1: Create API Service File**

**File to create**: `/src/services/planyoApi.js`

**Functions needed**:

```javascript
// Fetch all reservations for a date range
export const fetchReservations = async (startDate, endDate) => {
  try {
    const response = await fetch(`https://api.planyo.com/api/get_reservations?start=${startDate}&end=${endDate}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

// Fetch client details by reservation ID
export const fetchClientDetails = async (reservationId) => {
  try {
    const response = await fetch(`https://api.planyo.com/api/get_reservation/${reservationId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching client details:', error);
    throw error;
  }
};

// Check-in a client
export const checkInClient = async (reservationId) => {
  try {
    const response = await fetch(`https://api.planyo.com/api/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservation_id: reservationId })
    });
    return await response.json();
  } catch (error) {
    console.error('Error checking in client:', error);
    throw error;
  }
};

// Cancel reservation
export const cancelReservation = async (reservationId, reason) => {
  try {
    const response = await fetch(`https://api.planyo.com/api/cancel_reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservation_id: reservationId, reason })
    });
    return await response.json();
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    throw error;
  }
};

// Process refund
export const processRefund = async (reservationId, amount) => {
  try {
    const response = await fetch(`https://api.planyo.com/api/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservation_id: reservationId, amount })
    });
    return await response.json();
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

// Fetch available services
export const fetchServices = async () => {
  try {
    const response = await fetch(`https://api.planyo.com/api/get_services`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};
```

#### **Step 2.2: Map Planyo Data to Scheduler Format**

**File to create**: `/src/utils/dataMapper.js`

**Transform Planyo JSON** to scheduler format:

```javascript
// Helper function to determine status color
export const getStatusColor = (reservation) => {
  if (reservation.checked_in) return '#52c41a'; // Green
  if (reservation.cancelled) return '#f5222d'; // Red
  if (reservation.pending_payment) return '#faad14'; // Orange
  if (reservation.confirmed) return '#1890ff'; // Blue
  return '#d9d9d9'; // Gray (default)
};

// Map Planyo reservations to Scheduler events
export const mapReservationsToEvents = (planyoReservations) => {
  return planyoReservations.map(reservation => ({
    id: reservation.id,
    title: reservation.client_name,
    start: reservation.start_time,
    end: reservation.end_time,
    resourceId: reservation.service_id,
    bgColor: getStatusColor(reservation),
    // Store full Planyo data for later use
    planyoData: {
      ...reservation,
      client_email: reservation.email,
      client_phone: reservation.phone,
      client_country: reservation.country,
      checked_in: reservation.checked_in || false,
      payment_status: reservation.payment_status,
      total_amount: reservation.total_amount
    }
  }));
};

// Map Planyo services to Scheduler resources
export const mapServicesToResources = (planyoServices) => {
  return planyoServices.map(service => ({
    id: service.id,
    name: service.name,
    title: service.display_name || service.name
  }));
};

// Helper to check if two dates are the same
export const isSameDate = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};
```

---

### PHASE 3: Building Custom Components

#### **Step 3.1: Create Main Application Component**

**File to create**: `/src/App.jsx`

**Responsibilities**:
1. Initialize SchedulerData instance
2. Fetch data from Planyo API on mount
3. Transform Planyo data using dataMapper
4. Pass data to Scheduler component
5. Handle all event callbacks

**Example structure**:

```jsx
import React, { useEffect, useState } from 'react';
import { Scheduler, SchedulerData, ViewType } from './components';
import { fetchReservations, fetchServices } from './services/planyoApi';
import { mapReservationsToEvents, mapServicesToResources } from './utils/dataMapper';
import ReservationPopup from './components/ReservationPopup';
import ClientDetailsModal from './components/ClientDetailsModal';
import { Spin, message } from 'antd';
import dayjs from 'dayjs';

function App() {
  const [schedulerData, setSchedulerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupData, setPopupData] = useState({
    reservationPopup: false,
    clientModal: false,
    selectedReservations: [],
    selectedClient: null
  });

  useEffect(() => {
    initializeScheduler();
  }, []);

  // Initialize scheduler with Planyo data
  const initializeScheduler = async () => {
    try {
      setLoading(true);

      // 1. Create scheduler instance
      const scheduler = new SchedulerData(
        dayjs().format('YYYY-MM-DD'),
        ViewType.Week,
        false,
        false,
        {
          besidesWidth: 200,
          schedulerContentHeight: '100vh',
          eventItemPopoverTrigger: 'click',
          dayStartFrom: 8,
          dayStopTo: 20,
          eventItemHeight: 30,
          eventItemLineHeight: 32
        }
      );

      // 2. Fetch Planyo data
      const startDate = dayjs().startOf('week').format('YYYY-MM-DD');
      const endDate = dayjs().endOf('week').format('YYYY-MM-DD');
      
      const planyoReservations = await fetchReservations(startDate, endDate);
      const planyoServices = await fetchServices();

      // 3. Transform data
      const resources = mapServicesToResources(planyoServices);
      const events = mapReservationsToEvents(planyoReservations);

      // 4. Set data
      scheduler.setResources(resources);
      scheduler.setEvents(events);

      setSchedulerData(scheduler);
    } catch (error) {
      message.error('Failed to load scheduler data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data from Planyo API
  const refreshData = async () => {
    try {
      const startDate = schedulerData.startDate;
      const endDate = schedulerData.endDate;
      
      const planyoReservations = await fetchReservations(startDate, endDate);
      const events = mapReservationsToEvents(planyoReservations);
      
      schedulerData.setEvents(events);
      setSchedulerData({ ...schedulerData });
      
      message.success('Data refreshed');
    } catch (error) {
      message.error('Failed to refresh data');
    }
  };

  // Handle event click - show all reservations for this service/time
  const handleEventClick = (scheduler, event) => {
    const serviceId = event.resourceId;
    const eventDate = event.start;
    
    // Find all reservations for this service on this date
    const relatedReservations = scheduler.events.filter(
      e => e.resourceId === serviceId && isSameDate(e.start, eventDate)
    );

    setPopupData({
      ...popupData,
      reservationPopup: true,
      selectedReservations: relatedReservations
    });
  };

  // Handle client click from popup - show full details
  const handleClientClick = (client) => {
    setPopupData({
      ...popupData,
      reservationPopup: false,
      clientModal: true,
      selectedClient: client
    });
  };

  // Close modals
  const closeModals = () => {
    setPopupData({
      reservationPopup: false,
      clientModal: false,
      selectedReservations: [],
      selectedClient: null
    });
  };

  // Handle previous week
  const prevClick = (scheduler) => {
    scheduler.prev();
    refreshData();
  };

  // Handle next week
  const nextClick = (scheduler) => {
    scheduler.next();
    refreshData();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Scheduler
        schedulerData={schedulerData}
        prevClick={prevClick}
        nextClick={nextClick}
        onViewChange={(scheduler, view) => {
          scheduler.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
          refreshData();
        }}
        eventItemClick={handleEventClick}
      />

      <ReservationPopup
        visible={popupData.reservationPopup}
        reservations={popupData.selectedReservations}
        onClose={closeModals}
        onClientClick={handleClientClick}
      />

      <ClientDetailsModal
        visible={popupData.clientModal}
        client={popupData.selectedClient}
        onClose={closeModals}
        onUpdate={refreshData}
      />
    </div>
  );
}

export default App;
```

---

#### **Step 3.2: Create Custom Event Popup Component**

**File to create**: `/src/components/ReservationPopup.jsx`

**Purpose**: Show all clients for a specific service/date when clicking a reservation box

**Features**:
- List all reservations for that time slot
- Show client names, phone numbers, countries
- Check-in status indicators
- Click on client row to see full details

**Example structure**:

```jsx
import React from 'react';
import { Modal, List, Tag, Avatar, Typography } from 'antd';
import { UserOutlined, PhoneOutlined, GlobalOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

function ReservationPopup({ visible, reservations, onClose, onClientClick }) {
  if (!reservations || reservations.length === 0) {
    return null;
  }

  // Get service name from first reservation
  const serviceName = reservations[0]?.planyoData?.service_name || 'Reservations';
  const date = new Date(reservations[0]?.start).toLocaleDateString();

  return (
    <Modal
      title={`${serviceName} - ${date}`}
      open={visible}
      onCancel={onClose}
      width={700}
      footer={null}
      bodyStyle={{ maxHeight: '60vh', overflow: 'auto' }}
    >
      <List
        itemLayout="horizontal"
        dataSource={reservations}
        renderItem={reservation => {
          const client = reservation.planyoData;
          const isCheckedIn = client.checked_in;

          return (
            <List.Item
              onClick={() => onClientClick(reservation)}
              style={{
                cursor: 'pointer',
                padding: '16px',
                borderRadius: '8px',
                transition: 'background-color 0.3s',
              }}
              className="reservation-list-item"
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} size={48} />}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: '16px' }}>
                      {reservation.title}
                    </Text>
                    <Tag
                      icon={isCheckedIn ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                      color={isCheckedIn ? 'success' : 'warning'}
                    >
                      {isCheckedIn ? 'Checked In' : 'Not Checked In'}
                    </Tag>
                  </div>
                }
                description={
                  <div style={{ marginTop: '8px' }}>
                    <div>
                      <PhoneOutlined style={{ marginRight: '8px' }} />
                      <Text>{client.client_phone || 'N/A'}</Text>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <GlobalOutlined style={{ marginRight: '8px' }} />
                      <Text>{client.client_country || 'N/A'}</Text>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <ClockCircleOutlined style={{ marginRight: '8px' }} />
                      <Text>
                        {new Date(reservation.start).toLocaleTimeString()} - {new Date(reservation.end).toLocaleTimeString()}
                      </Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />

      <style jsx>{`
        .reservation-list-item:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </Modal>
  );
}

export default ReservationPopup;
```

---

#### **Step 3.3: Create Client Details Modal**

**File to create**: `/src/components/ClientDetailsModal.jsx`

**Purpose**: Show full client information and action buttons

**Features**:
- Display: Name, email, phone, country, booking details, payment status
- Actions: Check-in, Cancel, Refund, Edit
- Call Planyo API functions when actions are clicked

**Example structure**:

```jsx
import React, { useState } from 'react';
import { Modal, Descriptions, Button, Space, message, Tag, Popconfirm, Input } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  GlobalOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { checkInClient, cancelReservation, processRefund } from '../services/planyoApi';

function ClientDetailsModal({ visible, client, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');

  if (!client || !client.planyoData) {
    return null;
  }

  const data = client.planyoData;

  // Handle check-in
  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await checkInClient(client.id);
      message.success('Client checked in successfully');
      onUpdate(); // Refresh data
      onClose();
    } catch (error) {
      message.error('Failed to check in client');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancellation
  const handleCancel = async () => {
    try {
      setLoading(true);
      await cancelReservation(client.id, 'Cancelled by admin');
      message.success('Reservation cancelled successfully');
      onUpdate();
      onClose();
    } catch (error) {
      message.error('Failed to cancel reservation');
    } finally {
      setLoading(false);
    }
  };

  // Handle refund
  const handleRefund = async () => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      message.error('Please enter a valid refund amount');
      return;
    }

    try {
      setLoading(true);
      await processRefund(client.id, parseFloat(refundAmount));
      message.success(`Refund of $${refundAmount} processed successfully`);
      setRefundAmount('');
      onUpdate();
      onClose();
    } catch (error) {
      message.error('Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <UserOutlined style={{ fontSize: '24px' }} />
          <span>Client Details</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={
        <Space>
          {!data.checked_in && (
            <Popconfirm
              title="Check in this client?"
              description="Are you sure you want to check in this client?"
              onConfirm={handleCheckIn}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" icon={<CheckCircleOutlined />} loading={loading}>
                Check In
              </Button>
            </Popconfirm>
          )}
          
          {data.checked_in && (
            <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontSize: '14px', padding: '4px 12px' }}>
              Already Checked In
            </Tag>
          )}

          <Popconfirm
            title="Cancel this reservation?"
            description="This action cannot be undone. Continue?"
            onConfirm={handleCancel}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<CloseCircleOutlined />} loading={loading}>
              Cancel Reservation
            </Button>
          </Popconfirm>

          <Button onClick={onClose}>Close</Button>
        </Space>
      }
    >
      <Descriptions bordered column={2} size="middle">
        <Descriptions.Item label="Full Name" span={2}>
          <strong>{client.title}</strong>
        </Descriptions.Item>
        
        <Descriptions.Item label="Email" span={2}>
          <MailOutlined style={{ marginRight: '8px' }} />
          {data.client_email || 'N/A'}
        </Descriptions.Item>
        
        <Descriptions.Item label="Phone">
          <PhoneOutlined style={{ marginRight: '8px' }} />
          {data.client_phone || 'N/A'}
        </Descriptions.Item>
        
        <Descriptions.Item label="Country">
          <GlobalOutlined style={{ marginRight: '8px' }} />
          {data.client_country || 'N/A'}
        </Descriptions.Item>
        
        <Descriptions.Item label="Service" span={2}>
          {data.service_name || 'N/A'}
        </Descriptions.Item>
        
        <Descriptions.Item label="Start Date & Time">
          {new Date(client.start).toLocaleString()}
        </Descriptions.Item>
        
        <Descriptions.Item label="End Date & Time">
          {new Date(client.end).toLocaleString()}
        </Descriptions.Item>
        
        <Descriptions.Item label="Check-in Status">
          {data.checked_in ? (
            <Tag icon={<CheckCircleOutlined />} color="success">Checked In</Tag>
          ) : (
            <Tag icon={<ClockCircleOutlined />} color="warning">Not Checked In</Tag>
          )}
        </Descriptions.Item>
        
        <Descriptions.Item label="Payment Status">
          {data.payment_status === 'paid' ? (
            <Tag color="success">Paid</Tag>
          ) : (
            <Tag color="orange">Pending</Tag>
          )}
        </Descriptions.Item>
        
        <Descriptions.Item label="Total Amount" span={2}>
          <DollarOutlined style={{ marginRight: '8px' }} />
          <strong>${data.total_amount || '0.00'}</strong>
        </Descriptions.Item>
      </Descriptions>

      {/* Refund Section */}
      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h4>Process Refund</h4>
        <Space>
          <Input
            type="number"
            placeholder="Enter refund amount"
            prefix={<DollarOutlined />}
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            style={{ width: '200px' }}
          />
          <Popconfirm
            title="Process refund?"
            description={`Refund $${refundAmount} to this client?`}
            onConfirm={handleRefund}
            okText="Yes"
            cancelText="No"
            disabled={!refundAmount}
          >
            <Button icon={<DollarOutlined />} loading={loading} disabled={!refundAmount}>
              Process Refund
            </Button>
          </Popconfirm>
        </Space>
      </div>
    </Modal>
  );
}

export default ClientDetailsModal;
```

---

### PHASE 4: Connecting Everything Together

#### **Step 4.1: Event Flow Summary**

1. **User clicks on a reservation box** → `handleEventClick` is called
2. **Find all reservations for that service/date** → Filter events array
3. **Open ReservationPopup** → Show list of all clients
4. **User clicks on a client in the list** → `handleClientClick` is called
5. **Open ClientDetailsModal** → Show full client information
6. **User performs an action** (check-in, cancel, refund) → API call to Planyo
7. **Refresh data** → Re-fetch from Planyo and update scheduler

#### **Step 4.2: Implement Data Refresh**

**When**: After check-in, cancellation, or refund

**How**: Re-fetch from Planyo API and update scheduler

```jsx
const refreshData = async () => {
  try {
    const startDate = schedulerData.startDate;
    const endDate = schedulerData.endDate;
    
    const planyoReservations = await fetchReservations(startDate, endDate);
    const events = mapReservationsToEvents(planyoReservations);
    
    schedulerData.setEvents(events);
    setSchedulerData({ ...schedulerData }); // Trigger re-render
    
    message.success('Data updated successfully');
  } catch (error) {
    message.error('Failed to refresh data');
    console.error(error);
  }
};
```

#### **Step 4.3: Add Visual Status Indicators**

**File**: `/src/utils/dataMapper.js`

**Function**: Color-code events by status

```javascript
export const getStatusColor = (reservation) => {
  if (reservation.cancelled) return '#f5222d'; // Red - Cancelled
  if (reservation.checked_in) return '#52c41a'; // Green - Checked In
  if (reservation.pending_payment) return '#faad14'; // Orange - Pending Payment
  if (reservation.confirmed) return '#1890ff'; // Blue - Confirmed
  return '#d9d9d9'; // Gray - Default/Unknown
};
```

---

### PHASE 5: Advanced Features

#### **Step 5.1: Multi-Client Display**

**Challenge**: Multiple clients in same time slot

**Solution**: Aggregate and show count

**In ReservationPopup.jsx**:
```jsx
<Modal
  title={`${serviceName} - ${date} (${reservations.length} reservation${reservations.length > 1 ? 's' : ''})`}
  // ... rest of modal
>
```

#### **Step 5.2: Drag-and-Drop Rescheduling**

**Add to App.jsx**:

```jsx
// Handle event move (drag and drop)
const moveEvent = async (scheduler, event, slotId, slotName, start, end) => {
  Modal.confirm({
    title: 'Reschedule Reservation?',
    content: `Move ${event.title} to ${new Date(start).toLocaleString()}?`,
    onOk: async () => {
      try {
        // Call Planyo API to update reservation
        await updateReservationTime(event.id, start, end, slotId);
        
        // Update local scheduler
        scheduler.moveEvent(event, slotId, slotName, start, end);
        setSchedulerData({ ...scheduler });
        
        message.success('Reservation rescheduled successfully');
      } catch (error) {
        message.error('Failed to reschedule reservation');
        // Revert changes
        refreshData();
      }
    }
  });
};

// Add to Scheduler component
<Scheduler
  // ... other props
  moveEvent={moveEvent}
  updateEventStart={updateEventStart}
  updateEventEnd={updateEventEnd}
/>
```

#### **Step 5.3: Real-time Sync**

**Option 1: Polling** (Recommended for Planyo)

```jsx
useEffect(() => {
  // Refresh data every 30 seconds
  const interval = setInterval(() => {
    refreshData();
  }, 30000);

  return () => clearInterval(interval);
}, []);
```

**Option 2: Manual Refresh Button**

```jsx
<Button icon={<ReloadOutlined />} onClick={refreshData}>
  Refresh
</Button>
```

---

### PHASE 6: Configuration & Customization

#### **Step 6.1: Scheduler Configuration**

**File to modify**: Configuration in `App.jsx` or create `/src/config/schedulerConfig.js`

```javascript
export const schedulerConfig = {
  // Layout
  schedulerWidth: '100%',
  besidesWidth: 200,
  schedulerContentHeight: '100vh',
  
  // Resource column widths
  weekResourceTableWidth: '200px',
  dayResourceTableWidth: 200,
  
  // Event display
  eventItemHeight: 30,
  eventItemLineHeight: 32,
  eventItemPopoverTrigger: 'click', // Change to click instead of hover
  eventItemPopoverWidth: 350,
  
  // Time settings
  dayStartFrom: 8, // Start at 8 AM
  dayStopTo: 20,   // End at 8 PM
  minuteStep: 30,  // 30-minute intervals
  
  // Visual
  defaultEventBgColor: '#1890ff',
  selectedAreaColor: '#7EC2F3',
  
  // Max events per cell
  dayMaxEvents: 10,
  weekMaxEvents: 99,
  monthMaxEvents: 99
};
```

#### **Step 6.2: Custom Styling**

**File to create**: `/src/styles/custom-scheduler.css`

```css
/* Custom event item styling */
.scheduler-event-item {
  border-radius: 4px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.scheduler-event-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  cursor: pointer;
}

/* Checked-in status */
.event-checked-in {
  border-left: 4px solid #52c41a;
}

/* Not checked-in status */
.event-not-checked-in {
  border-left: 4px solid #faad14;
}

/* Cancelled status */
.event-cancelled {
  opacity: 0.6;
  text-decoration: line-through;
}

/* Reservation popup hover effect */
.reservation-list-item:hover {
  background-color: #f0f5ff;
  border-radius: 8px;
}

/* Resource header styling */
.resource-header {
  font-weight: 600;
  font-size: 14px;
  color: #262626;
}

/* Time slot grid */
.scheduler-content-table td {
  border-right: 1px solid #f0f0f0;
}

/* Header styling */
.scheduler-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  border-radius: 8px 8px 0 0;
}
```

#### **Step 6.3: Responsive Design**

```css
/* Mobile responsiveness */
@media (max-width: 768px) {
  .scheduler-content {
    overflow-x: auto;
  }
  
  .resource-table {
    min-width: 150px;
  }
  
  .event-item {
    font-size: 12px;
    padding: 2px 4px;
  }
}
```

---

## FEASIBILITY ASSESSMENT

### ✅ **YES, ALL FEATURES ARE POSSIBLE**

| Feature | Status | Implementation |
|---------|--------|----------------|
| Planyo API Integration | ✅ Fully Supported | REST API calls via fetch/axios |
| Event Display on Timeline | ✅ Built-in | react-big-schedule core functionality |
| Clickable Service Boxes | ✅ Built-in | Use `eventItemClick` prop |
| Client List Popup | ✅ Custom Component | Create Modal with Ant Design |
| Individual Client Details | ✅ Custom Component | Store data in `planyoData` property |
| Check-in Management | ✅ API Integration | POST to Planyo check-in endpoint |
| Refunds/Cancellations | ✅ API Integration | POST to respective Planyo endpoints |
| Drag-and-Drop Reschedule | ✅ Built-in | Use `moveEvent`, `updateEventStart/End` |
| Status Indicators | ✅ Visual Customization | Use `bgColor` property + CSS |
| Real-time Updates | ✅ Polling/WebSocket | setInterval or WebSocket connection |

---

## CRITICAL REQUIREMENTS

### 1. **Planyo API Documentation**

Study these endpoints (refer to Planyo API docs):

- `GET /api/get_reservations` - Fetch reservations for date range
- `GET /api/get_reservation/{id}` - Get single reservation details
- `GET /api/get_services` - Fetch available services
- `POST /api/checkin` - Check in a client
- `POST /api/cancel_reservation` - Cancel a reservation
- `POST /api/modify_reservation` - Modify reservation details
- `POST /api/refund` - Process refund

**Note**: Replace example URLs with actual Planyo API endpoints and add authentication headers as required.

### 2. **Data Structure Mapping**

| Planyo Field | Scheduler Field | Purpose |
|--------------|----------------|---------|
| `service_id` | `resourceId` | Determines which row (service) the event appears on |
| `reservation_id` | `id` | Unique identifier for the event |
| `start_time` | `start` | Start date/time of reservation |
| `end_time` | `end` | End date/time of reservation |
| `client_name` | `title` | Displayed text on event box |
| Full reservation object | `planyoData` | Stores complete client info |

### 3. **Error Handling**

Wrap all API calls in try-catch blocks:

```javascript
try {
  const data = await fetchReservations(start, end);
  // Process data
} catch (error) {
  console.error('API Error:', error);
  message.error('Failed to load reservations. Please try again.');
  // Optionally: retry logic, fallback data, etc.
}
```

### 4. **Loading States**

Show spinners during data operations:

```jsx
const [loading, setLoading] = useState(false);

// In component
{loading ? <Spin size="large" /> : <Scheduler ... />}
```

### 5. **Authentication & Security**

```javascript
// Add API key/token to all requests
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${PLANYO_API_KEY}`,
  'X-API-Key': process.env.REACT_APP_PLANYO_API_KEY
};
```

### 6. **User Permissions**

Implement role-based access:

```javascript
const userRole = getUserRole(); // 'admin' | 'staff' | 'viewer'

// Conditionally render action buttons
{userRole === 'admin' && (
  <Button onClick={handleRefund}>Process Refund</Button>
)}
```

---

## IMPLEMENTATION ORDER

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| **Phase 1** | Study codebase, understand architecture | 2-3 days |
| **Phase 2** | Build Planyo API service, data mappers | 3-4 days |
| **Phase 3** | Create custom components (popups, modals) | 4-5 days |
| **Phase 4** | Connect everything, implement event handlers | 2-3 days |
| **Phase 5** | Add advanced features (drag-drop, sync) | 3-4 days |
| **Phase 6** | Polish UI/UX, add styling, testing | 2-3 days |

**Total Estimated Time**: 2-3 weeks for full implementation

---

## TESTING CHECKLIST

- [ ] Fetch reservations from Planyo API successfully
- [ ] Display reservations on correct dates/services
- [ ] Click event box → popup shows correct client list
- [ ] Click client → modal shows full details
- [ ] Check-in button updates status in Planyo
- [ ] Cancellation works and removes/updates event
- [ ] Refund processes correctly
- [ ] Drag-and-drop reschedules in Planyo
- [ ] Status colors display correctly
- [ ] Data refreshes automatically (if using polling)
- [ ] Error handling works for API failures
- [ ] Loading states display properly
- [ ] Mobile responsiveness

---

## EXAMPLE FILE STRUCTURE

```
src/
├── components/
│   ├── index.jsx              (Main Scheduler - already exists)
│   ├── SchedulerData.js        (Data model - already exists)
│   ├── EventItem.jsx           (Event box - already exists)
│   ├── ReservationPopup.jsx    (NEW - Client list popup)
│   └── ClientDetailsModal.jsx  (NEW - Client details modal)
├── services/
│   └── planyoApi.js            (NEW - Planyo API calls)
├── utils/
│   └── dataMapper.js           (NEW - Data transformation)
├── config/
│   └── schedulerConfig.js      (NEW - Scheduler settings)
├── styles/
│   └── custom-scheduler.css    (NEW - Custom styling)
├── App.jsx                     (NEW - Main application)
└── index.js                    (Entry point)
```

---

## QUICK START GUIDE

1. **Install Dependencies**
   ```bash
   npm install antd dayjs axios
   ```

2. **Create Environment Variables** (`.env`)
   ```
   REACT_APP_PLANYO_API_KEY=your_api_key_here
   REACT_APP_PLANYO_API_URL=https://api.planyo.com
   ```

3. **Start with Basic Integration**
   - Create `planyoApi.js` with `fetchReservations()`
   - Create `dataMapper.js` with mapping functions
   - Test API connection and data transformation

4. **Build UI Components**
   - Create `App.jsx` with basic scheduler
   - Add `ReservationPopup.jsx`
   - Add `ClientDetailsModal.jsx`

5. **Connect Event Handlers**
   - Implement `handleEventClick`
   - Implement `handleClientClick`
   - Add API calls for actions

6. **Test & Iterate**
   - Test each feature individually
   - Handle edge cases
   - Polish UI/UX

---

## TROUBLESHOOTING

### Issue: Events not displaying

**Solution**: Check that:
- `resourceId` matches an existing resource `id`
- Date formats are correct (`YYYY-MM-DD HH:mm:ss`)
- Events array is properly set via `setEvents()`

### Issue: Click handlers not working

**Solution**: 
- Use `eventItemPopoverTrigger: 'click'` in config
- Ensure `eventItemClick` prop is passed to Scheduler
- Check event propagation isn't being stopped

### Issue: Drag-and-drop not working

**Solution**:
- Ensure `movable: true` on events (default)
- Implement `moveEvent` handler
- Check `dragAndDropEnabled: true` in config

---

## RESOURCES

- [React Big Schedule Documentation](https://github.com/ansulagrawal/react-big-schedule)
- [Ant Design Components](https://ant.design/components/overview/)
- [Planyo API Documentation](https://www.planyo.com/api.php)
- [Day.js Documentation](https://day.js.org/)

---

## SUPPORT

For questions or issues:
1. Check existing examples in `/src/examples/`
2. Review [GitHub Issues](https://github.com/ansulagrawal/react-big-schedule/issues)
3. Consult Planyo API documentation
4. Test with sample data before connecting to live API

---

**START HERE**: Begin by exploring [/src/examples/pages/Basic/class-based.jsx](src/examples/pages/Basic/class-based.jsx) to see a working scheduler implementation, then proceed to Phase 2 to build your Planyo integration.

Good luck with your implementation! 🚀
