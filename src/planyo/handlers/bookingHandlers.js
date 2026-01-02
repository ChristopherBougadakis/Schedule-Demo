/**
 * Booking Event Handlers
 */
import { message } from 'antd';
import { updateEventStatus } from '../utils/bookingHelpers';

/**
 * Create booking handlers
 */
export const createBookingHandlers = ({
  schedulerDataRef,
  setSelectedBooking,
  setModalVisible,
  setSelectedPassenger,
  setPassengerNumPeopleCopy,
  setHasUnsavedPassengerChanges,
  setPassengerModalVisible,
  forceUpdate,
  pendingAction,
  setPendingAction,
  confirmTimeout,
  setConfirmTimeout,
  refundPercentage,
  passengerRefundPercentage,
  clearPendingAction,
}) => {
  // Handle event click - show booking details
  const handleEventClick = (schedulerData, event) => {
    setSelectedBooking(event);
    setModalVisible(true);
  };

  // Handle passenger click
  const handlePassengerClick = (passenger) => {
    setSelectedPassenger(passenger);
    setPassengerNumPeopleCopy(passenger.numPeople || 1);
    setHasUnsavedPassengerChanges(false);
    setPassengerModalVisible(true);
    setModalVisible(false);
  };

  // Handle check-in passenger (toggle)
  const handleCheckInPassenger = (selectedPassenger) => {
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
  const handleCheckIn = (selectedBooking) => {
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
  const handleCancelClick = (selectedBooking) => {
    if (pendingAction === 'cancel') {
      message.success(`✓ Booking cancelled: "${selectedBooking.title}"`);
      const events = schedulerDataRef.current.events;
      const updatedEvents = updateEventStatus(events, selectedBooking.id, 'cancelled');
      schedulerDataRef.current.setEvents(updatedEvents);
      forceUpdate();
      clearPendingAction();
    } else {
      setPendingAction('cancel');
      message.warning('Click again to confirm cancellation');
      
      if (confirmTimeout) clearTimeout(confirmTimeout);
      const timeout = setTimeout(() => {
        setPendingAction(null);
        message.info('Cancellation cancelled');
      }, 3000);
      setConfirmTimeout(timeout);
    }
  };

  // Handle refund - double-action
  const handleRefund = (selectedBooking) => {
    if (pendingAction === 'refund') {
      const totalPrice = selectedBooking.boatType === 'small' 
        ? 450.00 
        : selectedBooking.passengers.reduce((sum, p) => sum + (p.price * (p.numPeople || 1)), 0);
      const refundAmount = (totalPrice * refundPercentage / 100).toFixed(2);
      
      const events = schedulerDataRef.current.events;
      const eventIndex = events.findIndex(e => e.id === selectedBooking.id);
      if (eventIndex !== -1) {
        events[eventIndex].refunded = true;
        events[eventIndex].refundAmount = refundAmount;
        events[eventIndex].refundPercentage = refundPercentage;
      }
      
      message.success(`✓ Refund processed for ${selectedBooking.title}: $${refundAmount} (${refundPercentage}% of $${totalPrice.toFixed(2)})`);
      const updatedEvents = updateEventStatus(events, selectedBooking.id, 'refunded');
      schedulerDataRef.current.setEvents(updatedEvents);
      forceUpdate();
      clearPendingAction();
    } else {
      setPendingAction('refund');
      message.warning('Click again to confirm refund');
      
      if (confirmTimeout) clearTimeout(confirmTimeout);
      const timeout = setTimeout(() => {
        setPendingAction(null);
        message.info('Refund cancelled');
      }, 3000);
      setConfirmTimeout(timeout);
    }
  };

  // Handle passenger removal - double-action
  const handleRemovePassenger = (selectedBooking, selectedPassenger) => {
    if (pendingAction === 'remove') {
      message.success(`✓ ${selectedPassenger.name} removed from booking`);
      
      const events = schedulerDataRef.current.events;
      const eventIndex = events.findIndex(e => e.id === selectedBooking.id);
      if (eventIndex !== -1 && events[eventIndex].passengers) {
        const passengerIndex = events[eventIndex].passengers.findIndex(p => p.id === selectedPassenger.id);
        if (passengerIndex !== -1) {
          events[eventIndex].passengers.splice(passengerIndex, 1);
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
      setPendingAction('remove');
      message.warning('Click again to confirm removal');
      
      if (confirmTimeout) clearTimeout(confirmTimeout);
      const timeout = setTimeout(() => {
        setPendingAction(null);
        message.info('Removal cancelled');
      }, 3000);
      setConfirmTimeout(timeout);
    }
  };

  // Handle individual passenger refund - double-action
  const handleRefundPassenger = (selectedPassenger) => {
    if (pendingAction === 'refund-passenger') {
      const refundAmount = (selectedPassenger.price * passengerRefundPercentage / 100).toFixed(2);
      message.success(`✓ ${selectedPassenger.name} refunded $${refundAmount} (${passengerRefundPercentage}% of $${selectedPassenger.price.toFixed(2)})`);
      
      selectedPassenger.refunded = true;
      selectedPassenger.refundAmount = refundAmount;
      selectedPassenger.refundPercentage = passengerRefundPercentage;
      forceUpdate();
      
      clearPendingAction();
      forceUpdate();
    } else {
      setPendingAction('refund-passenger');
      message.warning('Click again to confirm refund');
      
      if (confirmTimeout) clearTimeout(confirmTimeout);
      const timeout = setTimeout(() => {
        setPendingAction(null);
        message.info('Refund cancelled');
      }, 3000);
      setConfirmTimeout(timeout);
    }
  };

  return {
    handleEventClick,
    handlePassengerClick,
    handleCheckInPassenger,
    handleCheckIn,
    handleCancelClick,
    handleRefund,
    handleRemovePassenger,
    handleRefundPassenger,
  };
};

/**
 * Add passenger handler
 */
export const createAddPassengerHandler = ({
  schedulerDataRef,
  selectedBooking,
  setAddPassengerModalVisible,
  forceUpdate,
}) => {
  const handleAddPassenger = (values) => {
    if (!selectedBooking || !selectedBooking.passengers) {
      message.error('Invalid booking selected');
      return;
    }

    const events = schedulerDataRef.current.events;
    const eventIndex = events.findIndex(e => e.id === selectedBooking.id);

    if (eventIndex === -1) {
      message.error('Booking not found');
      return;
    }

    // Generate unique passenger ID
    const newPassengerId = `p${Math.max(...selectedBooking.passengers.map(p => parseInt(p.id.replace('p', ''))), 0) + 1}`;

    // Create new passenger object
    const newPassenger = {
      id: newPassengerId,
      name: values.name,
      email: values.email,
      phone: values.phone,
      checkedIn: false,
      addOns: values.addOns || [],
      specialRequest: values.specialRequest || 'None',
      price: values.price,
      numPeople: values.numPeople,
    };

    // Add passenger to booking
    events[eventIndex].passengers.push(newPassenger);

    // Update event title with new passenger count
    const totalPeople = events[eventIndex].passengers.reduce((sum, p) => sum + (p.numPeople || 1), 0);
    const titlePrefix = events[eventIndex].title.split(' - ')[0];
    events[eventIndex].title = `${titlePrefix} - ${totalPeople} ppl`;

    // Update the events
    schedulerDataRef.current.setEvents(events);
    forceUpdate();

    message.success(`✓ ${values.name} added to reservation`);
    setAddPassengerModalVisible(false);
  };

  return {
    handleAddPassenger,
  };
};

/**
 * Create scheduler navigation handlers
 */
export const createNavigationHandlers = ({ schedulerDataRef, forceUpdate }) => {
  const prevClick = (schedulerData) => {
    const existingEvents = schedulerDataRef.current?.events || [];
    const resources = schedulerDataRef.current?.resources || [];
    schedulerData.prev();
    schedulerData.setResources(resources);
    schedulerData.setEvents(existingEvents);
    forceUpdate();
  };

  const nextClick = (schedulerData) => {
    const existingEvents = schedulerDataRef.current?.events || [];
    const resources = schedulerDataRef.current?.resources || [];
    schedulerData.next();
    schedulerData.setResources(resources);
    schedulerData.setEvents(existingEvents);
    forceUpdate();
  };

  const onViewChange = (schedulerData, view) => {
    const existingEvents = schedulerDataRef.current?.events || [];
    const resources = schedulerDataRef.current?.resources || [];
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    schedulerData.setResources(resources);
    schedulerData.setEvents(existingEvents);
    forceUpdate();
  };

  const onSelectDate = (schedulerData, date) => {
    const existingEvents = schedulerDataRef.current?.events || [];
    const resources = schedulerDataRef.current?.resources || [];
    schedulerData.setDate(date);
    schedulerData.setResources(resources);
    schedulerData.setEvents(existingEvents);
    forceUpdate();
  };

  return {
    prevClick,
    nextClick,
    onViewChange,
    onSelectDate,
  };
};
