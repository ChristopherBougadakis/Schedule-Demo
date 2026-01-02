/**
 * BookingScheduler Component
 * Boat Trip Booking System
 */

import React, { useState } from 'react';
import { Scheduler, SchedulerData, ViewType, DemoData } from '../../components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal, Button, Descriptions, Tag, Divider, message, InputNumber, DatePicker, TimePicker, Form } from 'antd';
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
      checkedIn: false,
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
        { id: 'p1', name: 'Alice Johnson', checkedIn: true, phone: '+1 (555) 111-2222', email: 'alice@example.com', addOns: ['Life Jacket', 'Snacks'], specialRequest: 'Vegetarian meal', price: 45.00, numPeople: 1 },
        { id: 'p2', name: 'Bob Wilson', checkedIn: true, phone: '+1 (555) 222-3333', email: 'bob@example.com', addOns: ['Camera Rental'], specialRequest: 'None', price: 50.00, numPeople: 2 },
        { id: 'p3', name: 'Carol Davis', checkedIn: false, phone: '+1 (555) 333-4444', email: 'carol@example.com', addOns: [], specialRequest: 'Wheelchair accessible', price: 45.00, numPeople: 1 },
        { id: 'p4', name: 'David Miller', checkedIn: true, phone: '+1 (555) 444-5555', email: 'david@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 55.00, numPeople: 1 },
        { id: 'p5', name: 'Emma Taylor', checkedIn: false, phone: '+1 (555) 555-6666', email: 'emma@example.com', addOns: ['Life Jacket', 'Drinks Package'], specialRequest: 'Allergy: Shellfish', price: 70.00, numPeople: 1 },
        { id: 'p6', name: 'Frank Anderson', checkedIn: true, phone: '+1 (555) 666-7777', email: 'frank@example.com', addOns: [], specialRequest: 'None', price: 45.00, numPeople: 1 },
        { id: 'p7', name: 'Grace Lee', checkedIn: true, phone: '+1 (555) 777-8888', email: 'grace@example.com', addOns: ['Snacks', 'Photography'], specialRequest: 'Birthday celebration', price: 65.00, numPeople: 3 },
        { id: 'p8', name: 'Henry Brown', checkedIn: false, phone: '+1 (555) 888-9999', email: 'henry@example.com', addOns: ['Camera Rental'], specialRequest: 'None', price: 50.00, numPeople: 1 },
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
      checkedIn: false,
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
        { id: 'p1', name: 'John Executive', checkedIn: true, phone: '+1 (555) 100-1111', email: 'john@company.com', addOns: ['Drinks Package'], specialRequest: 'VIP seating', price: 75.00, numPeople: 1 },
        { id: 'p2', name: 'Sarah Manager', checkedIn: true, phone: '+1 (555) 200-2222', email: 'sarah@company.com', addOns: [], specialRequest: 'None', price: 65.00, numPeople: 1 },
        { id: 'p3', name: 'Tom Developer', checkedIn: false, phone: '+1 (555) 300-3333', email: 'tom@company.com', addOns: ['Camera Rental'], specialRequest: 'Professional photography', price: 80.00, numPeople: 1 },
        { id: 'p4', name: 'Lisa Designer', checkedIn: true, phone: '+1 (555) 400-4444', email: 'lisa@company.com', addOns: ['Snacks'], specialRequest: 'None', price: 60.00, numPeople: 1 },
        { id: 'p5', name: 'Mike Engineer', checkedIn: true, phone: '+1 (555) 500-5555', email: 'mike@company.com', addOns: [], specialRequest: 'None', price: 65.00, numPeople: 2 },
        { id: 'p6', name: 'Jenny Analyst', checkedIn: false, phone: '+1 (555) 600-6666', email: 'jenny@company.com', addOns: ['Life Jacket', 'Drinks Package'], specialRequest: 'Gluten-free meal', price: 80.00, numPeople: 1 },
        { id: 'p7', name: 'Chris Sales', checkedIn: true, phone: '+1 (555) 700-7777', email: 'chris@company.com', addOns: ['Photography'], specialRequest: 'None', price: 70.00, numPeople: 1 },
        { id: 'p8', name: 'Rachel HR', checkedIn: true, phone: '+1 (555) 800-8888', email: 'rachel@company.com', addOns: [], specialRequest: 'None', price: 65.00, numPeople: 1 },
        { id: 'p9', name: 'Paul IT', checkedIn: false, phone: '+1 (555) 900-9999', email: 'paul@company.com', addOns: ['Drinks Package', 'Snacks'], specialRequest: 'None', price: 75.00, numPeople: 1 },
        { id: 'p10', name: 'Susan Marketing', checkedIn: true, phone: '+1 (555) 910-1010', email: 'susan@company.com', addOns: [], specialRequest: 'Early boarding', price: 65.00, numPeople: 1 },
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
      checkedIn: false,
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
        { id: 'p1', name: 'John Family', checkedIn: true, phone: '+1 (555) 001-2222', email: 'john.family@example.com', addOns: ['Life Jacket'], specialRequest: 'None', price: 60.00, numPeople: 1 },
        { id: 'p2', name: 'Mary Family', checkedIn: true, phone: '+1 (555) 001-3333', email: 'mary.family@example.com', addOns: [], specialRequest: 'None', price: 55.00, numPeople: 1 },
        { id: 'p3', name: 'Tommy Family', checkedIn: true, phone: '+1 (555) 001-4444', email: 'tommy@example.com', addOns: ['Life Jacket', 'Snacks'], specialRequest: 'Children meal', price: 50.00, numPeople: 1 },
        { id: 'p4', name: 'Lucy Family', checkedIn: false, phone: '+1 (555) 001-5555', email: 'lucy@example.com', addOns: ['Life Jacket'], specialRequest: 'None', price: 50.00, numPeople: 1 },
        { id: 'p5', name: 'Grandpa', checkedIn: true, phone: '+1 (555) 001-6666', email: 'grandpa@example.com', addOns: ['Wheelchair accessible'], specialRequest: 'Mobility assistance', price: 65.00, numPeople: 1 },
        { id: 'p6', name: 'Grandma', checkedIn: true, phone: '+1 (555) 001-7777', email: 'grandma@example.com', addOns: [], specialRequest: 'None', price: 55.00, numPeople: 1 },
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
      checkedIn: false,
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
        { id: 'p1', name: 'Bride', checkedIn: true, phone: '+1 (555) 500-1000', email: 'bride@example.com', addOns: ['Premium Drinks', 'Photography', 'Special Cake'], specialRequest: 'Wedding ceremony', price: 150.00, numPeople: 1 },
        { id: 'p2', name: 'Groom', checkedIn: true, phone: '+1 (555) 500-2000', email: 'groom@example.com', addOns: ['Premium Drinks', 'Photography'], specialRequest: 'None', price: 150.00, numPeople: 1 },
        { id: 'p3', name: 'Best Man', checkedIn: true, phone: '+1 (555) 500-3000', email: 'bestman@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 80.00, numPeople: 1 },
        { id: 'p4', name: 'Maid of Honor', checkedIn: false, phone: '+1 (555) 500-4000', email: 'maidofhonor@example.com', addOns: ['Drinks Package'], specialRequest: 'Vegetarian meal', price: 80.00, numPeople: 1 },
        { id: 'p5', name: 'Guest 1', checkedIn: true, phone: '+1 (555) 500-5000', email: 'guest1@example.com', addOns: [], specialRequest: 'None', price: 70.00, numPeople: 1 },
        { id: 'p6', name: 'Guest 2', checkedIn: true, phone: '+1 (555) 500-6000', email: 'guest2@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 80.00, numPeople: 1 },
        { id: 'p7', name: 'Guest 3', checkedIn: true, phone: '+1 (555) 500-7000', email: 'guest3@example.com', addOns: [], specialRequest: 'None', price: 70.00, numPeople: 1 },
        { id: 'p8', name: 'Guest 4', checkedIn: false, phone: '+1 (555) 500-8000', email: 'guest4@example.com', addOns: ['Life Jacket'], specialRequest: 'Non-swimmer', price: 75.00, numPeople: 2 },
        { id: 'p9', name: 'Guest 5', checkedIn: true, phone: '+1 (555) 500-9000', email: 'guest5@example.com', addOns: [], specialRequest: 'None', price: 70.00, numPeople: 1 },
        { id: 'p10', name: 'Guest 6', checkedIn: true, phone: '+1 (555) 500-1001', email: 'guest6@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 80.00, numPeople: 1 },
        { id: 'p11', name: 'Guest 7', checkedIn: false, phone: '+1 (555) 500-1002', email: 'guest7@example.com', addOns: ['Life Jacket'], specialRequest: 'Mobility support', price: 75.00, numPeople: 1 },
        { id: 'p12', name: 'Guest 8', checkedIn: true, phone: '+1 (555) 500-1003', email: 'guest8@example.com', addOns: [], specialRequest: 'None', price: 70.00, numPeople: 1 },
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
      checkedIn: false,
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
      checkedIn: false,
    },
    {
      id: 11,
      title: 'Afternoon Rental - 2hrs',
      start: new Date(2026, 0, 1, 15, 0),
      end: new Date(2026, 0, 1, 17, 0),
      resourceId: 'small-1',
      bgColor: '#3498DB',
      boatType: 'small',
      checkedIn: false,
    },
    {
      id: 12,
      title: 'Evening Cruise - 2hrs',
      start: new Date(2026, 0, 1, 18, 0),
      end: new Date(2026, 0, 1, 20, 0),
      resourceId: 'small-1',
      bgColor: '#E74C3C',
      boatType: 'small',
      checkedIn: false,
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
        { id: 'p1', name: 'Alex Brown', checkedIn: false, phone: '+1 (555) 700-1000', email: 'alex@example.com', addOns: ['Life Jacket'], specialRequest: 'None', price: 60.00, numPeople: 1 },
        { id: 'p2', name: 'Beth Green', checkedIn: false, phone: '+1 (555) 700-2000', email: 'beth@example.com', addOns: [], specialRequest: 'None', price: 55.00, numPeople: 1 },
        { id: 'p3', name: 'Charlie White', checkedIn: false, phone: '+1 (555) 700-3000', email: 'charlie@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 65.00, numPeople: 1 },
        { id: 'p4', name: 'Diana Black', checkedIn: false, phone: '+1 (555) 700-4000', email: 'diana@example.com', addOns: [], specialRequest: 'None', price: 55.00, numPeople: 1 },
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
  
  // Refund percentage states
  const [refundPercentage, setRefundPercentage] = useState(100); // Default 100%
  const [passengerRefundPercentage, setPassengerRefundPercentage] = useState(100); // Default 100%
  
  // Track unsaved changes
  const [passengerNumPeopleCopy, setPassengerNumPeopleCopy] = useState(null);
  const [hasUnsavedPassengerChanges, setHasUnsavedPassengerChanges] = useState(false);
  
  // Move reservation states
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [moveNewDate, setMoveNewDate] = useState(null);
  const [moveStartTime, setMoveStartTime] = useState(null);
  const [moveEndTime, setMoveEndTime] = useState(null);
  const [moveMode, setMoveMode] = useState('new'); // 'new' or 'existing'
  const [moveToEventId, setMoveToEventId] = useState(null);
  
  // Move small boat reservation states
  const [moveSmallBoatModalVisible, setMoveSmallBoatModalVisible] = useState(false);
  const [moveSmallBoatDate, setMoveSmallBoatDate] = useState(null);
  const [moveSmallBoatStartTime, setMoveSmallBoatStartTime] = useState(null);
  const [moveSmallBoatEndTime, setMoveSmallBoatEndTime] = useState(null);
  
  // DatePicker open states to keep pickers open during interaction
  const [movePassengerDateOpen, setMovePassengerDateOpen] = useState(false);
  const [moveSmallBoatDateOpen, setMoveSmallBoatDateOpen] = useState(false);
  
  const forceUpdate = () => setUpdate(prev => prev + 1);
  
  // Helper function to update event title based on total people
  const updateEventTitle = (eventId, passengers) => {
    const events = schedulerDataRef.current.events;
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      const totalPeople = passengers.reduce((sum, p) => sum + (p.numPeople || 1), 0);
      const titlePrefix = events[eventIndex].title.split(' - ')[0];
      events[eventIndex].title = `${titlePrefix} - ${totalPeople} ppl`;
      schedulerDataRef.current.setEvents(events);
    }
  };

  // Helper function to check for time overlaps
  const hasTimeOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && end1 > start2;
  };

  // Helper function to check if new time overlaps with existing reservations on same boat
  const checkBoatTimeOverlap = (date, startTime, endTime, resourceId, excludeEventId = null) => {
    const events = schedulerDataRef.current.events;
    const newStart = new Date(date.toDate());
    newStart.setHours(startTime.hour(), startTime.minute());
    
    const newEnd = new Date(date.toDate());
    newEnd.setHours(endTime.hour(), endTime.minute());

    return events.some(e => {
      if (e.resourceId !== resourceId) return false; // Different boat
      if (excludeEventId && e.id === excludeEventId) return false; // Exclude original booking
      return hasTimeOverlap(newStart, newEnd, e.start, e.end);
    });
  };
  
  // Clear pending action after timeout
  const clearPendingAction = () => {
    if (confirmTimeout) clearTimeout(confirmTimeout);
    setPendingAction(null);
  };
  
  // Handle move reservation for individual passenger
  const handleMoveReservation = () => {
    if (!selectedPassenger || !selectedBooking) {
      message.error('No passenger or booking selected');
      return;
    }

    const events = schedulerDataRef.current.events;
    const originalEventIndex = events.findIndex(e => e.id === selectedBooking.id);

    if (moveMode === 'existing') {
      // Add to existing reservation
      if (!moveToEventId) {
        message.error('Please select a reservation to move to');
        return;
      }

      const targetEventIndex = events.findIndex(e => e.id === moveToEventId);
      if (targetEventIndex === -1) {
        message.error('Target reservation not found');
        return;
      }

      // Add passenger to target event
      if (!events[targetEventIndex].passengers) {
        events[targetEventIndex].passengers = [];
      }
      events[targetEventIndex].passengers.push({ ...selectedPassenger });

      // Update target event title
      const targetTotalPeople = events[targetEventIndex].passengers.reduce((sum, p) => sum + (p.numPeople || 1), 0);
      const targetTitlePrefix = events[targetEventIndex].title.split(' - ')[0];
      events[targetEventIndex].title = `${targetTitlePrefix} - ${targetTotalPeople} ppl`;

      message.success(`✓ ${selectedPassenger.name} added to existing reservation`);
    } else {
      // Create new reservation
      if (!moveNewDate || !moveStartTime || !moveEndTime) {
        message.error('Please select date and times for new reservation');
        return;
      }

      const newStartDate = moveNewDate.toDate();
      newStartDate.setHours(moveStartTime.hour(), moveStartTime.minute());
      
      const newEndDate = moveNewDate.toDate();
      newEndDate.setHours(moveEndTime.hour(), moveEndTime.minute());

      const newEventId = Math.max(...events.map(e => e.id), 0) + 1;
      
      const passengerName = selectedPassenger.name.split(' ')[0];
      const numPeople = selectedPassenger.numPeople || 1;
      const newTitle = `${passengerName} - ${numPeople} ppl`;

      const newEvent = {
        id: newEventId,
        title: newTitle,
        start: newStartDate,
        end: newEndDate,
        resourceId: selectedBooking.resourceId,
        bgColor: selectedBooking.bgColor,
        boatType: selectedBooking.boatType,
        checkedIn: selectedPassenger.checkedIn,
        passengers: [{ ...selectedPassenger }],
      };

      events.push(newEvent);
      message.success(`✓ ${selectedPassenger.name} moved to ${moveNewDate.format('MMM D, YYYY')} from ${moveStartTime.format('h:mm A')} to ${moveEndTime.format('h:mm A')}`);
    }

    // Remove passenger from original booking
    if (originalEventIndex !== -1 && events[originalEventIndex].passengers) {
      events[originalEventIndex].passengers = events[originalEventIndex].passengers.filter(p => p.id !== selectedPassenger.id);
      
      // Update original event title
      if (events[originalEventIndex].passengers.length > 0) {
        const totalPeople = events[originalEventIndex].passengers.reduce((sum, p) => sum + (p.numPeople || 1), 0);
        const titlePrefix = events[originalEventIndex].title.split(' - ')[0];
        events[originalEventIndex].title = `${titlePrefix} - ${totalPeople} ppl`;
      } else {
        // If no passengers left, remove the event
        events.splice(originalEventIndex, 1);
      }
    }

    schedulerDataRef.current.setEvents(events);
    
    // Navigate to the new date if created a new reservation
    if (moveMode === 'new' && moveNewDate) {
      schedulerDataRef.current.setDate(moveNewDate.format('YYYY-MM-DD'));
      schedulerDataRef.current.setEvents(events);
    }
    
    forceUpdate();
    
    setMoveModalVisible(false);
    setPassengerModalVisible(false);
    setModalVisible(false);
    setMoveNewDate(null);
    setMoveStartTime(null);
    setMoveEndTime(null);
    setMoveToEventId(null);
    setMoveMode('new');
  };

  // Handle moving small boat reservations
  const handleMoveSmallBoat = () => {
    if (!selectedBooking) {
      message.error('No booking selected');
      return;
    }

    if (!moveSmallBoatDate || !moveSmallBoatStartTime || !moveSmallBoatEndTime) {
      message.error('Please select date and times');
      return;
    }

    const events = schedulerDataRef.current.events;
    const originalEventIndex = events.findIndex(e => e.id === selectedBooking.id);

    // Check for overlaps
    if (checkBoatTimeOverlap(moveSmallBoatDate, moveSmallBoatStartTime, moveSmallBoatEndTime, selectedBooking.resourceId, selectedBooking.id)) {
      message.error('⚠️ Time slot conflicts with another reservation on this boat');
      return;
    }

    // Update booking with new times
    const newStartDate = moveSmallBoatDate.toDate();
    newStartDate.setHours(moveSmallBoatStartTime.hour(), moveSmallBoatStartTime.minute());
    
    const newEndDate = moveSmallBoatDate.toDate();
    newEndDate.setHours(moveSmallBoatEndTime.hour(), moveSmallBoatEndTime.minute());

    events[originalEventIndex].start = newStartDate;
    events[originalEventIndex].end = newEndDate;

    message.success(`✓ Reservation moved to ${moveSmallBoatDate.format('MMM D, YYYY')} from ${moveSmallBoatStartTime.format('h:mm A')} to ${moveSmallBoatEndTime.format('h:mm A')}`);

    schedulerDataRef.current.setEvents(events);
    
    // Navigate to the new date
    schedulerDataRef.current.setDate(moveSmallBoatDate.format('YYYY-MM-DD'));
    schedulerDataRef.current.setEvents(events);
    
    forceUpdate();
    
    setMoveSmallBoatModalVisible(false);
    setModalVisible(false);
    setMoveSmallBoatDate(null);
    setMoveSmallBoatStartTime(null);
    setMoveSmallBoatEndTime(null);
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
    
    // Set default view to Day on mobile, Week on desktop
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const defaultViewType = isMobile ? ViewType.Day : ViewType.Week;
    
    const schedulerData = new SchedulerData(
      '2026-01-01',
      defaultViewType,
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
    setPassengerNumPeopleCopy(passenger.numPeople || 1); // Save original value
    setHasUnsavedPassengerChanges(false);
    setPassengerModalVisible(true);
    setModalVisible(false); // Close the big boat modal when opening passenger modal
  };

  // Handle check-in passenger (toggle)
  const handleCheckInPassenger = () => {
    if (selectedPassenger) {
      if (selectedPassenger.refunded) {
        message.error('Cannot check in a refunded passenger');
        return;
      }
      selectedPassenger.checkedIn = !selectedPassenger.checkedIn;
      if (selectedPassenger.checkedIn) {
        message.success(`✓ ${selectedPassenger.name} has been checked in!`);
      } else {
        message.info(`${selectedPassenger.name} check-in has been undone`);
      }
      forceUpdate();
    }
  };

  // Handle check-in (toggle)
  const handleCheckIn = () => {
    if (selectedBooking) {
      if (selectedBooking.refunded) {
        message.error('Cannot check in a refunded booking');
        return;
      }
      selectedBooking.checkedIn = !selectedBooking.checkedIn;
      if (selectedBooking.checkedIn) {
        message.success(`✓ ${selectedBooking.title} has been checked in!`);
      } else {
        message.info(`${selectedBooking.title} check-in has been undone`);
      }
      forceUpdate();
    }
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

  // Handle cancel refund for bookings
  // Handle refund - double-action
  const handleRefund = () => {
    if (pendingAction === 'refund') {
      // Second click - execute refund
      const totalPrice = selectedBooking.boatType === 'small' ? 450.00 : selectedBooking.passengers.reduce((sum, p) => sum + (p.price * (p.numPeople || 1)), 0);
      const refundAmount = (totalPrice * refundPercentage / 100).toFixed(2);
      
      // Store refund data
      const events = schedulerDataRef.current.events;
      const eventIndex = events.findIndex(e => e.id === selectedBooking.id);
      if (eventIndex !== -1) {
        events[eventIndex].refunded = true;
        events[eventIndex].refundAmount = refundAmount;
        events[eventIndex].refundPercentage = refundPercentage;
      }
      
      message.success(`✓ Refund processed for ${selectedBooking.title}: $${refundAmount} (${refundPercentage}% of $${totalPrice.toFixed(2)})`);
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
      const refundAmount = (selectedPassenger.price * passengerRefundPercentage / 100).toFixed(2);
      message.success(`✓ ${selectedPassenger.name} refunded $${refundAmount} (${passengerRefundPercentage}% of $${selectedPassenger.price.toFixed(2)})`);
      
      // Mark passenger as refunded and store refund data
      selectedPassenger.refunded = true;
      selectedPassenger.refundAmount = refundAmount;
      selectedPassenger.refundPercentage = passengerRefundPercentage;
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
    const existingEvents = schedulerDataRef.current?.events || [];
    schedulerData.prev();
    schedulerData.setEvents(existingEvents);
    forceUpdate();
  };

  const nextClick = (schedulerData) => {
    const existingEvents = schedulerDataRef.current?.events || [];
    schedulerData.next();
    schedulerData.setEvents(existingEvents);
    forceUpdate();
  };

  const onViewChange = (schedulerData, view) => {
    const existingEvents = schedulerDataRef.current?.events || [];
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    schedulerData.setEvents(existingEvents);
    forceUpdate();
  };

  const onSelectDate = (schedulerData, date) => {
    const existingEvents = schedulerDataRef.current?.events || [];
    schedulerData.setDate(date);
    schedulerData.setEvents(existingEvents);
    forceUpdate();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
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
            width={typeof window !== 'undefined' && window.innerWidth <= 768 ? '95%' : 900}
            wrapClassName="mobile-modal"
            footer={[
              <Button key="close" onClick={() => {
                clearPendingAction();
                setModalVisible(false);
              }}>
                Close
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
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold' }}><UserOutlined /> {passenger.name} <Tag color="blue" style={{ marginLeft: '6px' }}>×{passenger.numPeople || 1}</Tag></div>
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
            width={typeof window !== 'undefined' && window.innerWidth <= 768 ? '95%' : 800}
            wrapClassName="mobile-modal"
            footer={
              selectedBooking?.refunded ? [
                <Button key="close" onClick={() => {
                  clearPendingAction();
                  setModalVisible(false);
                }}>
                  Close
                </Button>,
              ] : [
                <Button key="close" onClick={() => {
                  clearPendingAction();
                  setModalVisible(false);
                }}>
                  Close
                </Button>,
                <Button 
                  key="move"
                  type="default"
                  onClick={() => setMoveSmallBoatModalVisible(true)}
                >
                  Move Reservation
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
                  {selectedBooking?.checkedIn ? 'Undo Check-In' : 'Check In'}
                </Button>,
              ]
            }
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
                    {selectedBooking.refunded ? (
                      <Tag color="red">Refunded: ${selectedBooking.refundAmount} ({selectedBooking.refundPercentage}%)</Tag>
                    ) : (
                      <Tag color="blue">Confirmed</Tag>
                    )}
                  </Descriptions.Item>
                  {!selectedBooking.refunded && (
                    <Descriptions.Item label="Check-In Status">
                      {selectedBooking.checkedIn ? (
                        <Tag color="green">✓ Checked In</Tag>
                      ) : (
                        <Tag color="orange">Not Checked In</Tag>
                      )}
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Price">
                    $450.00
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <div style={{ marginTop: '20px' }}>
                  <h4>Refund Calculator</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <span>Percentage:</span>
                    <InputNumber
                      min={0}
                      max={100}
                      value={refundPercentage}
                      onChange={(value) => setRefundPercentage(value || 0)}
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                      style={{ width: '100px' }}
                    />
                    <span>or Amount:</span>
                    <InputNumber
                      min={0}
                      max={450.00}
                      value={parseFloat((450.00 * refundPercentage / 100).toFixed(2))}
                      onChange={(value) => {
                        const newPercentage = (value / 450.00) * 100;
                        setRefundPercentage(parseFloat(newPercentage.toFixed(2)));
                      }}
                      formatter={value => `$${value}`}
                      parser={value => value.replace('$', '')}
                      style={{ width: '120px' }}
                      step={0.01}
                      precision={2}
                    />
                  </div>
                </div>

                <Divider />

                <div style={{ marginTop: '20px' }}>
                  <h4>Contact Information</h4>
                  <p><PhoneOutlined /> +1 (555) 123-4567</p>
                  <p><MailOutlined /> customer@example.com</p>
                </div>

                <Divider />
              </>
            )}
          </Modal>
        )}

        {/* Passenger Details Modal */}
        <Modal
          title={`Passenger: ${selectedPassenger?.name} ×${selectedPassenger?.numPeople || 1}`}
          visible={passengerModalVisible}
          width={typeof window !== 'undefined' && window.innerWidth <= 768 ? '95%' : 700}
          wrapClassName="mobile-modal"
          onCancel={() => {
            clearPendingAction();
            setPassengerModalVisible(false);
          }}
          footer={
            selectedPassenger?.refunded ? [
              <Button key="close" onClick={() => {
                clearPendingAction();
                setPassengerModalVisible(false);
                setHasUnsavedPassengerChanges(false);
              }}>
                Close
              </Button>,
            ] : [
              <Button key="close" onClick={() => {
                clearPendingAction();
                setPassengerModalVisible(false);
                setHasUnsavedPassengerChanges(false);
              }}>
                Close
              </Button>,
            hasUnsavedPassengerChanges && (
              <Button 
                key="cancel"
                onClick={() => {
                  selectedPassenger.numPeople = passengerNumPeopleCopy;
                  setHasUnsavedPassengerChanges(false);
                  forceUpdate();
                  message.info('Changes discarded');
                }}
              >
                Cancel
              </Button>
            ),
            hasUnsavedPassengerChanges && (
              <Button 
                key="save"
                type="primary"
                onClick={() => {
                  updateEventTitle(selectedBooking.id, selectedBooking.passengers);
                  setHasUnsavedPassengerChanges(false);
                  forceUpdate();
                  message.success('Changes saved successfully!');
                }}
              >
                Save Changes
              </Button>
            ),
            <Button 
              key="move"
              type="dashed"
              onClick={() => {
                setMoveNewDate(dayjs(selectedPassenger.reservationDate || selectedBooking.start));
                setMoveStartTime(dayjs(selectedPassenger.reservationDate || selectedBooking.start));
                setMoveEndTime(dayjs(selectedPassenger.reservationDate || selectedBooking.end));
                setMoveModalVisible(true);
              }}
            >
              Move Passenger
            </Button>,
            selectedPassenger && (
              <Button key="checkin" type="primary" onClick={handleCheckInPassenger}>
                {selectedPassenger.checkedIn ? 'Undo Check-In' : 'Check In'}
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
            ]
          }
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
                {selectedPassenger.refunded ? (
                  <Descriptions.Item label="Status">
                    <Tag color="red">Refunded: ${selectedPassenger.refundAmount} ({selectedPassenger.refundPercentage}%)</Tag>
                  </Descriptions.Item>
                ) : (
                  <Descriptions.Item label="Check-In Status">
                    {selectedPassenger.checkedIn ? (
                      <Tag color="green">✓ Checked In</Tag>
                    ) : (
                      <Tag color="orange">Not Checked In</Tag>
                    )}
                  </Descriptions.Item>
                )}
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

              <div style={{ marginTop: '16px' }}>
                <h4>Refund Calculator</h4>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Price per person: ${selectedPassenger.price.toFixed(2)} × {selectedPassenger.numPeople || 1} people = ${(selectedPassenger.price * (selectedPassenger.numPeople || 1)).toFixed(2)}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span>Percentage:</span>
                  <InputNumber
                    min={0}
                    max={100}
                    value={passengerRefundPercentage}
                    onChange={(value) => setPassengerRefundPercentage(value || 0)}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    style={{ width: '100px' }}
                  />
                  <span>or Amount:</span>
                  <InputNumber
                    min={0}
                    max={selectedPassenger.price * (selectedPassenger.numPeople || 1)}
                    value={parseFloat((selectedPassenger.price * (selectedPassenger.numPeople || 1) * passengerRefundPercentage / 100).toFixed(2))}
                    onChange={(value) => {
                      const totalPrice = selectedPassenger.price * (selectedPassenger.numPeople || 1);
                      const newPercentage = (value / totalPrice) * 100;
                      setPassengerRefundPercentage(parseFloat(newPercentage.toFixed(2)));
                    }}
                    formatter={value => `$${value}`}
                    parser={value => value.replace('$', '')}
                    style={{ width: '120px' }}
                    step={0.01}
                    precision={2}
                  />
                </div>
              </div>

              <Divider />

              <div style={{ marginTop: '16px' }}>
                <h4>Group Size</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                  <span>Number of People:</span>
                  <InputNumber
                    min={1}
                    max={20}
                    value={selectedPassenger.numPeople || 1}
                    onChange={(value) => {
                      selectedPassenger.numPeople = value || 1;
                      setHasUnsavedPassengerChanges((value || 1) !== passengerNumPeopleCopy);
                      forceUpdate();
                    }}
                    style={{ width: '80px' }}
                  />
                  {(selectedPassenger.numPeople || 1) > 1 && (
                    <Button 
                      danger 
                      onClick={() => {
                        if ((selectedPassenger.numPeople || 1) > 1) {
                          selectedPassenger.numPeople = (selectedPassenger.numPeople || 1) - 1;
                          setHasUnsavedPassengerChanges(selectedPassenger.numPeople !== passengerNumPeopleCopy);
                          forceUpdate();
                        }
                      }}
                    >
                      - Remove One Person
                    </Button>
                  )}
                  <Button 
                    type="primary"
                    onClick={() => {
                      selectedPassenger.numPeople = (selectedPassenger.numPeople || 1) + 1;
                      setHasUnsavedPassengerChanges(selectedPassenger.numPeople !== passengerNumPeopleCopy);
                      forceUpdate();
                    }}
                  >
                    + Add One Person
                  </Button>
                </div>
              </div>

              {selectedPassenger.refunded && selectedPassenger.refundAmount && (
                <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
                  <Tag color="red">✓ Refunded</Tag>
                  <span> ${selectedPassenger.refundAmount} ({selectedPassenger.refundPercentage}%)</span>
                </div>
              )}

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

        {/* Move Passenger Modal */}
        <Modal
          title={`Move Passenger: ${selectedPassenger?.name}`}
          visible={moveModalVisible}
          width={typeof window !== 'undefined' && window.innerWidth <= 768 ? '95%' : 500}
          wrapClassName="mobile-modal"
          onCancel={() => {
            setMoveModalVisible(false);
            setMoveNewDate(null);
            setMoveStartTime(null);
            setMoveEndTime(null);
            setMoveToEventId(null);
            setMoveMode('new');
          }}
          footer={[
            <Button key="cancel" onClick={() => {
              setMoveModalVisible(false);
              setMoveNewDate(null);
              setMoveStartTime(null);
              setMoveEndTime(null);
              setMoveToEventId(null);
              setMoveMode('new');
            }}>
              Cancel
            </Button>,
            <Button 
              key="move" 
              type="primary" 
              onClick={handleMoveReservation}
              disabled={
                moveMode === 'new' 
                  ? !moveNewDate || !moveStartTime || !moveEndTime
                  : !moveToEventId
              }
            >
              Move Reservation
            </Button>,
          ]}
        >
          <Form layout="vertical" style={{ marginTop: '16px' }}>
            <Form.Item label="Move To" required>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button 
                  type={moveMode === 'new' ? 'primary' : 'default'}
                  onClick={() => {
                    setMoveMode('new');
                    setMoveToEventId(null);
                  }}
                  style={{ flex: 1 }}
                >
                  Create New
                </Button>
                <Button 
                  type={moveMode === 'existing' ? 'primary' : 'default'}
                  onClick={() => setMoveMode('existing')}
                  style={{ flex: 1 }}
                >
                  Existing Reservation
                </Button>
              </div>
            </Form.Item>

            {moveMode === 'existing' && (
              <Form.Item label="Select Reservation" required>
                <select
                  value={moveToEventId || ''}
                  onChange={(e) => setMoveToEventId(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
                >
                  <option value="">-- Select a reservation --</option>
                  {schedulerDataRef.current.events
                    .filter(e => e.id !== selectedBooking.id && e.passengers && e.passengers.length > 0)
                    .map(e => (
                      <option key={e.id} value={e.id}>
                        {e.title} ({dayjs(e.start).format('MMM D, h:mm A')} - {dayjs(e.end).format('h:mm A')})
                      </option>
                    ))}
                </select>
              </Form.Item>
            )}

            {moveMode === 'new' && (
              <>
                <Form.Item label="New Date" required>
                  <DatePicker
                    value={moveNewDate}
                    onChange={(date) => setMoveNewDate(date)}
                    style={{ width: '100%' }}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                    picker="date"
                    open={movePassengerDateOpen}
                    onOpenChange={setMovePassengerDateOpen}
                    renderExtraFooter={() => (
                      <div style={{ 
                        padding: '12px',
                        borderTop: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px'
                      }}>
                        <Button 
                          onClick={() => setMovePassengerDateOpen(false)}
                          style={{ width: '80px' }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="primary" 
                          onClick={() => setMovePassengerDateOpen(false)}
                          style={{ width: '80px' }}
                        >
                          OK
                        </Button>
                      </div>
                    )}
                  />
                </Form.Item>

                <Form.Item label="Start Time" required>
                  <TimePicker
                    value={moveStartTime}
                    onChange={(time) => setMoveStartTime(time)}
                    format="h:mm A"
                    use12Hours
                    showNow={false}
                    needConfirm={false}
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item label="End Time" required>
                  <TimePicker
                    value={moveEndTime}
                    onChange={(time) => setMoveEndTime(time)}
                    format="h:mm A"
                    use12Hours
                    showNow={false}
                    needConfirm={false}
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                {moveNewDate && moveStartTime && moveEndTime && (
                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f5ff', borderRadius: '4px' }}>
                    <strong>Moving to:</strong>
                    <p style={{ margin: '8px 0 0 0' }}>
                      {moveNewDate.format('dddd, MMM D, YYYY')}
                      <br />
                      {moveStartTime.format('h:mm A')} - {moveEndTime.format('h:mm A')}
                    </p>
                  </div>
                )}
              </>
            )}
          </Form>
        </Modal>

        {/* Move Small Boat Reservation Modal */}
        <Modal
          title={`Move Reservation: ${selectedBooking?.title}`}
          visible={moveSmallBoatModalVisible}
          width={typeof window !== 'undefined' && window.innerWidth <= 768 ? '95%' : 500}
          wrapClassName="mobile-modal"
          onCancel={() => {
            setMoveSmallBoatModalVisible(false);
            setMoveSmallBoatDate(null);
            setMoveSmallBoatStartTime(null);
            setMoveSmallBoatEndTime(null);
          }}
          footer={[
            <Button key="cancel" onClick={() => {
              setMoveSmallBoatModalVisible(false);
              setMoveSmallBoatDate(null);
              setMoveSmallBoatStartTime(null);
              setMoveSmallBoatEndTime(null);
            }}>
              Cancel
            </Button>,
            <Button 
              key="move" 
              type="primary" 
              onClick={handleMoveSmallBoat}
              disabled={!moveSmallBoatDate || !moveSmallBoatStartTime || !moveSmallBoatEndTime}
            >
              Move Reservation
            </Button>,
          ]}
        >
          <Form layout="vertical" style={{ marginTop: '16px' }}>
            <Form.Item label="New Date" required>
              <DatePicker
                value={moveSmallBoatDate}
                onChange={(date) => setMoveSmallBoatDate(date)}
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                picker="date"
                open={moveSmallBoatDateOpen}
                onOpenChange={setMoveSmallBoatDateOpen}
                renderExtraFooter={() => (
                  <div style={{ 
                    padding: '12px',
                    borderTop: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '8px'
                  }}>
                    <Button 
                      onClick={() => setMoveSmallBoatDateOpen(false)}
                      style={{ width: '80px' }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="primary" 
                      onClick={() => setMoveSmallBoatDateOpen(false)}
                      style={{ width: '80px' }}
                    >
                      OK
                    </Button>
                  </div>
                )}
              />
            </Form.Item>

            <Form.Item label="Start Time" required>
              <TimePicker
                value={moveSmallBoatStartTime}
                onChange={(time) => setMoveSmallBoatStartTime(time)}
                format="h:mm A"
                use12Hours
                showNow={false}
                needConfirm={false}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label="End Time" required>
              <TimePicker
                value={moveSmallBoatEndTime}
                onChange={(time) => setMoveSmallBoatEndTime(time)}
                format="h:mm A"
                use12Hours
                showNow={false}
                needConfirm={false}
                style={{ width: '100%' }}
              />
            </Form.Item>

            {moveSmallBoatDate && moveSmallBoatStartTime && moveSmallBoatEndTime && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f5ff', borderRadius: '4px' }}>
                <strong>Moving to:</strong>
                <p style={{ margin: '8px 0 0 0' }}>
                  {moveSmallBoatDate.format('dddd, MMM D, YYYY')}
                  <br />
                  {moveSmallBoatStartTime.format('h:mm A')} - {moveSmallBoatEndTime.format('h:mm A')}
                </p>
              </div>
            )}
          </Form>
        </Modal>

      </div>
    </DndProvider>
  );
}

export default BookingScheduler;
