/**
 * Move Passenger Modal - Move passenger to another reservation
 */
import React from 'react';
import { Modal, Button, Form, DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';

const MovePassengerModal = ({
  visible,
  selectedPassenger,
  selectedBooking,
  schedulerData,
  moveMode,
  moveToEventId,
  moveNewDate,
  moveStartTime,
  moveEndTime,
  movePassengerDateOpen,
  movePassengerStartTimeOpen,
  movePassengerEndTimeOpen,
  onClose,
  onMove,
  onMoveModeChange,
  onMoveToEventIdChange,
  onMoveNewDateChange,
  onMoveStartTimeChange,
  onMoveEndTimeChange,
  setMovePassengerDateOpen,
  setMovePassengerStartTimeOpen,
  setMovePassengerEndTimeOpen,
}) => {
  return (
    <Modal
      title={`Move Passenger: ${selectedPassenger?.name}`}
      open={visible}
      width={typeof window !== 'undefined' && window.innerWidth <= 768 ? '95%' : 500}
      wrapClassName="mobile-modal"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="move" 
          type="primary" 
          onClick={onMove}
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
                onMoveModeChange('new');
                onMoveToEventIdChange(null);
              }}
              style={{ flex: 1 }}
            >
              Create New
            </Button>
            <Button 
              type={moveMode === 'existing' ? 'primary' : 'default'}
              onClick={() => onMoveModeChange('existing')}
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
              onChange={(e) => onMoveToEventIdChange(parseInt(e.target.value))}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
            >
              <option value="">-- Select a reservation --</option>
              {schedulerData?.events
                ?.filter(e => e.id !== selectedBooking?.id && e.passengers && e.passengers.length > 0)
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
                onChange={onMoveNewDateChange}
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                open={movePassengerDateOpen}
                onOpenChange={setMovePassengerDateOpen}
              />
            </Form.Item>

            <Form.Item label="Start Time" required>
              <TimePicker
                value={moveStartTime}
                onChange={onMoveStartTimeChange}
                format="h:mm A"
                use12Hours
                style={{ width: '100%' }}
                open={movePassengerStartTimeOpen}
                onOpenChange={setMovePassengerStartTimeOpen}
              />
            </Form.Item>

            <Form.Item label="End Time" required>
              <TimePicker
                value={moveEndTime}
                onChange={onMoveEndTimeChange}
                format="h:mm A"
                use12Hours
                style={{ width: '100%' }}
                open={movePassengerEndTimeOpen}
                onOpenChange={setMovePassengerEndTimeOpen}
              />
            </Form.Item>

            {moveStartTime && moveEndTime && !moveEndTime.isAfter(moveStartTime) && (
              <div style={{ padding: '12px', backgroundColor: '#fff2e8', border: '1px solid #ffbb96', borderRadius: '4px', marginBottom: '12px' }}>
                <div style={{ color: '#ff7a45', fontWeight: 'bold' }}>⚠ Warning</div>
                <div style={{ color: '#ff7a45', fontSize: '12px', marginTop: '4px' }}>
                  End time must be after start time
                </div>
              </div>
            )}

            {moveNewDate && moveStartTime && moveEndTime && moveEndTime.isAfter(moveStartTime) && (
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
  );
};

export default MovePassengerModal;
