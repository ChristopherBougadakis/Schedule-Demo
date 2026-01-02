/**
 * Big Boat Modal - Shows passenger list for big boat reservations
 */
import React from 'react';
import { Modal, Button, Tag } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';

const BigBoatModal = ({
  visible,
  selectedBooking,
  pendingAction,
  refundPercentage,
  onClose,
  onPassengerClick,
  onCancel,
  onRefund,
  onRefundPercentageChange,
  onAddPassenger,
  clearPendingAction,
}) => {
  return (
    <Modal
      title={`Passengers: ${selectedBooking?.title}`}
      open={visible}
      onCancel={onClose}
      width={typeof window !== 'undefined' && window.innerWidth <= 768 ? '95%' : 900}
      wrapClassName="mobile-modal"
      footer={[
        <Button key="add" type="primary" onClick={onAddPassenger}>
          + Add Passenger
        </Button>,
        <Button key="close" onClick={onClose}>
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
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {selectedBooking.passengers.map(passenger => (
              <div
                key={passenger.id}
                onClick={() => onPassengerClick(passenger)}
                style={{
                  padding: '12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: passenger.checkedIn ? '#f6ffed' : (passenger.refunded ? '#fff1f0' : '#ffffff'),
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>
                      <UserOutlined /> {passenger.name} 
                      <Tag color="blue" style={{ marginLeft: '6px' }}>×{passenger.numPeople || 1}</Tag>
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      <PhoneOutlined /> {passenger.phone}
                    </div>
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
  );
};

export default BigBoatModal;
