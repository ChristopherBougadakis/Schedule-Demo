/**
 * BookingScheduler Component
 * Boat Trip Booking System
 */

import React, { useState } from 'react';
import { Scheduler, SchedulerData, ViewType, DemoData } from '../../components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal, Button, Descriptions, Tag, Divider, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import '../../css/style.css';

// Create dummy boat resources
const createBoatResources = () => {
  return [
    {
      id: 'small-1',
      name: 'Small Boat 1 (2 hrs)',
      groupId: 'small-boats',
    },
    {
      id: 'small-2',
      name: 'Small Boat 2 (2 hrs)',
      groupId: 'small-boats',
    },
    {
      id: 'big-1',
      name: 'Big Boat 1 (10 ppl)',
      groupId: 'big-boats',
    },
    {
      id: 'big-2',
      name: 'Big Boat 2 (12 ppl)',
      groupId: 'big-boats',
    },
  ];
};

// Create dummy data for first week of January - boat trip bookings
const createDummyEvents = () => {
  return [
    {
      id: 1,
      title: 'John Smith - 2hrs',
      start: new Date(2026, 0, 1, 9, 0),
      end: new Date(2026, 0, 1, 11, 0),
      resourceId: 'small-1',
      bgColor: '#FF6B6B',
      boatType: 'small',
    },
    {
      id: 2,
      title: 'Group Outing - 8 ppl',
      start: new Date(2026, 0, 1, 10, 0),
      end: new Date(2026, 0, 1, 13, 0),
      resourceId: 'big-1',
      bgColor: '#4ECDC4',
      boatType: 'big',
      passengers: [
        { id: 'p1', name: 'Alice Johnson', checkedIn: true, phone: '+1 (555) 111-2222', email: 'alice@example.com', addOns: ['Life Jacket', 'Snacks'], specialRequest: 'Vegetarian meal', price: 45.00 },
        { id: 'p2', name: 'Bob Wilson', checkedIn: true, phone: '+1 (555) 222-3333', email: 'bob@example.com', addOns: ['Camera Rental'], specialRequest: 'None', price: 50.00 },
        { id: 'p3', name: 'Carol Davis', checkedIn: false, phone: '+1 (555) 333-4444', email: 'carol@example.com', addOns: [], specialRequest: 'Wheelchair accessible', price: 45.00 },
        { id: 'p4', name: 'David Miller', checkedIn: true, phone: '+1 (555) 444-5555', email: 'david@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 55.00 },
        { id: 'p5', name: 'Emma Taylor', checkedIn: false, phone: '+1 (555) 555-6666', email: 'emma@example.com', addOns: ['Life Jacket', 'Drinks Package'], specialRequest: 'Allergy: Shellfish', price: 70.00 },
        { id: 'p6', name: 'Frank Anderson', checkedIn: true, phone: '+1 (555) 666-7777', email: 'frank@example.com', addOns: [], specialRequest: 'None', price: 45.00 },
        { id: 'p7', name: 'Grace Lee', checkedIn: true, phone: '+1 (555) 777-8888', email: 'grace@example.com', addOns: ['Snacks', 'Photography'], specialRequest: 'Birthday celebration', price: 65.00 },
        { id: 'p8', name: 'Henry Brown', checkedIn: false, phone: '+1 (555) 888-9999', email: 'henry@example.com', addOns: ['Camera Rental'], specialRequest: 'None', price: 50.00 },
      ]
    },
    {
      id: 3,
      title: 'Maria Garcia - 2hrs',
      start: new Date(2026, 0, 1, 13, 0),
      end: new Date(2026, 0, 1, 15, 0),
      resourceId: 'small-2',
      bgColor: '#FFE66D',
      boatType: 'small',
    },
    {
      id: 4,
      title: 'Corporate Event - 10 ppl',
      start: new Date(2026, 0, 2, 9, 0),
      end: new Date(2026, 0, 2, 12, 30),
      resourceId: 'big-2',
      bgColor: '#95E1D3',
      boatType: 'big',
      passengers: [
        { id: 'p1', name: 'John Executive', checkedIn: true, phone: '+1 (555) 100-1111', email: 'john@company.com', addOns: ['Drinks Package'], specialRequest: 'VIP seating', price: 75.00 },
        { id: 'p2', name: 'Sarah Manager', checkedIn: true, phone: '+1 (555) 200-2222', email: 'sarah@company.com', addOns: [], specialRequest: 'None', price: 65.00 },
        { id: 'p3', name: 'Tom Developer', checkedIn: false, phone: '+1 (555) 300-3333', email: 'tom@company.com', addOns: ['Camera Rental'], specialRequest: 'Professional photography', price: 80.00 },
        { id: 'p4', name: 'Lisa Designer', checkedIn: true, phone: '+1 (555) 400-4444', email: 'lisa@company.com', addOns: ['Snacks'], specialRequest: 'None', price: 60.00 },
        { id: 'p5', name: 'Mike Engineer', checkedIn: true, phone: '+1 (555) 500-5555', email: 'mike@company.com', addOns: [], specialRequest: 'None', price: 65.00 },
        { id: 'p6', name: 'Jenny Analyst', checkedIn: false, phone: '+1 (555) 600-6666', email: 'jenny@company.com', addOns: ['Life Jacket', 'Drinks Package'], specialRequest: 'Gluten-free meal', price: 80.00 },
        { id: 'p7', name: 'Chris Sales', checkedIn: true, phone: '+1 (555) 700-7777', email: 'chris@company.com', addOns: ['Photography'], specialRequest: 'None', price: 70.00 },
        { id: 'p8', name: 'Rachel HR', checkedIn: true, phone: '+1 (555) 800-8888', email: 'rachel@company.com', addOns: [], specialRequest: 'None', price: 65.00 },
        { id: 'p9', name: 'Paul IT', checkedIn: false, phone: '+1 (555) 900-9999', email: 'paul@company.com', addOns: ['Drinks Package', 'Snacks'], specialRequest: 'None', price: 75.00 },
        { id: 'p10', name: 'Susan Marketing', checkedIn: true, phone: '+1 (555) 910-1010', email: 'susan@company.com', addOns: [], specialRequest: 'Early boarding', price: 65.00 },
      ]
    },
    {
      id: 5,
      title: 'Sarah Chen - 3hrs',
      start: new Date(2026, 0, 2, 14, 0),
      end: new Date(2026, 0, 2, 17, 0),
      resourceId: 'small-1',
      bgColor: '#F38181',
      boatType: 'small',
    },
    {
      id: 6,
      title: 'Family Trip - 6 ppl',
      start: new Date(2026, 0, 3, 10, 0),
      end: new Date(2026, 0, 3, 13, 0),
      resourceId: 'big-1',
      bgColor: '#AA96DA',
      boatType: 'big',
      passengers: [
        { id: 'p1', name: 'John Family', checkedIn: true, phone: '+1 (555) 001-2222', email: 'john.family@example.com', addOns: ['Life Jacket'], specialRequest: 'None', price: 60.00 },
        { id: 'p2', name: 'Mary Family', checkedIn: true, phone: '+1 (555) 001-3333', email: 'mary.family@example.com', addOns: [], specialRequest: 'None', price: 55.00 },
        { id: 'p3', name: 'Tommy Family', checkedIn: true, phone: '+1 (555) 001-4444', email: 'tommy@example.com', addOns: ['Life Jacket', 'Snacks'], specialRequest: 'Children meal', price: 50.00 },
        { id: 'p4', name: 'Lucy Family', checkedIn: false, phone: '+1 (555) 001-5555', email: 'lucy@example.com', addOns: ['Life Jacket'], specialRequest: 'None', price: 50.00 },
        { id: 'p5', name: 'Grandpa', checkedIn: true, phone: '+1 (555) 001-6666', email: 'grandpa@example.com', addOns: ['Wheelchair accessible'], specialRequest: 'Mobility assistance', price: 65.00 },
        { id: 'p6', name: 'Grandma', checkedIn: true, phone: '+1 (555) 001-7777', email: 'grandma@example.com', addOns: [], specialRequest: 'None', price: 55.00 },
      ]
    },
    {
      id: 7,
      title: 'Michael Brown - 2hrs',
      start: new Date(2026, 0, 3, 15, 0),
      end: new Date(2026, 0, 3, 17, 0),
      resourceId: 'small-2',
      bgColor: '#FCBAD3',
      boatType: 'small',
    },
    {
      id: 8,
      title: 'Wedding Party - 12 ppl',
      start: new Date(2026, 0, 5, 11, 0),
      end: new Date(2026, 0, 5, 14, 30),
      resourceId: 'big-2',
      bgColor: '#A8D8EA',
      boatType: 'big',
      passengers: [
        { id: 'p1', name: 'Bride', checkedIn: true, phone: '+1 (555) 500-1000', email: 'bride@example.com', addOns: ['Premium Drinks', 'Photography', 'Special Cake'], specialRequest: 'Wedding ceremony', price: 150.00 },
        { id: 'p2', name: 'Groom', checkedIn: true, phone: '+1 (555) 500-2000', email: 'groom@example.com', addOns: ['Premium Drinks', 'Photography'], specialRequest: 'None', price: 150.00 },
        { id: 'p3', name: 'Best Man', checkedIn: true, phone: '+1 (555) 500-3000', email: 'bestman@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 80.00 },
        { id: 'p4', name: 'Maid of Honor', checkedIn: false, phone: '+1 (555) 500-4000', email: 'maidofhonor@example.com', addOns: ['Drinks Package'], specialRequest: 'Vegetarian meal', price: 80.00 },
        { id: 'p5', name: 'Guest 1', checkedIn: true, phone: '+1 (555) 500-5000', email: 'guest1@example.com', addOns: [], specialRequest: 'None', price: 70.00 },
        { id: 'p6', name: 'Guest 2', checkedIn: true, phone: '+1 (555) 500-6000', email: 'guest2@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 80.00 },
        { id: 'p7', name: 'Guest 3', checkedIn: true, phone: '+1 (555) 500-7000', email: 'guest3@example.com', addOns: [], specialRequest: 'None', price: 70.00 },
        { id: 'p8', name: 'Guest 4', checkedIn: false, phone: '+1 (555) 500-8000', email: 'guest4@example.com', addOns: ['Life Jacket'], specialRequest: 'Non-swimmer', price: 75.00 },
        { id: 'p9', name: 'Guest 5', checkedIn: true, phone: '+1 (555) 500-9000', email: 'guest5@example.com', addOns: [], specialRequest: 'None', price: 70.00 },
        { id: 'p10', name: 'Guest 6', checkedIn: true, phone: '+1 (555) 500-1001', email: 'guest6@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 80.00 },
        { id: 'p11', name: 'Guest 7', checkedIn: false, phone: '+1 (555) 500-1002', email: 'guest7@example.com', addOns: ['Life Jacket'], specialRequest: 'Mobility support', price: 75.00 },
        { id: 'p12', name: 'Guest 8', checkedIn: true, phone: '+1 (555) 500-1003', email: 'guest8@example.com', addOns: [], specialRequest: 'None', price: 70.00 },
      ]
    },
    {
      id: 9,
      title: 'Emma Wilson - 2hrs',
      start: new Date(2026, 0, 5, 16, 0),
      end: new Date(2026, 0, 5, 18, 0),
      resourceId: 'small-1',
      bgColor: '#FF9999',
      boatType: 'small',
    },
    // Testing multiple bookings same boat same day
    {
      id: 10,
      title: 'Morning Rental - 2hrs',
      start: new Date(2026, 0, 1, 12, 0),
      end: new Date(2026, 0, 1, 14, 0),
      resourceId: 'small-1',
      bgColor: '#9B59B6',
      boatType: 'small',
    },
    {
      id: 11,
      title: 'Afternoon Rental - 2hrs',
      start: new Date(2026, 0, 1, 15, 0),
      end: new Date(2026, 0, 1, 17, 0),
      resourceId: 'small-1',
      bgColor: '#3498DB',
      boatType: 'small',
    },
    {
      id: 12,
      title: 'Evening Cruise - 2hrs',
      start: new Date(2026, 0, 1, 18, 0),
      end: new Date(2026, 0, 1, 20, 0),
      resourceId: 'small-1',
      bgColor: '#E74C3C',
      boatType: 'small',
    },
    // Multiple bookings on big boat same day
    {
      id: 13,
      title: 'Afternoon Tour - 4 ppl',
      start: new Date(2026, 0, 1, 14, 0),
      end: new Date(2026, 0, 1, 17, 0),
      resourceId: 'big-1',
      bgColor: '#F39C12',
      boatType: 'big',
      passengers: [
        { id: 'p1', name: 'Alex Brown', checkedIn: false, phone: '+1 (555) 700-1000', email: 'alex@example.com', addOns: ['Life Jacket'], specialRequest: 'None', price: 60.00 },
        { id: 'p2', name: 'Beth Green', checkedIn: false, phone: '+1 (555) 700-2000', email: 'beth@example.com', addOns: [], specialRequest: 'None', price: 55.00 },
        { id: 'p3', name: 'Charlie White', checkedIn: false, phone: '+1 (555) 700-3000', email: 'charlie@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 65.00 },
        { id: 'p4', name: 'Diana Black', checkedIn: false, phone: '+1 (555) 700-4000', email: 'diana@example.com', addOns: [], specialRequest: 'None', price: 55.00 },
      ]
    },
  ];
};


function BookingScheduler() {
  // Initialize with demo data
  const schedulerDataRef = React.useRef();
  const [, setUpdate] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [passengerModalVisible, setPassengerModalVisible] = useState(false);
  
  // Double-action confirmation states
  const [pendingAction, setPendingAction] = useState(null); // 'cancel', 'refund', 'remove'
  const [confirmTimeout, setConfirmTimeout] = useState(null);
  
  const forceUpdate = () => setUpdate(prev => prev + 1);
  
  // Clear pending action after timeout
  const clearPendingAction = () => {
    if (confirmTimeout) clearTimeout(confirmTimeout);
    setPendingAction(null);
  };
  
  // Helper function to update event status
  const updateEventStatus = (eventId, status) => {
    const events = schedulerDataRef.current.events;
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
      schedulerDataRef.current.setEvents(events);
      forceUpdate();
    }
  };

  if (!schedulerDataRef.current) {
    const dummyEvents = createDummyEvents();
    const boatResources = createBoatResources();
    const schedulerData = new SchedulerData(
      '2026-01-01',
      ViewType.Week,
      false,
      false,
      {
        views: [
          { viewName: 'Day', viewType: ViewType.Day, showAgenda: false, isEventPerspective: false },
          { viewName: 'Week', viewType: ViewType.Week, showAgenda: false, isEventPerspective: false },
          { viewName: 'Month', viewType: ViewType.Month, showAgenda: false, isEventPerspective: false },
        ],
      }
    );
    schedulerData.localeDayjs.locale('en');
    schedulerData.setResources(boatResources);
    schedulerData.setEvents(dummyEvents);
    schedulerDataRef.current = schedulerData;
  }

  // Handle event click - show booking details
  const handleEventClick = (schedulerData, event) => {
    setSelectedBooking(event);
    // If it's a big boat, show passengers list
    if (event.boatType === 'big') {
      // We'll show passengers in the modal
    }
    setModalVisible(true);
  };

  // Handle passenger click
  const handlePassengerClick = (passenger) => {
    setSelectedPassenger(passenger);
    setPassengerModalVisible(true);
    setModalVisible(false); // Close the big boat modal when opening passenger modal
  };

  // Handle check-in passenger
  const handleCheckInPassenger = () => {
    if (selectedPassenger) {
      selectedPassenger.checkedIn = true;
      message.success(`✓ ${selectedPassenger.name} has been checked in!`);
      forceUpdate();
    }
  };

  // Handle check-in
  const handleCheckIn = () => {
    message.success(`✓ ${selectedBooking.title} has been checked in!`);
  };

  // Handle cancellation - double-action
  const handleCancelClick = () => {
    if (pendingAction === 'cancel') {
      // Second click - execute cancellation
      message.success(`✓ Booking cancelled: "${selectedBooking.title}"`);
      updateEventStatus(selectedBooking.id, 'cancelled');
      clearPendingAction();
    } else {
      // First click - show pending state
      setPendingAction('cancel');
      message.warning('Click again to confirm cancellation');
      
      // Auto-clear after 3 seconds
      if (confirmTimeout) clearTimeout(confirmTimeout);
      const timeout = setTimeout(() => {
        setPendingAction(null);
        message.info('Cancellation cancelled');
      }, 3000);
      setConfirmTimeout(timeout);
    }
  };

  // Handle refund - double-action
  const handleRefund = () => {
    if (pendingAction === 'refund') {
      // Second click - execute refund
      message.success(`✓ Refund processed for ${selectedBooking.title}`);
      updateEventStatus(selectedBooking.id, 'refunded');
      clearPendingAction();
    } else {
      // First click - show pending state
      setPendingAction('refund');
      message.warning('Click again to confirm refund');
      
      // Auto-clear after 3 seconds
      if (confirmTimeout) clearTimeout(confirmTimeout);
      const timeout = setTimeout(() => {
        setPendingAction(null);
        message.info('Refund cancelled');
      }, 3000);
      setConfirmTimeout(timeout);
    }
  };

  // Handle passenger removal - double-action
  const handleRemovePassenger = () => {
    if (pendingAction === 'remove') {
      // Second click - execute removal
      message.success(`✓ ${selectedPassenger.name} removed from booking`);
      
      // Remove the passenger from the booking
      const events = schedulerDataRef.current.events;
      const eventIndex = events.findIndex(e => e.id === selectedBooking.id);
      if (eventIndex !== -1 && events[eventIndex].passengers) {
        const passengerIndex = events[eventIndex].passengers.findIndex(p => p.id === selectedPassenger.id);
        if (passengerIndex !== -1) {
          events[eventIndex].passengers.splice(passengerIndex, 1);
          // Update the event title to reflect new passenger count
          const newCount = events[eventIndex].passengers.length;
          const titlePrefix = events[eventIndex].title.split(' - ')[0];
          events[eventIndex].title = `${titlePrefix} - ${newCount} ppl`;
          schedulerDataRef.current.setEvents(events);
          forceUpdate();
        }
      }
      
      clearPendingAction();
      forceUpdate();
    } else {
      // First click - show pending state
      setPendingAction('remove');
      message.warning('Click again to confirm removal');
      
      // Auto-clear after 3 seconds
      if (confirmTimeout) clearTimeout(confirmTimeout);
      const timeout = setTimeout(() => {
        setPendingAction(null);
        message.info('Removal cancelled');
      }, 3000);
      setConfirmTimeout(timeout);
    }
  };

  // Handle individual passenger refund - double-action
  const handleRefundPassenger = () => {
    if (pendingAction === 'refund-passenger') {
      // Second click - execute refund
      message.success(`✓ ${selectedPassenger.name} refunded (${selectedPassenger.price})`);
      
      // Mark passenger as refunded by adding refunded flag and changing appearance
      selectedPassenger.refunded = true;
      forceUpdate();
      
      clearPendingAction();
      forceUpdate();
    } else {
      // First click - show pending state
      setPendingAction('refund-passenger');
      message.warning('Click again to confirm refund');
      
      // Auto-clear after 3 seconds
      if (confirmTimeout) clearTimeout(confirmTimeout);
      const timeout = setTimeout(() => {
        setPendingAction(null);
        message.info('Refund cancelled');
      }, 3000);
      setConfirmTimeout(timeout);
    }
  };

  const prevClick = (schedulerData) => {
    schedulerData.prev();
    schedulerData.setEvents(createDummyEvents());
    forceUpdate();
  };

  const nextClick = (schedulerData) => {
    schedulerData.next();
    schedulerData.setEvents(createDummyEvents());
    forceUpdate();
  };

  const onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    schedulerData.setEvents(createDummyEvents());
    forceUpdate();
  };

  const onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(createDummyEvents());
    forceUpdate();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ height: '100vh' }}>
        <Scheduler
          schedulerData={schedulerDataRef.current}
          prevClick={prevClick}
          nextClick={nextClick}
          onViewChange={onViewChange}
          onSelectDate={onSelectDate}
          eventItemClick={handleEventClick}
        />

        {/* Big Boat - Passengers List Modal */}
        {selectedBooking?.boatType === 'big' && (
          <Modal
            title={`Passengers: ${selectedBooking?.title}`}
            visible={modalVisible}
            onCancel={() => {
              clearPendingAction();
              setModalVisible(false);
            }}
            width={700}
            footer={[
              <Button key="close" onClick={() => {
                clearPendingAction();
                setModalVisible(false);
              }}>
                Close
              </Button>,
              <Button 
                key="refund" 
                type={pendingAction === 'refund' ? 'primary' : 'dashed'} 
                danger 
                onClick={handleRefund}
              >
                {pendingAction === 'refund' ? '⚠ CONFIRM Refund' : 'Process Refund'}
              </Button>,
            ]}
          >
            {selectedBooking?.passengers && (
              <div>
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                  <strong>Total Passengers: {selectedBooking.passengers.length}</strong> | 
                  <strong> Checked In: {selectedBooking.passengers.filter(p => p.checkedIn).length}</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                  {selectedBooking.passengers.map(passenger => (
                    <div
                      key={passenger.id}
                      onClick={() => handlePassengerClick(passenger)}
                      style={{
                        padding: '12px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: passenger.checkedIn ? '#f6ffed' : '#fff1f0',
                        transition: 'all 0.3s',
                        ':hover': { backgroundColor: '#e6f7ff' }
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e6f7ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = passenger.checkedIn ? '#f6ffed' : '#fff1f0')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}><UserOutlined /> {passenger.name}</div>
                          {passenger.title && <div style={{ fontSize: '12px', color: '#666' }}>{passenger.title}</div>}
                          <div style={{ fontSize: '12px', color: '#999' }}><PhoneOutlined /> {passenger.phone}</div>
                        </div>
                        <div>
                          {passenger.checkedIn ? (
                            <Tag color="green">✓ Checked In</Tag>
                          ) : (
                            <Tag color="orange">Pending</Tag>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Modal>
        )}

        {/* Small Boat - Single Booking Modal */}
        {selectedBooking?.boatType === 'small' && (
          <Modal
            title={`Booking Details: ${selectedBooking?.title}`}
            visible={modalVisible}
            onCancel={() => {
              clearPendingAction();
              setModalVisible(false);
            }}
            width={600}
            footer={[
              <Button key="close" onClick={() => {
                clearPendingAction();
                setModalVisible(false);
              }}>
                Close
              </Button>,
              <Button 
                key="refund" 
                type={pendingAction === 'refund' ? 'primary' : 'dashed'} 
                danger 
                onClick={handleRefund}
              >
                {pendingAction === 'refund' ? '⚠ CONFIRM Refund' : 'Process Refund'}
              </Button>,
              <Button 
                key="cancel" 
                type={pendingAction === 'cancel' ? 'primary' : 'default'} 
                danger 
                onClick={handleCancelClick}
              >
                {pendingAction === 'cancel' ? '⚠ CONFIRM Cancel' : 'Cancel Booking'}
              </Button>,
              <Button key="checkin" type="primary" onClick={handleCheckIn}>
                Check In
              </Button>,
            ]}
          >
            {selectedBooking && (
              <>
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Customer">
                    <UserOutlined /> {selectedBooking.title}
                  </Descriptions.Item>
                  <Descriptions.Item label="Boat">
                    {schedulerDataRef.current?.resources?.find(r => r.id === selectedBooking.resourceId)?.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date">
                    <ClockCircleOutlined /> {dayjs(selectedBooking.start).format('ddd, MMM D, YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Time">
                    {dayjs(selectedBooking.start).format('h:mm A')} - {dayjs(selectedBooking.end).format('h:mm A')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Duration">
                    {Math.round((selectedBooking.end - selectedBooking.start) / 3600000)} hours
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color="blue">Confirmed</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Price">
                    $450.00
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <div style={{ marginTop: '20px' }}>
                  <h4>Contact Information</h4>
                  <p><PhoneOutlined /> +1 (555) 123-4567</p>
                  <p><MailOutlined /> customer@example.com</p>
                </div>

                <Divider />

                <div style={{ marginTop: '20px' }}>
                  <h4>Quick Actions</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleCheckIn}>
                      Check In Now
                    </Button>
                    <Button onClick={() => message.info('Sending reminder email...')}>
                      Send Reminder
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Modal>
        )}

        {/* Passenger Details Modal */}
        <Modal
          title={`Passenger: ${selectedPassenger?.name}`}
          visible={passengerModalVisible}
          onCancel={() => {
            clearPendingAction();
            setPassengerModalVisible(false);
          }}
          width={550}
          footer={[
            <Button key="close" onClick={() => {
              clearPendingAction();
              setPassengerModalVisible(false);
            }}>
              Close
            </Button>,
            selectedPassenger && !selectedPassenger.checkedIn && (
              <Button key="checkin" type="primary" onClick={handleCheckInPassenger}>
                Check In
              </Button>
            ),
            <Button 
              key="refund" 
              type={pendingAction === 'refund-passenger' ? 'primary' : 'dashed'} 
              danger 
              onClick={handleRefundPassenger}
            >
              {pendingAction === 'refund-passenger' ? '⚠ CONFIRM Refund' : 'Refund Passenger'}
            </Button>,
            <Button 
              key="remove" 
              type={pendingAction === 'remove' ? 'primary' : 'default'} 
              danger 
              onClick={handleRemovePassenger}
            >
              {pendingAction === 'remove' ? '⚠ CONFIRM Remove' : 'Remove Passenger'}
            </Button>,
          ]}
        >
          {selectedPassenger && (
            <>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Name">
                  <UserOutlined /> {selectedPassenger.name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <MailOutlined /> {selectedPassenger.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  <PhoneOutlined /> {selectedPassenger.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Check-In Status">
                  {selectedPassenger.checkedIn ? (
                    <Tag color="green">✓ Checked In</Tag>
                  ) : (
                    <Tag color="orange">Not Checked In</Tag>
                  )}
                </Descriptions.Item>
                {selectedPassenger.refunded && (
                  <Descriptions.Item label="Refund Status">
                    <Tag color="red">✓ Refunded</Tag>
                  </Descriptions.Item>
                )}
              </Descriptions>

              <Divider />

              <div style={{ marginTop: '16px' }}>
                <h4>Add-ons Booked</h4>
                {selectedPassenger.addOns && selectedPassenger.addOns.length > 0 ? (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedPassenger.addOns.map((addon, idx) => (
                      <Tag key={idx} color="blue">{addon}</Tag>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#999' }}>No add-ons</p>
                )}
              </div>

              <Divider />

              <div style={{ marginTop: '16px' }}>
                <h4>Special Requests</h4>
                <p>{selectedPassenger.specialRequest}</p>
              </div>

              <Divider />

              <div style={{ marginTop: '16px' }}>
                <h4>Price Paid</h4>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>${selectedPassenger.price.toFixed(2)}</p>
              </div>

              <Divider />

              <div style={{ marginTop: '20px' }}>
                <h4>Quick Actions</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Button onClick={() => message.info('Sending reminder email...')}>
                    Send Reminder
                  </Button>
                </div>
              </div>
            </>
          )}
        </Modal>

      </div>
    </DndProvider>
  );
}

export default BookingScheduler;
