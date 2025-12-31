# Boat Trip Booking Scheduler

A boat trip booking and management system built with React and react-big-schedule.

## Features

- **Day/Week/Month Views** - Switch between different time views
- **Small Boat Rentals** - Hourly bookings with single customer management
- **Big Boat Trips** - Group bookings with passenger list management
- **Check-in System** - Track passenger check-ins with visual status indicators
- **Refund Management** - Individual passenger or full booking refunds
- **Passenger Management** - Add-ons, special requests, pricing per passenger
- **Double-Action Confirmations** - Safety confirmations for destructive actions

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view the scheduler.

## Project Structure

```
src/
├── planyo/                    # Boat booking app
│   ├── App.jsx               # Main app component
│   ├── index.html            # HTML template
│   └── components/
│       └── BookingScheduler.jsx  # Scheduler with booking logic
├── components/                # Scheduler library components
├── config/                    # Configuration files
├── css/                       # Styles
└── planyo-index.jsx          # App entry point
```

## Usage

### Small Boat Bookings
- Click on a small boat event to view booking details
- Check in customers
- Process refunds or cancel bookings

### Big Boat Bookings
- Click on a big boat event to view passenger list
- Click individual passengers to manage their details
- Track check-ins, refunds, and special requests per passenger
- View add-ons and pricing for each passenger

## Technologies

- React 18.3.1
- react-big-schedule 5.1.0
- Ant Design 5.22.1
- react-dnd 14.0.5
- dayjs 1.11.13
- Webpack 5.103.0
