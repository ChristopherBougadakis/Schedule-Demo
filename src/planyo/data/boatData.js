/**
 * Boat Resources and Dummy Events Data
 */

// Create dummy boat resources
export const createBoatResources = () => {
  return [
    {
      id: 'small-1',
      name: 'Small Boat 1 (2 hrs)',
      groupId: 'small-boats',
    },
    {
      id: 'small-2',
      name: 'Small Boat 2 (2 hrs)',
      groupId: 'small-boats',
    },
    {
      id: 'big-1',
      name: 'Big Boat 1 (10 ppl)',
      groupId: 'big-boats',
    },
    {
      id: 'big-2',
      name: 'Big Boat 2 (12 ppl)',
      groupId: 'big-boats',
    },
  ];
};

// Create dummy data for first week of January - boat trip bookings
export const createDummyEvents = () => {
  return [
    {
      id: 1,
      title: 'John Smith - 2hrs',
      start: new Date(2026, 0, 1, 9, 0),
      end: new Date(2026, 0, 1, 11, 0),
      resourceId: 'small-1',
      bgColor: '#FF6B6B',
      boatType: 'small',
      checkedIn: false,
    },
    {
      id: 2,
      title: 'Group Outing - 8 ppl',
      start: new Date(2026, 0, 1, 10, 0),
      end: new Date(2026, 0, 1, 13, 0),
      resourceId: 'big-1',
      bgColor: '#4ECDC4',
      boatType: 'big',
      passengers: [
        { id: 'p1', name: 'Alice Johnson', checkedIn: true, phone: '+1 (555) 111-2222', email: 'alice@example.com', addOns: ['Life Jacket', 'Snacks'], specialRequest: 'Vegetarian meal', price: 45.00, numPeople: 1 },
        { id: 'p2', name: 'Bob Wilson', checkedIn: true, phone: '+1 (555) 222-3333', email: 'bob@example.com', addOns: ['Camera Rental'], specialRequest: 'None', price: 50.00, numPeople: 2 },
        { id: 'p3', name: 'Carol Davis', checkedIn: false, phone: '+1 (555) 333-4444', email: 'carol@example.com', addOns: [], specialRequest: 'Wheelchair accessible', price: 45.00, numPeople: 1 },
        { id: 'p4', name: 'David Miller', checkedIn: true, phone: '+1 (555) 444-5555', email: 'david@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 55.00, numPeople: 1 },
        { id: 'p5', name: 'Emma Taylor', checkedIn: false, phone: '+1 (555) 555-6666', email: 'emma@example.com', addOns: ['Life Jacket', 'Drinks Package'], specialRequest: 'Allergy: Shellfish', price: 70.00, numPeople: 1 },
        { id: 'p6', name: 'Frank Anderson', checkedIn: true, phone: '+1 (555) 666-7777', email: 'frank@example.com', addOns: [], specialRequest: 'None', price: 45.00, numPeople: 1 },
        { id: 'p7', name: 'Grace Lee', checkedIn: true, phone: '+1 (555) 777-8888', email: 'grace@example.com', addOns: ['Snacks', 'Photography'], specialRequest: 'Birthday celebration', price: 65.00, numPeople: 3 },
        { id: 'p8', name: 'Henry Brown', checkedIn: false, phone: '+1 (555) 888-9999', email: 'henry@example.com', addOns: ['Camera Rental'], specialRequest: 'None', price: 50.00, numPeople: 1 },
      ]
    },
    {
      id: 3,
      title: 'Maria Garcia - 2hrs',
      start: new Date(2026, 0, 1, 13, 0),
      end: new Date(2026, 0, 1, 15, 0),
      resourceId: 'small-2',
      bgColor: '#FFE66D',
      boatType: 'small',
      checkedIn: false,
    },
    {
      id: 4,
      title: 'Corporate Event - 10 ppl',
      start: new Date(2026, 0, 2, 9, 0),
      end: new Date(2026, 0, 2, 12, 30),
      resourceId: 'big-2',
      bgColor: '#95E1D3',
      boatType: 'big',
      passengers: [
        { id: 'p1', name: 'John Executive', checkedIn: true, phone: '+1 (555) 100-1111', email: 'john@company.com', addOns: ['Drinks Package'], specialRequest: 'VIP seating', price: 75.00, numPeople: 1 },
        { id: 'p2', name: 'Sarah Manager', checkedIn: true, phone: '+1 (555) 200-2222', email: 'sarah@company.com', addOns: [], specialRequest: 'None', price: 65.00, numPeople: 1 },
        { id: 'p3', name: 'Tom Developer', checkedIn: false, phone: '+1 (555) 300-3333', email: 'tom@company.com', addOns: ['Camera Rental'], specialRequest: 'Professional photography', price: 80.00, numPeople: 1 },
        { id: 'p4', name: 'Lisa Designer', checkedIn: true, phone: '+1 (555) 400-4444', email: 'lisa@company.com', addOns: ['Snacks'], specialRequest: 'None', price: 60.00, numPeople: 1 },
        { id: 'p5', name: 'Mike Engineer', checkedIn: true, phone: '+1 (555) 500-5555', email: 'mike@company.com', addOns: [], specialRequest: 'None', price: 65.00, numPeople: 2 },
        { id: 'p6', name: 'Jenny Analyst', checkedIn: false, phone: '+1 (555) 600-6666', email: 'jenny@company.com', addOns: ['Life Jacket', 'Drinks Package'], specialRequest: 'Gluten-free meal', price: 80.00, numPeople: 1 },
        { id: 'p7', name: 'Chris Sales', checkedIn: true, phone: '+1 (555) 700-7777', email: 'chris@company.com', addOns: ['Photography'], specialRequest: 'None', price: 70.00, numPeople: 1 },
        { id: 'p8', name: 'Rachel HR', checkedIn: true, phone: '+1 (555) 800-8888', email: 'rachel@company.com', addOns: [], specialRequest: 'None', price: 65.00, numPeople: 1 },
        { id: 'p9', name: 'Paul IT', checkedIn: false, phone: '+1 (555) 900-9999', email: 'paul@company.com', addOns: ['Drinks Package', 'Snacks'], specialRequest: 'None', price: 75.00, numPeople: 1 },
        { id: 'p10', name: 'Susan Marketing', checkedIn: true, phone: '+1 (555) 910-1010', email: 'susan@company.com', addOns: [], specialRequest: 'Early boarding', price: 65.00, numPeople: 1 },
      ]
    },
    {
      id: 5,
      title: 'Sarah Chen - 3hrs',
      start: new Date(2026, 0, 2, 14, 0),
      end: new Date(2026, 0, 2, 17, 0),
      resourceId: 'small-1',
      bgColor: '#F38181',
      boatType: 'small',
      checkedIn: false,
    },
    {
      id: 6,
      title: 'Family Trip - 6 ppl',
      start: new Date(2026, 0, 3, 10, 0),
      end: new Date(2026, 0, 3, 13, 0),
      resourceId: 'big-1',
      bgColor: '#AA96DA',
      boatType: 'big',
      passengers: [
        { id: 'p1', name: 'John Family', checkedIn: true, phone: '+1 (555) 001-2222', email: 'john.family@example.com', addOns: ['Life Jacket'], specialRequest: 'None', price: 60.00, numPeople: 1 },
        { id: 'p2', name: 'Mary Family', checkedIn: true, phone: '+1 (555) 001-3333', email: 'mary.family@example.com', addOns: [], specialRequest: 'None', price: 55.00, numPeople: 1 },
        { id: 'p3', name: 'Tommy Family', checkedIn: true, phone: '+1 (555) 001-4444', email: 'tommy@example.com', addOns: ['Life Jacket', 'Snacks'], specialRequest: 'Children meal', price: 50.00, numPeople: 1 },
        { id: 'p4', name: 'Lucy Family', checkedIn: false, phone: '+1 (555) 001-5555', email: 'lucy@example.com', addOns: ['Life Jacket'], specialRequest: 'None', price: 50.00, numPeople: 1 },
        { id: 'p5', name: 'Grandpa', checkedIn: true, phone: '+1 (555) 001-6666', email: 'grandpa@example.com', addOns: ['Wheelchair accessible'], specialRequest: 'Mobility assistance', price: 65.00, numPeople: 1 },
        { id: 'p6', name: 'Grandma', checkedIn: true, phone: '+1 (555) 001-7777', email: 'grandma@example.com', addOns: [], specialRequest: 'None', price: 55.00, numPeople: 1 },
      ]
    },
    {
      id: 7,
      title: 'Michael Brown - 2hrs',
      start: new Date(2026, 0, 3, 15, 0),
      end: new Date(2026, 0, 3, 17, 0),
      resourceId: 'small-2',
      bgColor: '#FCBAD3',
      boatType: 'small',
      checkedIn: false,
    },
    {
      id: 8,
      title: 'Wedding Party - 12 ppl',
      start: new Date(2026, 0, 5, 11, 0),
      end: new Date(2026, 0, 5, 14, 30),
      resourceId: 'big-2',
      bgColor: '#A8D8EA',
      boatType: 'big',
      passengers: [
        { id: 'p1', name: 'Bride', checkedIn: true, phone: '+1 (555) 500-1000', email: 'bride@example.com', addOns: ['Premium Drinks', 'Photography', 'Special Cake'], specialRequest: 'Wedding ceremony', price: 150.00, numPeople: 1 },
        { id: 'p2', name: 'Groom', checkedIn: true, phone: '+1 (555) 500-2000', email: 'groom@example.com', addOns: ['Premium Drinks', 'Photography'], specialRequest: 'None', price: 150.00, numPeople: 1 },
        { id: 'p3', name: 'Best Man', checkedIn: true, phone: '+1 (555) 500-3000', email: 'bestman@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 80.00, numPeople: 1 },
        { id: 'p4', name: 'Maid of Honor', checkedIn: false, phone: '+1 (555) 500-4000', email: 'maidofhonor@example.com', addOns: ['Drinks Package'], specialRequest: 'Vegetarian meal', price: 80.00, numPeople: 1 },
        { id: 'p5', name: 'Guest 1', checkedIn: true, phone: '+1 (555) 500-5000', email: 'guest1@example.com', addOns: [], specialRequest: 'None', price: 70.00, numPeople: 1 },
        { id: 'p6', name: 'Guest 2', checkedIn: true, phone: '+1 (555) 500-6000', email: 'guest2@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 80.00, numPeople: 1 },
        { id: 'p7', name: 'Guest 3', checkedIn: true, phone: '+1 (555) 500-7000', email: 'guest3@example.com', addOns: [], specialRequest: 'None', price: 70.00, numPeople: 1 },
        { id: 'p8', name: 'Guest 4', checkedIn: false, phone: '+1 (555) 500-8000', email: 'guest4@example.com', addOns: ['Life Jacket'], specialRequest: 'Non-swimmer', price: 75.00, numPeople: 2 },
        { id: 'p9', name: 'Guest 5', checkedIn: true, phone: '+1 (555) 500-9000', email: 'guest5@example.com', addOns: [], specialRequest: 'None', price: 70.00, numPeople: 1 },
        { id: 'p10', name: 'Guest 6', checkedIn: true, phone: '+1 (555) 500-1001', email: 'guest6@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 80.00, numPeople: 1 },
        { id: 'p11', name: 'Guest 7', checkedIn: false, phone: '+1 (555) 500-1002', email: 'guest7@example.com', addOns: ['Life Jacket'], specialRequest: 'Mobility support', price: 75.00, numPeople: 1 },
        { id: 'p12', name: 'Guest 8', checkedIn: true, phone: '+1 (555) 500-1003', email: 'guest8@example.com', addOns: [], specialRequest: 'None', price: 70.00, numPeople: 1 },
      ]
    },
    {
      id: 9,
      title: 'Emma Wilson - 2hrs',
      start: new Date(2026, 0, 5, 16, 0),
      end: new Date(2026, 0, 5, 18, 0),
      resourceId: 'small-1',
      bgColor: '#FF9999',
      boatType: 'small',
      checkedIn: false,
    },
    // Testing multiple bookings same boat same day
    {
      id: 10,
      title: 'Morning Rental - 2hrs',
      start: new Date(2026, 0, 1, 12, 0),
      end: new Date(2026, 0, 1, 14, 0),
      resourceId: 'small-1',
      bgColor: '#9B59B6',
      boatType: 'small',
      checkedIn: false,
    },
    {
      id: 11,
      title: 'Afternoon Rental - 2hrs',
      start: new Date(2026, 0, 1, 15, 0),
      end: new Date(2026, 0, 1, 17, 0),
      resourceId: 'small-1',
      bgColor: '#3498DB',
      boatType: 'small',
      checkedIn: false,
    },
    {
      id: 12,
      title: 'Evening Cruise - 2hrs',
      start: new Date(2026, 0, 1, 18, 0),
      end: new Date(2026, 0, 1, 20, 0),
      resourceId: 'small-1',
      bgColor: '#E74C3C',
      boatType: 'small',
      checkedIn: false,
    },
    // Multiple bookings on big boat same day
    {
      id: 13,
      title: 'Afternoon Tour - 4 ppl',
      start: new Date(2026, 0, 1, 14, 0),
      end: new Date(2026, 0, 1, 17, 0),
      resourceId: 'big-1',
      bgColor: '#F39C12',
      boatType: 'big',
      passengers: [
        { id: 'p1', name: 'Alex Brown', checkedIn: false, phone: '+1 (555) 700-1000', email: 'alex@example.com', addOns: ['Life Jacket'], specialRequest: 'None', price: 60.00, numPeople: 1 },
        { id: 'p2', name: 'Beth Green', checkedIn: false, phone: '+1 (555) 700-2000', email: 'beth@example.com', addOns: [], specialRequest: 'None', price: 55.00, numPeople: 1 },
        { id: 'p3', name: 'Charlie White', checkedIn: false, phone: '+1 (555) 700-3000', email: 'charlie@example.com', addOns: ['Drinks Package'], specialRequest: 'None', price: 65.00, numPeople: 1 },
        { id: 'p4', name: 'Diana Black', checkedIn: false, phone: '+1 (555) 700-4000', email: 'diana@example.com', addOns: [], specialRequest: 'None', price: 55.00, numPeople: 1 },
      ]
    },
  ];
};
