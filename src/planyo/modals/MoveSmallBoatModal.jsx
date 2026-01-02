/**
 * Move Small Boat Modal - Reschedule small boat reservation
 */
import React from 'react';
import { Modal, Button, Form, DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';

const MoveSmallBoatModal = ({
  visible,
  selectedBooking,
  moveSmallBoatDate,
  moveSmallBoatStartTime,
  moveSmallBoatEndTime,
  moveSmallBoatDateOpen,
  moveSmallBoatStartTimeOpen,
  moveSmallBoatEndTimeOpen,
  onClose,
  onMove,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  setMoveSmallBoatDateOpen,
  setMoveSmallBoatStartTimeOpen,
  setMoveSmallBoatEndTimeOpen,
}) => {
  return (
    <Modal
      title={`Move Reservation: ${selectedBooking?.title}`}
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
            onChange={onDateChange}
            style={{ width: '100%' }}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
            open={moveSmallBoatDateOpen}
            onOpenChange={setMoveSmallBoatDateOpen}
          />
        </Form.Item>

        <Form.Item label="Start Time" required>
          <TimePicker
            value={moveSmallBoatStartTime}
            onChange={onStartTimeChange}
            format="h:mm A"
            use12Hours
            style={{ width: '100%' }}
            open={moveSmallBoatStartTimeOpen}
            onOpenChange={setMoveSmallBoatStartTimeOpen}
          />
        </Form.Item>

        <Form.Item label="End Time" required>
          <TimePicker
            value={moveSmallBoatEndTime}
            onChange={onEndTimeChange}
            format="h:mm A"
            use12Hours
            style={{ width: '100%' }}
            open={moveSmallBoatEndTimeOpen}
            onOpenChange={setMoveSmallBoatEndTimeOpen}
          />
        </Form.Item>

        {moveSmallBoatStartTime && moveSmallBoatEndTime && !moveSmallBoatEndTime.isAfter(moveSmallBoatStartTime) && (
          <div style={{ padding: '12px', backgroundColor: '#fff2e8', border: '1px solid #ffbb96', borderRadius: '4px', marginBottom: '12px' }}>
            <div style={{ color: '#ff7a45', fontWeight: 'bold' }}>⚠ Warning</div>
            <div style={{ color: '#ff7a45', fontSize: '12px', marginTop: '4px' }}>
              End time must be after start time
            </div>
          </div>
        )}

        {moveSmallBoatDate && moveSmallBoatStartTime && moveSmallBoatEndTime && moveSmallBoatEndTime.isAfter(moveSmallBoatStartTime) && (
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
  );
};

export default MoveSmallBoatModal;
