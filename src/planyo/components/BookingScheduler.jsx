/**
 * BookingScheduler - Main Component
 * Refactored for better organization and maintainability
 */

import React, { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Scheduler, SchedulerData, ViewType } from '../../components';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createBoatResources, createDummyEvents } from '../data/boatData';
import { createBookingHandlers, createNavigationHandlers, createAddPassengerHandler } from '../handlers/bookingHandlers';
import { createMoveHandlers } from '../handlers/moveHandlers';
import { createReservationHandler } from '../handlers/createReservationHandler';
import BigBoatModal from '../modals/BigBoatModal';
import SmallBoatModal from '../modals/SmallBoatModal';
import PassengerModal from '../modals/PassengerModal';
import MovePassengerModal from '../modals/MovePassengerModal';
import MoveSmallBoatModal from '../modals/MoveSmallBoatModal';
import CreateReservationModal from '../modals/CreateReservationModal';
import AddPassengerModal from '../modals/AddPassengerModal';
import '../../css/style.css';

function BookingScheduler() {
  const schedulerDataRef = useRef(null);
  const [, setForceUpdateCounter] = useState(0);
  const forceUpdate = () => setForceUpdateCounter(prev => prev + 1);

  // Booking selection state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Passenger state
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [passengerModalVisible, setPassengerModalVisible] = useState(false);
  const [passengerNumPeopleCopy, setPassengerNumPeopleCopy] = useState(1);
  const [hasUnsavedPassengerChanges, setHasUnsavedPassengerChanges] = useState(false);

  // Move reservation states
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [moveMode, setMoveMode] = useState('new');
  const [moveToEventId, setMoveToEventId] = useState(null);
  const [moveNewDate, setMoveNewDate] = useState(null);
  const [moveStartTime, setMoveStartTime] = useState(null);
  const [moveEndTime, setMoveEndTime] = useState(null);
  const [movePassengerDateOpen, setMovePassengerDateOpen] = useState(false);
  const [movePassengerStartTimeOpen, setMovePassengerStartTimeOpen] = useState(false);
  const [movePassengerEndTimeOpen, setMovePassengerEndTimeOpen] = useState(false);

  // Small boat move states
  const [moveSmallBoatModalVisible, setMoveSmallBoatModalVisible] = useState(false);
  const [moveSmallBoatDate, setMoveSmallBoatDate] = useState(null);
  const [moveSmallBoatStartTime, setMoveSmallBoatStartTime] = useState(null);
  const [moveSmallBoatEndTime, setMoveSmallBoatEndTime] = useState(null);
  const [moveSmallBoatDateOpen, setMoveSmallBoatDateOpen] = useState(false);
  const [moveSmallBoatStartTimeOpen, setMoveSmallBoatStartTimeOpen] = useState(false);
  const [moveSmallBoatEndTimeOpen, setMoveSmallBoatEndTimeOpen] = useState(false);

  // Create reservation modal state
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // Add passenger modal state
  const [addPassengerModalVisible, setAddPassengerModalVisible] = useState(false);

  // Double-action confirmation states
  const [pendingAction, setPendingAction] = useState(null);
  const [confirmTimeout, setConfirmTimeout] = useState(null);

  // Refund percentages
  const [refundPercentage, setRefundPercentage] = useState(100);
  const [passengerRefundPercentage, setPassengerRefundPercentage] = useState(100);

  // Clear pending action helper
  const clearPendingAction = () => {
    if (confirmTimeout) clearTimeout(confirmTimeout);
    setPendingAction(null);
  };

  // Initialize scheduler data
  if (!schedulerDataRef.current) {
    const dummyEvents = createDummyEvents();
    const boatResources = createBoatResources();
    
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

  // Create handlers
  const bookingHandlers = createBookingHandlers({
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
  });

  const navigationHandlers = createNavigationHandlers({
    schedulerDataRef,
    forceUpdate,
  });

  const addPassengerHandlers = createAddPassengerHandler({
    schedulerDataRef,
    selectedBooking,
    setAddPassengerModalVisible,
    forceUpdate,
  });

  const moveHandlers = createMoveHandlers({
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
  });

  // Create reservation handler
  const createReservationHandlers = createReservationHandler({
    schedulerDataRef,
    setCreateModalVisible,
    forceUpdate,
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header with Create Button */}
        <div style={{ padding: '12px 16px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Create Reservation
          </Button>
        </div>
        <Scheduler
          schedulerData={schedulerDataRef.current}
          prevClick={navigationHandlers.prevClick}
          nextClick={navigationHandlers.nextClick}
          onViewChange={navigationHandlers.onViewChange}
          onSelectDate={navigationHandlers.onSelectDate}
          eventItemClick={bookingHandlers.handleEventClick}
        />

        {/* Big Boat Modal */}
        {selectedBooking?.boatType === 'big' && (
          <BigBoatModal
            visible={modalVisible}
            selectedBooking={selectedBooking}
            pendingAction={pendingAction}
            refundPercentage={refundPercentage}
            onClose={() => {
              clearPendingAction();
              setModalVisible(false);
            }}
            onPassengerClick={bookingHandlers.handlePassengerClick}
            onCancel={() => bookingHandlers.handleCancelClick(selectedBooking)}
            onRefund={() => bookingHandlers.handleRefund(selectedBooking)}
            onRefundPercentageChange={setRefundPercentage}
            onAddPassenger={() => setAddPassengerModalVisible(true)}
            clearPendingAction={clearPendingAction}
          />
        )}

        {/* Small Boat Modal */}
        {selectedBooking?.boatType === 'small' && (
          <SmallBoatModal
            visible={modalVisible}
            selectedBooking={selectedBooking}
            pendingAction={pendingAction}
            refundPercentage={refundPercentage}
            onClose={() => {
              clearPendingAction();
              setModalVisible(false);
            }}
            onCheckIn={() => bookingHandlers.handleCheckIn(selectedBooking)}
            onCancel={() => bookingHandlers.handleCancelClick(selectedBooking)}
            onRefund={() => bookingHandlers.handleRefund(selectedBooking)}
            onRefundPercentageChange={setRefundPercentage}
            onMoveClick={() => {
              setMoveSmallBoatModalVisible(true);
              setMoveSmallBoatDate(null);
              setMoveSmallBoatStartTime(null);
              setMoveSmallBoatEndTime(null);
            }}
            clearPendingAction={clearPendingAction}
          />
        )}

        {/* Passenger Detail Modal */}
        <PassengerModal
          visible={passengerModalVisible}
          selectedPassenger={selectedPassenger}
          selectedBooking={selectedBooking}
          pendingAction={pendingAction}
          passengerRefundPercentage={passengerRefundPercentage}
          passengerNumPeopleCopy={passengerNumPeopleCopy}
          hasUnsavedPassengerChanges={hasUnsavedPassengerChanges}
          onClose={() => {
            clearPendingAction();
            setPassengerModalVisible(false);
          }}
          onCheckIn={() => bookingHandlers.handleCheckInPassenger(selectedPassenger)}
          onRefund={() => bookingHandlers.handleRefundPassenger(selectedPassenger)}
          onRemove={() => bookingHandlers.handleRemovePassenger(selectedBooking, selectedPassenger)}
          onMoveClick={() => {
            setMoveModalVisible(true);
            setMoveNewDate(null);
            setMoveStartTime(null);
            setMoveEndTime(null);
            setMoveToEventId(null);
            setMoveMode('new');
          }}
          onRefundPercentageChange={setPassengerRefundPercentage}
          onNumPeopleChange={(value) => {
            if (selectedPassenger) {
              selectedPassenger.numPeople = value;
              setHasUnsavedPassengerChanges(value !== passengerNumPeopleCopy);
              forceUpdate();
            }
          }}
          onSaveChanges={() => {
            setPassengerNumPeopleCopy(selectedPassenger.numPeople || 1);
            setHasUnsavedPassengerChanges(false);
            forceUpdate();
          }}
          clearPendingAction={clearPendingAction}
        />

        {/* Move Passenger Modal */}
        <MovePassengerModal
          visible={moveModalVisible}
          selectedPassenger={selectedPassenger}
          selectedBooking={selectedBooking}
          schedulerData={schedulerDataRef.current}
          moveMode={moveMode}
          moveToEventId={moveToEventId}
          moveNewDate={moveNewDate}
          moveStartTime={moveStartTime}
          moveEndTime={moveEndTime}
          movePassengerDateOpen={movePassengerDateOpen}
          movePassengerStartTimeOpen={movePassengerStartTimeOpen}
          movePassengerEndTimeOpen={movePassengerEndTimeOpen}
          onClose={() => {
            setMoveModalVisible(false);
            setMoveNewDate(null);
            setMoveStartTime(null);
            setMoveEndTime(null);
            setMoveToEventId(null);
            setMoveMode('new');
          }}
          onMove={moveHandlers.handleMoveReservation}
          onMoveModeChange={setMoveMode}
          onMoveToEventIdChange={setMoveToEventId}
          onMoveNewDateChange={setMoveNewDate}
          onMoveStartTimeChange={setMoveStartTime}
          onMoveEndTimeChange={setMoveEndTime}
          setMovePassengerDateOpen={setMovePassengerDateOpen}
          setMovePassengerStartTimeOpen={setMovePassengerStartTimeOpen}
          setMovePassengerEndTimeOpen={setMovePassengerEndTimeOpen}
        />

        {/* Move Small Boat Modal */}
        <MoveSmallBoatModal
          visible={moveSmallBoatModalVisible}
          selectedBooking={selectedBooking}
          moveSmallBoatDate={moveSmallBoatDate}
          moveSmallBoatStartTime={moveSmallBoatStartTime}
          moveSmallBoatEndTime={moveSmallBoatEndTime}
          moveSmallBoatDateOpen={moveSmallBoatDateOpen}
          moveSmallBoatStartTimeOpen={moveSmallBoatStartTimeOpen}
          moveSmallBoatEndTimeOpen={moveSmallBoatEndTimeOpen}
          onClose={() => {
            setMoveSmallBoatModalVisible(false);
            setMoveSmallBoatDate(null);
            setMoveSmallBoatStartTime(null);
            setMoveSmallBoatEndTime(null);
          }}
          onMove={moveHandlers.handleMoveSmallBoat}
          onDateChange={setMoveSmallBoatDate}
          onStartTimeChange={setMoveSmallBoatStartTime}
          onEndTimeChange={setMoveSmallBoatEndTime}
          setMoveSmallBoatDateOpen={setMoveSmallBoatDateOpen}
          setMoveSmallBoatStartTimeOpen={setMoveSmallBoatStartTimeOpen}
          setMoveSmallBoatEndTimeOpen={setMoveSmallBoatEndTimeOpen}
        />

        {/* Create Reservation Modal */}
        <CreateReservationModal
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
          onCreate={createReservationHandlers.handleCreateReservation}
        />

        {/* Add Passenger Modal */}
        <AddPassengerModal
          visible={addPassengerModalVisible}
          onClose={() => setAddPassengerModalVisible(false)}
          onAdd={addPassengerHandlers.handleAddPassenger}
        />
      </div>
    </DndProvider>
  );
}

export default BookingScheduler;
