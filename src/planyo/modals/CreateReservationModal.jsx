/**
 * Create Reservation Modal - Add new boat reservations
 */
import React from 'react';
import { Modal, Button, Form, Input, DatePicker, TimePicker, InputNumber, Select, Tag, Divider, message } from 'antd';
import dayjs from 'dayjs';

const CreateReservationModal = ({
  visible,
  onClose,
  onCreate,
  loading,
}) => {
  const [form] = Form.useForm();
  const [endTimeWarning, setEndTimeWarning] = React.useState(false);

  const boatOptions = [
    { value: 'small-1', label: 'Small Boat 1 (2 hrs)', price: 450 },
    { value: 'small-2', label: 'Small Boat 2 (2 hrs)', price: 450 },
    { value: 'big-1', label: 'Big Boat 1 (10 ppl)', price: 'varies' },
    { value: 'big-2', label: 'Big Boat 2 (12 ppl)', price: 'varies' },
  ];

  const addOnOptions = [
    'Life Jacket',
    'Snacks',
    'Drinks Package',
    'Camera Rental',
    'Photography',
    'Premium Drinks',
    'Special Cake',
  ];

  const handleEndTimeChange = (endTime) => {
    const startTime = form.getFieldValue('startTime');
    if (startTime && endTime && !endTime.isAfter(startTime)) {
      setEndTimeWarning(true);
    } else {
      setEndTimeWarning(false);
    }
  };

  const handleStartTimeChange = (startTime) => {
    const endTime = form.getFieldValue('endTime');
    if (endTime && startTime && !endTime.isAfter(startTime)) {
      setEndTimeWarning(true);
    } else {
      setEndTimeWarning(false);
    }
  };

  const handleCreate = async () => {
    try {
      console.log('Before validation, form values:', form.getFieldsValue());
      const values = await form.validateFields();
      console.log('After validation, form values:', values);
      
      if (!values.date || !values.startTime || !values.endTime) {
        message.error('Please select date and times');
        return;
      }

      if (values.endTime && values.startTime && !values.endTime.isAfter(values.startTime)) {
        message.error('End time must be after start time');
        return;
      }

      onCreate(values);
      form.resetFields();
      setEndTimeWarning(false);
    } catch (error) {
      console.error('Form validation error object:', error);
      // Extract first error message from errorFields
      if (error.errorFields && error.errorFields.length > 0) {
        const firstError = error.errorFields[0];
        const fieldName = firstError.name.join('.');
        const errorMsg = firstError.errors[0] || 'Invalid value';
        console.warn(`Field "${fieldName}" failed validation: ${errorMsg}`);
        message.error(`${fieldName}: ${errorMsg}`);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Please fill all required fields correctly');
      }
    }
  };

  const handleClose = () => {
    form.resetFields();
    setEndTimeWarning(false);
    onClose();
  };

  return (
    <Modal
      title="Create New Reservation"
      open={visible}
      onCancel={handleClose}
      width={typeof window !== 'undefined' && window.innerWidth <= 768 ? '95%' : 700}
      wrapClassName="mobile-modal"
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button 
          key="create" 
          type="primary" 
          onClick={handleCreate}
          loading={loading}
          disabled={endTimeWarning}
        >
          Create Reservation
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: '16px' }}
        initialValues={{
          numPeople: 1,
          price: 50,
          addOns: [],
          specialRequest: '',
        }}
      >
        {/* Boat Selection */}
        <Form.Item
          label="Select Boat"
          name="boatId"
          rules={[{ required: true, message: 'Please select a boat' }]}
        >
          <Select
            placeholder="Choose a boat"
            options={boatOptions.map(boat => ({
              label: boat.label,
              value: boat.value,
            }))}
          />
        </Form.Item>

        <Divider />

        {/* Date and Time Selection */}
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>

        <Form.Item
          label="Start Time"
          name="startTime"
          rules={[{ required: true, message: 'Please select start time' }]}
        >
          <TimePicker
            format="h:mm A"
            use12Hours
            style={{ width: '100%' }}
            onChange={handleStartTimeChange}
          />
        </Form.Item>

        <Form.Item
          label="End Time"
          name="endTime"
          rules={[{ required: true, message: 'Please select end time' }]}
        >
          <TimePicker
            format="h:mm A"
            use12Hours
            style={{ width: '100%' }}
            onChange={handleEndTimeChange}
          />
        </Form.Item>

        {endTimeWarning && (
          <div style={{ padding: '12px', backgroundColor: '#fff2e8', border: '1px solid #ffbb96', borderRadius: '4px', marginBottom: '12px' }}>
            <div style={{ color: '#ff7a45', fontWeight: 'bold' }}>⚠ Warning</div>
            <div style={{ color: '#ff7a45', fontSize: '12px', marginTop: '4px' }}>
              End time must be after start time
            </div>
          </div>
        )}

        <Divider />

        {/* Client Information */}
        <Form.Item
          label="Customer Name"
          name="customerName"
          rules={[{ required: true, message: 'Please enter customer name' }]}
        >
          <Input placeholder="e.g. John Smith" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            {
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          ]}
        >
          <Input placeholder="customer@example.com" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input placeholder="+1 (555) 123-4567" />
        </Form.Item>

        <Divider />

        {/* Booking Details */}
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
          <InputNumber min={0.01} step={0.01} precision={2} style={{ width: '100%' }} />
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

export default CreateReservationModal;
