/**
 * Small Boat Modal - Shows booking details for small boat reservations
 */
import React from 'react';
import { Modal, Button, Descriptions, Tag, Divider, InputNumber } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const SmallBoatModal = ({
  visible,
  selectedBooking,
  pendingAction,
  refundPercentage,
  onClose,
  onCheckIn,
  onCancel,
  onRefund,
  onRefundPercentageChange,
  onMoveClick,
  clearPendingAction,
}) => {
  return (
    <Modal
      title={`Booking Details: ${selectedBooking?.title}`}
      open={visible}
      onCancel={onClose}
      width={typeof window !== 'undefined' && window.innerWidth <= 768 ? '95%' : 800}
      wrapClassName="mobile-modal"
      footer={
        selectedBooking?.refunded ? [
          <Button key="close" onClick={onClose}>
            Close
          </Button>,
        ] : [
          <Button key="close" onClick={onClose}>
            Close
          </Button>,
          <Button 
            key="move"
            type="default"
            onClick={onMoveClick}
          >
            Move Reservation
          </Button>,
          <Button 
            key="refund" 
            type={pendingAction === 'refund' ? 'primary' : 'dashed'} 
            danger 
            onClick={onRefund}
          >
            {pendingAction === 'refund' ? '⚠ CONFIRM Refund' : 'Process Refund'}
          </Button>,
          <Button 
            key="cancel" 
            type={pendingAction === 'cancel' ? 'primary' : 'default'} 
            danger 
            onClick={onCancel}
          >
            {pendingAction === 'cancel' ? '⚠ CONFIRM Cancel' : 'Cancel Booking'}
          </Button>,
          <Button key="checkin" type="primary" onClick={onCheckIn}>
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
              {selectedBooking.resourceId === 'small-1' ? 'Small Boat 1 (2 hrs)' : 'Small Boat 2 (2 hrs)'}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              <ClockCircleOutlined /> {dayjs(selectedBooking.start).format('ddd, MMM D, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Time">
              {dayjs(selectedBooking.start).format('h:mm A')} - {dayjs(selectedBooking.end).format('h:mm A')}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {Math.round((new Date(selectedBooking.end) - new Date(selectedBooking.start)) / 3600000)} hours
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
                onChange={onRefundPercentageChange}
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
                  onRefundPercentageChange(parseFloat(newPercentage.toFixed(2)));
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
  );
};

export default SmallBoatModal;
