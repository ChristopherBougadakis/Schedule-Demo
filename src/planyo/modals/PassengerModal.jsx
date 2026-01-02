/**
 * Passenger Modal - Shows individual passenger details
 */
import React from 'react';
import { Modal, Button, Descriptions, Tag, Divider, InputNumber, message } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const PassengerModal = ({
  visible,
  selectedPassenger,
  selectedBooking,
  pendingAction,
  passengerRefundPercentage,
  passengerNumPeopleCopy,
  hasUnsavedPassengerChanges,
  onClose,
  onCheckIn,
  onRefund,
  onRemove,
  onMoveClick,
  onRefundPercentageChange,
  onNumPeopleChange,
  onSaveChanges,
  clearPendingAction,
}) => {
  if (!selectedPassenger) return null;

  const totalPrice = (selectedPassenger.price * (selectedPassenger.numPeople || 1)).toFixed(2);

  return (
    <Modal
      title={`Passenger: ${selectedPassenger.name} ×${selectedPassenger.numPeople || 1}`}
      open={visible}
      onCancel={onClose}
      width={typeof window !== 'undefined' && window.innerWidth <= 768 ? '95%' : 700}
      wrapClassName="mobile-modal"
      footer={
        selectedPassenger?.refunded ? [
          <Button key="close" onClick={onClose}>
            Close
          </Button>,
        ] : [
          <Button key="close" onClick={onClose}>
            Close
          </Button>,
          hasUnsavedPassengerChanges && (
            <Button 
              key="cancel"
              onClick={() => {
                selectedPassenger.numPeople = passengerNumPeopleCopy;
                onNumPeopleChange(passengerNumPeopleCopy);
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
              onClick={onSaveChanges}
            >
              Save Changes
            </Button>
          ),
          <Button 
            key="move"
            type="dashed"
            onClick={onMoveClick}
          >
            Move Passenger
          </Button>,
          <Button key="checkin" type="primary" onClick={onCheckIn}>
            {selectedPassenger.checkedIn ? 'Undo Check-In' : 'Check In'}
          </Button>,
          <Button 
            key="refund" 
            type={pendingAction === 'refund-passenger' ? 'primary' : 'dashed'} 
            danger 
            onClick={onRefund}
          >
            {pendingAction === 'refund-passenger' ? '⚠ CONFIRM Refund' : 'Refund Passenger'}
          </Button>,
          <Button 
            key="remove" 
            type={pendingAction === 'remove' ? 'primary' : 'default'} 
            danger 
            onClick={onRemove}
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
            <h4>Number of People</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <InputNumber 
                min={1} 
                max={20} 
                value={selectedPassenger.numPeople || 1}
                onChange={onNumPeopleChange}
              />
              {hasUnsavedPassengerChanges && (
                <span style={{ color: '#faad14', fontSize: '12px' }}>● Unsaved changes</span>
              )}
            </div>
          </div>

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
            <p>{selectedPassenger.specialRequest || 'None'}</p>
          </div>

          <Divider />

          <div style={{ marginTop: '16px' }}>
            <h4>Price Information</h4>
            <p style={{ fontSize: '14px' }}>
              Price per person: <strong>${selectedPassenger.price.toFixed(2)}</strong> × {selectedPassenger.numPeople || 1} people = <strong style={{ color: '#1890ff', fontSize: '16px' }}>${totalPrice}</strong>
            </p>
          </div>

          <Divider />

          <div style={{ marginTop: '16px' }}>
            <h4>Refund Calculator</h4>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              Total for {selectedPassenger.numPeople || 1} person(s): ${totalPrice}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span>Percentage:</span>
              <InputNumber
                min={0}
                max={100}
                value={passengerRefundPercentage}
                onChange={onRefundPercentageChange}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                style={{ width: '100px' }}
              />
              <span>or Amount:</span>
              <InputNumber
                min={0}
                max={parseFloat(totalPrice)}
                value={parseFloat((parseFloat(totalPrice) * passengerRefundPercentage / 100).toFixed(2))}
                onChange={(value) => {
                  const newPercentage = (value / parseFloat(totalPrice)) * 100;
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
        </>
      )}
    </Modal>
  );
};

export default PassengerModal;
