/**
 * Move/Reschedule Handlers
 */
import { message } from 'antd';
import { checkBoatTimeOverlap } from '../utils/bookingHelpers';

/**
 * Create move/reschedule handlers
 */
export const createMoveHandlers = ({
  schedulerDataRef,
  selectedBooking,
  selectedPassenger,
  moveMode,
  moveToEventId,
  moveNewDate,
  moveStartTime,
  moveEndTime,
  moveSmallBoatDate,
  moveSmallBoatStartTime,
  moveSmallBoatEndTime,
  setMoveModalVisible,
  setPassengerModalVisible,
  setModalVisible,
  setMoveNewDate,
  setMoveStartTime,
  setMoveEndTime,
  setMoveToEventId,
  setMoveMode,
  setMoveSmallBoatModalVisible,
  setMoveSmallBoatDate,
  setMoveSmallBoatStartTime,
  setMoveSmallBoatEndTime,
  forceUpdate,
}) => {
  // Handle move reservation for individual passenger
  const handleMoveReservation = () => {
    if (!selectedPassenger || !selectedBooking) {
      message.error('No passenger or booking selected');
      return;
    }

    const events = schedulerDataRef.current.events;
    const originalEventIndex = events.findIndex(e => e.id === selectedBooking.id);

    if (moveMode === 'existing') {
      if (!moveToEventId) {
        message.error('Please select a reservation to move to');
        return;
      }

      const targetEventIndex = events.findIndex(e => e.id === moveToEventId);
      if (targetEventIndex === -1) {
        message.error('Target reservation not found');
        return;
      }

      if (!events[targetEventIndex].passengers) {
        events[targetEventIndex].passengers = [];
      }
      events[targetEventIndex].passengers.push({ ...selectedPassenger });

      const targetTotalPeople = events[targetEventIndex].passengers.reduce((sum, p) => sum + (p.numPeople || 1), 0);
      const targetTitlePrefix = events[targetEventIndex].title.split(' - ')[0];
      events[targetEventIndex].title = `${targetTitlePrefix} - ${targetTotalPeople} ppl`;

      message.success(`✓ ${selectedPassenger.name} added to existing reservation`);
    } else {
      if (!moveNewDate || !moveStartTime || !moveEndTime) {
        message.error('Please select date and times for new reservation');
        return;
      }

      // Validate that end time is after start time
      if (!moveEndTime.isAfter(moveStartTime)) {
        message.error('End time must be after start time');
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
      
      if (events[originalEventIndex].passengers.length > 0) {
        const totalPeople = events[originalEventIndex].passengers.reduce((sum, p) => sum + (p.numPeople || 1), 0);
        const titlePrefix = events[originalEventIndex].title.split(' - ')[0];
        events[originalEventIndex].title = `${titlePrefix} - ${totalPeople} ppl`;
      } else {
        events.splice(originalEventIndex, 1);
      }
    }

    // Navigate to the new date if created a new reservation
    if (moveMode === 'new' && moveNewDate) {
      schedulerDataRef.current.setDate(moveNewDate.format('YYYY-MM-DD'));
      schedulerDataRef.current.setEvents(events);
      // Force a complete refresh by re-setting resources
      const resources = schedulerDataRef.current.resources;
      schedulerDataRef.current.setResources(resources);
    } else {
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

    // Validate that end time is after start time
    if (!moveSmallBoatEndTime.isAfter(moveSmallBoatStartTime)) {
      message.error('End time must be after start time');
      return;
    }

    const events = schedulerDataRef.current.events;
    const originalEventIndex = events.findIndex(e => e.id === selectedBooking.id);

    // Check for overlaps
    if (checkBoatTimeOverlap(moveSmallBoatDate, moveSmallBoatStartTime, moveSmallBoatEndTime, selectedBooking.resourceId, selectedBooking.id, events)) {
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

    // Navigate to the new date and refresh
    schedulerDataRef.current.setDate(moveSmallBoatDate.format('YYYY-MM-DD'));
    schedulerDataRef.current.setEvents(events);
    // Force a complete refresh by re-setting resources
    const resources = schedulerDataRef.current.resources;
    schedulerDataRef.current.setResources(resources);
    
    forceUpdate();
    
    setMoveSmallBoatModalVisible(false);
    setModalVisible(false);
    setMoveSmallBoatDate(null);
    setMoveSmallBoatStartTime(null);
    setMoveSmallBoatEndTime(null);
  };

  return {
    handleMoveReservation,
    handleMoveSmallBoat,
  };
};
