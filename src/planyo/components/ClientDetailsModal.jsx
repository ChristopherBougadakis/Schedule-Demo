/**
 * ClientDetailsModal Component
 * Shows full client information with action buttons
 */

import React, { useState } from 'react';
import { Modal, Descriptions, Button, Space, message, Tag, Popconfirm, Input, Divider } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { checkInClient, checkOutClient, cancelReservation, processRefund } from '../services/planyoApi';
import { formatDate, formatTime, formatCurrency, getDuration } from '../utils/dataMapper';

const { TextArea } = Input;

function ClientDetailsModal({ visible, client, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');

  if (!client || !client.planyoData) {
    return null;
  }

  const data = client.planyoData;
  const isCheckedIn = data.checked_in;
  const isCheckedOut = data.checked_out;
  const isCancelled = data.cancelled;

  // Handle check-in
  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await checkInClient(client.id);
      message.success(`${client.title} checked in successfully`);
      onUpdate();
      onClose();
    } catch (error) {
      message.error('Failed to check in client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    try {
      setLoading(true);
      await checkOutClient(client.id);
      message.success(`${client.title} checked out successfully`);
      onUpdate();
      onClose();
    } catch (error) {
      message.error('Failed to check out client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancellation
  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      message.warning('Please provide a cancellation reason');
      return;
    }

    try {
      setLoading(true);
      await cancelReservation(client.id, cancellationReason);
      message.success('Reservation cancelled successfully');
      setCancellationReason('');
      onUpdate();
      onClose();
    } catch (error) {
      message.error('Failed to cancel reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle refund
  const handleRefund = async () => {
    const amount = parseFloat(refundAmount);
    
    if (!refundAmount || amount <= 0) {
      message.error('Please enter a valid refund amount');
      return;
    }

    if (amount > data.total_amount) {
      message.error('Refund amount cannot exceed the total amount');
      return;
    }

    try {
      setLoading(true);
      await processRefund(client.id, amount);
      message.success(`Refund of ${formatCurrency(amount)} processed successfully`);
      setRefundAmount('');
      onUpdate();
      onClose();
    } catch (error) {
      message.error('Failed to process refund. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <span style={{ fontSize: '18px' }}>Reservation Details</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={
        <Space>
          {!isCheckedIn && !isCancelled && (
            <Popconfirm
              title="Check in this client?"
              description="Confirm check-in for this reservation?"
              onConfirm={handleCheckIn}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={loading}
              >
                Check In
              </Button>
            </Popconfirm>
          )}

          {isCheckedIn && !isCheckedOut && !isCancelled && (
            <Popconfirm
              title="Check out this client?"
              description="Confirm check-out for this reservation?"
              onConfirm={handleCheckOut}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<LogoutOutlined />}
                loading={loading}
              >
                Check Out
              </Button>
            </Popconfirm>
          )}

          {isCheckedIn && !isCheckedOut && (
            <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontSize: '14px', padding: '4px 12px' }}>
              Checked In
            </Tag>
          )}

          {isCheckedOut && (
            <Tag icon={<CheckCircleOutlined />} color="default" style={{ fontSize: '14px', padding: '4px 12px' }}>
              Checked Out
            </Tag>
          )}

          {isCancelled && (
            <Tag icon={<CloseCircleOutlined />} color="error" style={{ fontSize: '14px', padding: '4px 12px' }}>
              Cancelled
            </Tag>
          )}

          <Button onClick={onClose}>Close</Button>
        </Space>
      }
    >
      {/* Client Information */}
      <Descriptions
        bordered
        column={2}
        size="middle"
        style={{ marginBottom: '24px' }}
      >
        <Descriptions.Item label="Full Name" span={2}>
          <strong style={{ fontSize: '16px' }}>{client.title}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Email" span={2}>
          <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          <a href={`mailto:${data.client_email}`}>{data.client_email || 'N/A'}</a>
        </Descriptions.Item>

        <Descriptions.Item label="Phone">
          <PhoneOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
          <a href={`tel:${data.client_phone}`}>{data.client_phone || 'N/A'}</a>
        </Descriptions.Item>

        <Descriptions.Item label="Country">
          <GlobalOutlined style={{ marginRight: '8px', color: '#faad14' }} />
          {data.client_country || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label="Service" span={2}>
          <strong>{data.service_name || 'N/A'}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Start">
          <ClockCircleOutlined style={{ marginRight: '8px' }} />
          {formatDate(client.start)} at {formatTime(client.start)}
        </Descriptions.Item>

        <Descriptions.Item label="End">
          <ClockCircleOutlined style={{ marginRight: '8px' }} />
          {formatDate(client.end)} at {formatTime(client.end)}
        </Descriptions.Item>

        <Descriptions.Item label="Duration" span={2}>
          <strong>{getDuration(client.start, client.end)}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Payment Status">
          {data.payment_status === 'paid' ? (
            <Tag color="success">Paid</Tag>
          ) : data.payment_status === 'pending' ? (
            <Tag color="warning">Pending</Tag>
          ) : (
            <Tag color="default">{data.payment_status || 'Unknown'}</Tag>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Total Amount">
          <DollarOutlined style={{ marginRight: '8px', color: '#13c2c2' }} />
          <strong style={{ fontSize: '16px' }}>{formatCurrency(data.total_amount)}</strong>
        </Descriptions.Item>

        {data.notes && (
          <Descriptions.Item label="Notes" span={2}>
            {data.notes}
          </Descriptions.Item>
        )}

        {data.created_at && (
          <Descriptions.Item label="Booked On" span={2}>
            {formatDate(data.created_at)} at {formatTime(data.created_at)}
          </Descriptions.Item>
        )}
      </Descriptions>

      {/* Actions Section */}
      {!isCancelled && (
        <>
          <Divider>Actions</Divider>

          {/* Refund Section */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            marginBottom: '16px',
          }}>
            <h4 style={{ marginBottom: '12px' }}>
              <DollarOutlined style={{ marginRight: '8px' }} />
              Process Refund
            </h4>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                type="number"
                placeholder="Enter refund amount"
                prefix={<DollarOutlined />}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                style={{ width: '250px' }}
                max={data.total_amount}
                min={0}
                step={0.01}
              />
              <Popconfirm
                title="Process refund?"
                description={`Refund ${formatCurrency(refundAmount || 0)} to this client?`}
                onConfirm={handleRefund}
                okText="Yes"
                cancelText="No"
                disabled={!refundAmount}
              >
                <Button
                  icon={<DollarOutlined />}
                  loading={loading}
                  disabled={!refundAmount}
                  type="primary"
                >
                  Process Refund
                </Button>
              </Popconfirm>
            </Space>
          </div>

          {/* Cancellation Section */}
          <div style={{
            padding: '16px',
            backgroundColor: '#fff2f0',
            borderRadius: '8px',
            border: '1px solid #ffccc7',
          }}>
            <h4 style={{ marginBottom: '12px', color: '#cf1322' }}>
              <CloseCircleOutlined style={{ marginRight: '8px' }} />
              Cancel Reservation
            </h4>
            <Space direction="vertical" style={{ width: '100%' }}>
              <TextArea
                placeholder="Enter cancellation reason..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={3}
                maxLength={500}
                showCount
              />
              <Popconfirm
                title="Cancel this reservation?"
                description="This action cannot be undone. Continue?"
                onConfirm={handleCancel}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  loading={loading}
                  disabled={!cancellationReason.trim()}
                >
                  Cancel Reservation
                </Button>
              </Popconfirm>
            </Space>
          </div>
        </>
      )}
    </Modal>
  );
}

export default ClientDetailsModal;
