/**
 * Add Passenger Modal - Add a new passenger to an existing reservation
 */
import React from 'react';
import { Modal, Button, Form, Input, InputNumber, Select, Divider, message } from 'antd';

const AddPassengerModal = ({
  visible,
  onClose,
  onAdd,
  loading,
}) => {
  const [form] = Form.useForm();

  const addOnOptions = [
    'Life Jacket',
    'Snacks',
    'Drinks Package',
    'Camera Rental',
    'Photography',
    'Premium Drinks',
    'Special Cake',
  ];

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      onAdd(values);
      form.resetFields();
    } catch (error) {
      message.error('Please fill all required fields correctly');
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Add Passenger to Reservation"
      open={visible}
      onCancel={handleClose}
      width={typeof window !== 'undefined' && window.innerWidth <= 768 ? '95%' : 600}
      wrapClassName="mobile-modal"
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button 
          key="add" 
          type="primary" 
          onClick={handleAdd}
          loading={loading}
        >
          Add Passenger
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: '16px' }}
      >
        <Form.Item
          label="Passenger Name"
          name="name"
          rules={[{ required: true, message: 'Please enter passenger name' }]}
        >
          <Input placeholder="e.g. Jane Doe" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="passenger@example.com" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input placeholder="+1 (555) 123-4567" />
        </Form.Item>

        <Divider />

        <Form.Item
          label="Number of People"
          name="numPeople"
          initialValue={1}
          rules={[{ required: true, message: 'Please enter number of people' }]}
        >
          <InputNumber min={1} max={20} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Price per Person ($)"
          name="price"
          initialValue={50}
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber min={0} step={0.01} precision={2} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Add-ons"
          name="addOns"
          initialValue={[]}
        >
          <Select
            mode="multiple"
            placeholder="Select add-ons (optional)"
            options={addOnOptions.map(addon => ({
              label: addon,
              value: addon,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Special Requests"
          name="specialRequest"
          initialValue=""
        >
          <Input.TextArea
            placeholder="Any special requests or notes..."
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPassengerModal;
