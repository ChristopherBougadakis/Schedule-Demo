/**
 * ReservationPopup Component
 * Displays list of all clients/reservations for a specific service and date
 */

import React from 'react';
import { Modal, List, Tag, Avatar, Typography, Space, Divider } from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { formatTime, formatCurrency, getStatusLabel } from '../utils/dataMapper';

const { Text, Title } = Typography;

function ReservationPopup({ visible, reservations, onClose, onClientClick }) {
  if (!reservations || reservations.length === 0) {
    return null;
  }

  // Get service name and date from first reservation
  const serviceName = reservations[0]?.planyoData?.service_name || 'Service';
  const date = new Date(reservations[0]?.start).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate summary statistics
  const totalAmount = reservations.reduce(
    (sum, r) => sum + (r.planyoData?.total_amount || 0),
    0
  );
  const checkedInCount = reservations.filter(r => r.planyoData?.checked_in).length;

  return (
    <Modal
      title={
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {serviceName}
          </Title>
          <Text type="secondary">{date}</Text>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
      bodyStyle={{ maxHeight: '70vh', overflow: 'auto', padding: '16px' }}
    >
      {/* Summary Section */}
      <div style={{
        background: '#f5f5f5',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
      }}>
        <Space split={<Divider type="vertical" />} size="large">
          <div>
            <Text type="secondary">Total Reservations</Text>
            <br />
            <Text strong style={{ fontSize: '20px' }}>{reservations.length}</Text>
          </div>
          <div>
            <Text type="secondary">Checked In</Text>
            <br />
            <Text strong style={{ fontSize: '20px', color: '#52c41a' }}>
              {checkedInCount}
            </Text>
          </div>
          <div>
            <Text type="secondary">Total Revenue</Text>
            <br />
            <Text strong style={{ fontSize: '20px', color: '#1890ff' }}>
              {formatCurrency(totalAmount)}
            </Text>
          </div>
        </Space>
      </div>

      {/* Reservations List */}
      <List
        itemLayout="horizontal"
        dataSource={reservations}
        renderItem={reservation => {
          const client = reservation.planyoData;
          const isCheckedIn = client.checked_in;
          const isCancelled = client.cancelled;
          const isCheckedOut = client.checked_out;

          let statusIcon = <ClockCircleOutlined />;
          let statusColor = 'warning';
          let statusText = 'Pending';

          if (isCancelled) {
            statusIcon = <CloseCircleOutlined />;
            statusColor = 'error';
            statusText = 'Cancelled';
          } else if (isCheckedOut) {
            statusIcon = <CheckCircleOutlined />;
            statusColor = 'default';
            statusText = 'Checked Out';
          } else if (isCheckedIn) {
            statusIcon = <CheckCircleOutlined />;
            statusColor = 'success';
            statusText = 'Checked In';
          }

          return (
            <List.Item
              onClick={() => onClientClick(reservation)}
              style={{
                cursor: 'pointer',
                padding: '16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                border: '1px solid transparent',
                marginBottom: '8px',
              }}
              className="reservation-list-item"
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<UserOutlined />}
                    size={56}
                    style={{
                      backgroundColor: isCheckedIn ? '#52c41a' : '#1890ff',
                    }}
                  />
                }
                title={
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <Text strong style={{ fontSize: '16px' }}>
                      {reservation.title}
                    </Text>
                    <Tag icon={statusIcon} color={statusColor}>
                      {statusText}
                    </Tag>
                  </div>
                }
                description={
                  <div style={{ marginTop: '8px' }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      {client.client_email && (
                        <div>
                          <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                          <Text>{client.client_email}</Text>
                        </div>
                      )}
                      {client.client_phone && (
                        <div>
                          <PhoneOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                          <Text>{client.client_phone}</Text>
                        </div>
                      )}
                      {client.client_country && (
                        <div>
                          <GlobalOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                          <Text>{client.client_country}</Text>
                        </div>
                      )}
                      <div>
                        <ClockCircleOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
                        <Text>
                          {formatTime(reservation.start)} - {formatTime(reservation.end)}
                        </Text>
                      </div>
                      {client.total_amount > 0 && (
                        <div>
                          <DollarOutlined style={{ marginRight: '8px', color: '#13c2c2' }} />
                          <Text strong>{formatCurrency(client.total_amount)}</Text>
                        </div>
                      )}
                    </Space>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />

      <style jsx>{`
        .reservation-list-item:hover {
          background-color: #f0f5ff;
          border-color: #1890ff !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
    </Modal>
  );
}

export default ReservationPopup;
