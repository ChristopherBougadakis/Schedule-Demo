/**
 * Create Reservation Handler
 */
import { message } from 'antd';
import { checkBoatTimeOverlap } from '../utils/bookingHelpers';

/**
 * Create handler for new reservations
 */
export const createReservationHandler = ({
  schedulerDataRef,
  setCreateModalVisible,
  forceUpdate,
}) => {
  const handleCreateReservation = (values) => {
    const events = schedulerDataRef.current.events;
    const resources = schedulerDataRef.current.resources;

    // Validate boat exists
    if (!resources.find(r => r.id === values.boatId)) {
      message.error('Invalid boat selected');
      return;
    }

    // Create start and end dates
    const startDate = values.date.toDate();
    startDate.setHours(values.startTime.hour(), values.startTime.minute());
    
    const endDate = values.date.toDate();
    endDate.setHours(values.endTime.hour(), values.endTime.minute());

    // Check for time overlaps
    if (checkBoatTimeOverlap(values.date, values.startTime, values.endTime, values.boatId, null, events)) {
      message.error('⚠️ Time slot conflicts with another reservation on this boat');
      return;
    }

    // Determine if it's a small or big boat
    const isSmallBoat = values.boatId.includes('small');
    const bgColors = {
      'small-1': '#FF6B6B',
      'small-2': '#FFE66D',
      'big-1': '#4ECDC4',
      'big-2': '#95E1D3',
    };

    // Generate new event ID
    const newEventId = Math.max(...events.map(e => e.id), 0) + 1;

    // Create the new event
    const newEvent = {
      id: newEventId,
      title: `${values.customerName} - ${values.numPeople} ppl`,
      start: startDate,
      end: endDate,
      resourceId: values.boatId,
      bgColor: bgColors[values.boatId] || '#1890ff',
      boatType: isSmallBoat ? 'small' : 'big',
      checkedIn: false,
      price: values.price,
    };

    // For big boats, add passengers array
    if (!isSmallBoat) {
      newEvent.passengers = [
        {
          id: `p1-${newEventId}`,
          name: values.customerName,
          email: values.email,
          phone: values.phone,
          checkedIn: false,
          addOns: values.addOns || [],
          specialRequest: values.specialRequest || 'None',
          price: values.price,
          numPeople: values.numPeople,
        },
      ];
    }

    // Add the new event to events
    events.push(newEvent);
    schedulerDataRef.current.setEvents(events);

    message.success(`✓ Reservation created for ${values.customerName} on ${values.date.format('MMM D, YYYY')} from ${values.startTime.format('h:mm A')} to ${values.endTime.format('h:mm A')}`);

    // Navigate to the new date
    schedulerDataRef.current.setDate(values.date.format('YYYY-MM-DD'));
    const resources_list = schedulerDataRef.current.resources;
    schedulerDataRef.current.setResources(resources_list);
    schedulerDataRef.current.setEvents(events);

    forceUpdate();
    setCreateModalVisible(false);
  };

  return {
    handleCreateReservation,
  };
};
