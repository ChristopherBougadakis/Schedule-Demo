# File Documentation - Complete Reference

This document provides detailed documentation for every file in the boat trip booking scheduler project.

## 📋 Table of Contents
- [Application Files](#application-files)
- [Scheduler Library Components](#scheduler-library-components)
- [Configuration Files](#configuration-files)
- [Utilities & Helpers](#utilities--helpers)
- [Build & Development Files](#build--development-files)

---

## 🚀 Application Files

### **`src/planyo-index.jsx`**
**Location**: `/src/planyo-index.jsx`  
**Type**: JavaScript/React Entry Point  
**Lines**: ~30

**Purpose**: Application entry point that bootstraps the entire boat booking application.

**Functionality**:
- Imports React and the main PlanyoApp component
- Sets up Ant Design ConfigProvider for theming and locale
- Renders the application into the DOM root element
- Provides error boundaries and fallback UI
- Initializes global styles and dependencies

**Key Exports**:
- None (entry point file)

**Dependencies**:
- React
- ReactDOM
- Ant Design (ConfigProvider)
- `./planyo/App.jsx`

**Usage**:
```javascript
// Webpack uses this as the entry point
// Defined in webpack.config.js: entry: './src/planyo-index.jsx'
```

---

### **`src/planyo/App.jsx`**
**Location**: `/src/planyo/App.jsx`  
**Type**: React Component  
**Lines**: ~20

**Purpose**: Main application wrapper component.

**Functionality**:
- Simple container component
- Renders the BookingScheduler component
- Provides a clean separation between app initialization and business logic
- Can be extended for routing, global state, or layout wrappers in the future

**Key Exports**:
- `default`: PlanyoApp component

**Dependencies**:
- React
- `./components/BookingScheduler.jsx`

**Component Structure**:
```jsx
function PlanyoApp() {
  return <BookingScheduler />;
}
```

---

### **`src/planyo/index.html`**
**Location**: `/src/planyo/index.html`  
**Type**: HTML Template  
**Lines**: ~15

**Purpose**: HTML template for webpack HtmlWebpackPlugin.

**Functionality**:
- Provides the base HTML structure
- Contains the root `<div id="root">` element for React mounting
- Sets viewport meta tags for responsive design
- Webpack automatically injects the compiled JavaScript bundle

**Template Structure**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Boat Booking Scheduler</title>
</head>
<body>
  <div id="root"></div>
  <!-- bundle.js injected here by webpack -->
</body>
</html>
```

---

### **`src/planyo/components/BookingScheduler.jsx`**
**Location**: `/src/planyo/components/BookingScheduler.jsx`  
**Type**: React Component (Main Business Logic)  
**Lines**: 733

**Purpose**: Core booking scheduler component containing all business logic for boat bookings, passenger management, and booking operations.

**Functionality**:

#### Data Management
- **`createBoatResources()`**: Creates 4 boat resources
  - 2 small boats (small-1, small-2)
  - 2 big boats (big-1, big-2)
  - Returns array of resource objects with id, name, and boat type

- **`createDummyEvents()`**: Generates 13 test bookings
  - Multiple bookings on same boat (testing overlap handling)
  - Small-1: 4 bookings on Jan 1 (9am, 12pm, 3pm, 6pm)
  - Big-1: 2 bookings on Jan 1 (10am with 8 passengers, 2pm with 4 passengers)
  - Realistic passenger data with names, contacts, add-ons, pricing

#### State Management
- **`schedulerDataRef`**: useRef holding SchedulerData instance
- **`selectedBooking`**: Currently selected event for modal display
- **`modalVisible`**: Controls big boat/small boat modal visibility
- **`selectedPassenger`**: Currently selected passenger for detail view
- **`passengerModalVisible`**: Controls individual passenger modal visibility
- **`pendingAction`**: Stores pending destructive action (type + data)
- **`confirmTimeout`**: Timeout reference for 3-second confirmation window
- **`forceUpdate`**: Custom counter to trigger re-renders

#### Event Handlers

**Booking Operations**:
- **`handleEventClick(event)`**: Opens modal based on boat type
  - Small boats: Opens single booking detail modal
  - Big boats: Opens passenger list modal

**Check-in Operations**:
- **`handleCheckIn()`**: Marks small boat booking as checked in
- **`handleCheckInPassenger(passengerId)`**: Checks in individual passenger on big boats

**Cancellation & Refunds**:
- **`handleCancelClick()`**: Initiates booking cancellation (double confirmation)
- **`handleRefund()`**: Processes full booking refund (double confirmation)
- **`handleRefundPassenger(passengerId)`**: Refunds individual passenger (double confirmation)

**Passenger Management**:
- **`handlePassengerClick(passenger)`**: Opens individual passenger detail modal
- **`handleRemovePassenger(passengerId)`**: Removes passenger from booking (double confirmation)

**Safety Mechanisms**:
- **`setPendingAction(action)`**: Starts 3-second confirmation window
  - Stores action type and data
  - Sets auto-cancel timeout
  - Updates button text to show confirmation prompt
- **`clearPendingAction()`**: Cancels pending action and clears timeout

**Status Updates**:
- **`updateEventStatus(eventId, status)`**: Updates event appearance
  - `'cancelled'`: Removes event from scheduler completely
  - `'refunded'`: Changes bgColor to gray, adds [REFUNDED] prefix to title
  - Calls forceUpdate() to trigger re-render

#### Data Structures

**Passenger Object**:
```javascript
{
  id: number,              // Unique passenger ID
  name: string,            // Full name
  checkedIn: boolean,      // Check-in status
  phone: string,           // Contact number
  email: string,           // Email address
  addOns: string[],        // Array of add-on items (e.g., ["Life Jacket", "Snorkeling Gear"])
  specialRequest: string,  // Special requirements/notes
  price: number            // Amount paid by this passenger
}
```

**Event Object**:
```javascript
{
  id: number,                    // Unique booking ID
  title: string,                 // Display title (e.g., "John Doe - Small Boat Rental")
  start: string,                 // ISO date string (start time)
  end: string,                   // ISO date string (end time)
  resourceId: string,            // Boat ID (small-1, small-2, big-1, big-2)
  bgColor: string,               // Event background color
  customerName: string,          // Primary customer name
  customerPhone: string,         // Contact phone
  customerEmail: string,         // Contact email
  checkedIn: boolean,            // Overall check-in status (for small boats)
  passengers: Passenger[],       // Array of passengers (for big boats only)
  eventStatus: 'active' | 'cancelled' | 'refunded'  // Current status
}
```

#### Modal System

**Three Modal Types**:

1. **Small Boat Modal**: Single booking details
   - Customer information
   - Booking time and duration
   - Check-in button
   - Cancel/Refund actions

2. **Big Boat Modal**: Passenger list
   - Shows all passengers in a list
   - Individual passenger cards with check-in status
   - Click passenger to open detail modal
   - Full booking Cancel/Refund actions

3. **Passenger Detail Modal**: Individual passenger information
   - Personal details (name, phone, email)
   - Add-ons list
   - Special requests
   - Price paid
   - Individual actions (Check In, Refund, Remove)

**Modal Behavior**:
- Modals persist after actions (don't auto-close)
- Only explicit "Close" button closes modals
- Opening passenger modal auto-closes big boat modal (prevents stacking)

#### Double-Action Confirmation Pattern

All destructive operations require two clicks within 3 seconds:

**Flow**:
1. First click: Sets pending action, starts 3-second timer
2. Button text changes to "Click Again to Confirm"
3. Second click within 3 seconds: Executes action
4. If 3 seconds pass: Action auto-cancels, button resets

**Protected Actions**:
- Cancel booking
- Refund booking
- Remove passenger
- Refund individual passenger

#### Visual Feedback

**Event Status Colors**:
- Active bookings: Blue (`#4A90E2`)
- Refunded bookings: Gray (`#999999`)
- Cancelled bookings: Removed from display

**Event Title Prefixes**:
- Refunded: `[REFUNDED] Customer Name - Boat Type`
- Active: `Customer Name - Boat Type`

**Key Dependencies**:
- React (useState, useRef)
- react-big-schedule (Scheduler, SchedulerData, ViewType)
- react-dnd (DndProvider, HTML5Backend)
- Ant Design (Modal, Button, Descriptions, Tag, Divider, message, Input, List)
- dayjs (date formatting)

**Key Exports**:
- `default`: BookingScheduler component

---

## 📚 Scheduler Library Components

### **`src/components/index.jsx`**
**Location**: `/src/components/index.jsx`  
**Type**: Module Export File  
**Purpose**: Main export file for the react-big-schedule library.

**Exports**:
- `default`: Scheduler component (main scheduler UI)
- `SchedulerData`: Data management class
- `ViewType`: Constants for view types (Day, Week, Month)
- `DemoData`: Empty object placeholder (original sample data removed)

**Usage**:
```javascript
import Scheduler, { SchedulerData, ViewType } from './components';
```

---

### **`src/components/SchedulerData.js`**
**Location**: `/src/components/SchedulerData.js`  
**Type**: JavaScript Class  
**Lines**: ~1000+

**Purpose**: Core data management class for the scheduler.

**Functionality**:
- **State Management**: Stores and manages all scheduler state
- **Configuration**: Holds scheduler settings (view type, date range, colors, etc.)
- **Resource Management**: Add, update, remove resources (boats)
- **Event Management**: Add, update, remove, move events (bookings)
- **View Calculations**: Calculates time slots, header cells, event positions
- **Date Navigation**: Methods for moving between dates (next/prev/today)
- **Conflict Detection**: Checks for overlapping events
- **Drag-Drop State**: Manages drag-drop operations

**Key Methods**:
```javascript
// View management
setViewType(viewType)
setDate(date)
next() / prev() / today()

// Resource operations
setResources(resources)
addResource(resource)
removeResource(resourceId)

// Event operations
setEvents(events)
addEvent(event)
updateEvent(event)
removeEvent(eventId)
moveEvent(event, resourceId, start, end)

// Calculations
getSlotById(slotId)
getEventById(eventId)
isEventInTimeWindow(event)
```

**Configuration Options**:
- `viewType`: Day, Week, Month
- `showAgenda`: Enable agenda view
- `isEventPerspective`: Event-centric vs resource-centric
- `config`: Detailed configuration object
- `localeMoment`: Date formatting locale
- `resources`: Array of resource objects
- `events`: Array of event objects
- `behaviors`: Behavior customization functions

---

### **`src/components/HeaderView.jsx`**
**Location**: `/src/components/HeaderView.jsx`  
**Type**: React Component  

**Purpose**: Renders the top header row with date/time labels.

**Functionality**:
- Displays time slots for Day view (e.g., 9:00 AM, 10:00 AM, ...)
- Displays dates for Week view (e.g., Mon 1, Tue 2, ...)
- Displays week numbers for Month view
- Handles header cell click events
- Supports custom header rendering via props

**Props**:
- `schedulerData`: SchedulerData instance
- `onViewChange`: Callback for view changes
- `onSelectDate`: Callback for date selection

**Rendered Elements**:
- Time slot headers with labels
- Date headers with formatting
- Custom header content (if provided)

---

### **`src/components/BodyView.jsx`**
**Location**: `/src/components/BodyView.jsx`  
**Type**: React Component  

**Purpose**: Renders the main scheduler body with events.

**Functionality**:
- Displays all resources as rows
- Renders ResourceEvents for each resource
- Handles click events on empty time slots (new event creation)
- Manages scroll synchronization with header
- Supports drag-to-create new events
- Handles drop zone for moving events

**Props**:
- `schedulerData`: SchedulerData instance
- `onEventClick`: Event click handler
- `newEvent`: Callback for creating new events
- `moveEvent`: Callback for moving events
- `eventItemClick`: Custom event click handler
- `eventItemTemplateResolver`: Custom event rendering

**Child Components**:
- ResourceEvents (one per resource row)

---

### **`src/components/ResourceView.jsx`**
**Location**: `/src/components/ResourceView.jsx`  
**Type**: React Component  

**Purpose**: Renders the left sidebar with resource names.

**Functionality**:
- Displays resource list (boat names)
- Shows resource-specific information
- Handles resource click events
- Supports custom resource rendering
- Provides visual indicators for selection
- Scrolls synchronously with BodyView

**Props**:
- `schedulerData`: SchedulerData instance
- `resourceClickedFunc`: Callback for resource clicks
- `slotClickedFunc`: Callback for resource slot clicks
- `slotItemTemplateResolver`: Custom resource rendering

**Rendered Elements**:
- Resource names (e.g., "Small Boat 1", "Big Boat 1")
- Custom resource content
- Selection indicators

---

### **`src/components/ResourceEvents.jsx`**
**Location**: `/src/components/ResourceEvents.jsx`  
**Type**: React Component  

**Purpose**: Renders all events for a single resource (row).

**Functionality**:
- Positions events within the timeline
- Handles overlapping events (multiple bookings same day)
- Calculates event widths and positions
- Renders EventItem components
- Manages event collision detection
- Shows "+X more" indicator when events overflow

**Props**:
- `schedulerData`: SchedulerData instance
- `resource`: Resource object (boat)
- `onEventClick`: Event click handler
- `eventItemClick`: Custom event handler
- `eventItemTemplateResolver`: Custom event rendering

**Layout Algorithm**:
- Calculates horizontal position based on start time
- Calculates width based on duration
- Stacks overlapping events vertically
- Collapses overflow events into "+X more"

---

### **`src/components/EventItem.jsx`**
**Location**: `/src/components/EventItem.jsx`  
**Type**: React Component  

**Purpose**: Renders individual event blocks on the scheduler.

**Functionality**:
- Displays event as colored block with title
- Handles event click to open details
- Supports drag-and-drop for rescheduling
- Shows visual states (normal, selected, refunded)
- Truncates long titles with ellipsis
- Applies event background color

**Props**:
- `schedulerData`: SchedulerData instance
- `event`: Event object
- `isDragging`: Drag state flag
- `connectDragSource`: react-dnd drag connector
- `connectDragPreview`: Drag preview connector
- `eventItemClick`: Click handler
- `eventItemTemplateResolver`: Custom rendering

**Visual States**:
- Normal: Blue background, black text
- Selected: Highlighted border
- Refunded: Gray background, [REFUNDED] prefix
- Dragging: Semi-transparent

**Event Structure**:
```jsx
<div
  className="event-item"
  style={{ backgroundColor: event.bgColor }}
  onClick={handleClick}
>
  {event.title}
</div>
```

---

### **`src/components/EventItemPopover.jsx`**
**Location**: `/src/components/EventItemPopover.jsx`  
**Type**: React Component  

**Purpose**: Shows tooltip/popover on event hover.

**Functionality**:
- Displays quick event details without opening modal
- Shows event time, duration, customer name
- Appears on hover after short delay
- Auto-positions to avoid viewport overflow
- Supports custom popover content

**Props**:
- `event`: Event object
- `title`: Popover title
- `startTime`: Formatted start time
- `endTime`: Formatted end time
- `content`: Custom content

**Display Information**:
- Event title
- Start and end time
- Duration
- Customer name
- Brief booking details

---

### **`src/components/SchedulerHeader.jsx`**
**Location**: `/src/components/SchedulerHeader.jsx`  
**Type**: React Component  

**Purpose**: Renders the top navigation bar with view controls.

**Functionality**:
- Date navigation buttons (Previous, Next, Today)
- View type selector dropdown (Day/Week/Month)
- Date range display (e.g., "January 1-7, 2026")
- Integrates with SchedulerData for state updates
- Calls onViewChange and onSelectDate callbacks

**Props**:
- `schedulerData`: SchedulerData instance
- `onViewChange`: View type change handler
- `onSelectDate`: Date selection handler
- `goNext`: Go to next period
- `goBack`: Go to previous period
- `goToday`: Go to today

**Controls**:
```jsx
[< Prev] [Today] [Next >]  |  [Day ▼] [Week ▼] [Month ▼]  |  January 1-7, 2026
```

---

### **`src/components/AgendaView.jsx`**
**Location**: `/src/components/AgendaView.jsx`  
**Type**: React Component  

**Purpose**: Alternative list/agenda view of events.

**Functionality**:
- Displays events in chronological list format
- Groups events by resource
- Shows full event details in table format
- Useful for print views or mobile layouts
- Alternative to timeline view

**Props**:
- `schedulerData`: SchedulerData instance
- `onEventClick`: Event click handler

**Layout**:
```
Big Boat 1
  ├─ Jan 1, 9:00 AM - 5:00 PM | John Doe Group Trip
  └─ Jan 3, 10:00 AM - 3:00 PM | Jane Smith Family Tour

Small Boat 1
  ├─ Jan 1, 9:00 AM - 11:00 AM | Mike Johnson Rental
  └─ Jan 1, 12:00 PM - 2:00 PM | Sarah Williams Rental
```

---

### **`src/components/AgendaResourceEvents.jsx`**
**Location**: `/src/components/AgendaResourceEvents.jsx`  
**Type**: React Component  

**Purpose**: Renders events for a resource in agenda view.

**Functionality**:
- Lists events chronologically for one resource
- Shows full event details
- Renders AgendaEventItem for each event
- Grouped under resource header

**Props**:
- `schedulerData`: SchedulerData instance
- `resource`: Resource object
- `onEventClick`: Event click handler

---

### **`src/components/AgendaEventItem.jsx`**
**Location**: `/src/components/AgendaEventItem.jsx`  
**Type**: React Component  

**Purpose**: Individual event item in agenda view.

**Functionality**:
- Displays event as table row or list item
- Shows start/end time, duration, title
- Handles click to open details
- Supports custom rendering

**Props**:
- `event`: Event object
- `onEventClick`: Click handler

**Display Format**:
```
Jan 1, 9:00 AM - 5:00 PM | John Doe - Big Boat Trip (8 passengers)
```

---

### **`src/components/AddMore.jsx`**
**Location**: `/src/components/AddMore.jsx`  
**Type**: React Component  

**Purpose**: Renders "+X more" indicator for collapsed events.

**Functionality**:
- Shows count of hidden events when too many overlap
- Handles click to expand/show all events
- Opens AddMorePopover with full event list
- Manages overflow state

**Props**:
- `schedulerData`: SchedulerData instance
- `number`: Count of hidden events
- `onClick`: Expand handler

**Display**:
```
[+3 more]
```

---

### **`src/components/AddMorePopover.jsx`**
**Location**: `/src/components/AddMorePopover.jsx`  
**Type**: React Component  

**Purpose**: Popover showing expanded list of overlapping events.

**Functionality**:
- Displays all events that didn't fit in main view
- Positioned near "+X more" indicator
- Each event is clickable to open details
- Auto-closes when clicking outside
- Scrollable if many events

**Props**:
- `events`: Array of overflow events
- `onEventClick`: Event click handler
- `position`: Popover position coordinates

---

### **`src/components/SelectedArea.jsx`**
**Location**: `/src/components/SelectedArea.jsx`  
**Type**: React Component  

**Purpose**: Visual indicator for time slot selection.

**Functionality**:
- Highlights selected time range on scheduler
- Shows during drag-to-create new event
- Renders selection rectangle
- Provides visual feedback for interactions
- Disappears after selection complete

**Props**:
- `schedulerData`: SchedulerData instance
- `selectedArea`: Selection coordinates

**Visual**:
```
┌─────────────────┐
│   Selected      │  (semi-transparent overlay)
│   Time Range    │
└─────────────────┘
```

---

### **`src/components/Summary.jsx`**
**Location**: `/src/components/Summary.jsx`  
**Type**: React Component  

**Purpose**: Summary statistics component (optional).

**Functionality**:
- Can display event counts, occupancy rates
- Configurable via SchedulerData
- Useful for dashboard-style views
- Shows aggregate information

**Props**:
- `schedulerData`: SchedulerData instance
- `summary`: Summary data object

---

### **`src/components/DnDContext.js`**
**Location**: `/src/components/DnDContext.js`  
**Type**: JavaScript Module  

**Purpose**: Drag-and-drop context setup.

**Functionality**:
- Configures react-dnd with HTML5Backend
- Provides DnD context to child components
- Required wrapper for drag-drop functionality
- Manages drag preview and drop zones

**Usage**:
```javascript
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

<DndProvider backend={HTML5Backend}>
  <Scheduler />
</DndProvider>
```

---

### **`src/components/DnDSource.js`**
**Location**: `/src/components/DnDSource.js`  
**Type**: JavaScript Module  

**Purpose**: Drag source configuration for events.

**Functionality**:
- Defines draggable event behavior
- Specifies drag data (event ID, start time, resource)
- Handles drag start/end events
- Integrates with SchedulerData for validation
- Provides visual feedback during drag

**Drag Spec**:
```javascript
{
  type: 'EVENT',
  beginDrag: (props) => ({ event: props.event }),
  endDrag: (props, monitor) => {
    // Handle drop
  },
  canDrag: (props) => {
    // Validation
  }
}
```

---

### **`src/components/WrapperFun.jsx`**
**Location**: `/src/components/WrapperFun.jsx`  
**Type**: React Component  

**Purpose**: Functional component wrapper utility.

**Functionality**:
- Provides higher-order component functionality
- Wraps class components for hooks support
- Used for integrating scheduler with modern React
- Enables functional patterns in library

---

## ⚙️ Configuration Files

### **`src/config/default.js`**
**Location**: `/src/config/default.js`  
**Type**: JavaScript Module  
**Lines**: ~100

**Purpose**: Default scheduler configuration.

**Configuration Options**:
```javascript
{
  // Display settings
  schedulerWidth: '100%',
  schedulerMaxHeight: 0,
  tableHeaderHeight: 40,
  
  // Date/Time settings
  dayStartFrom: 0,
  dayStopTo: 23,
  defaultEventBgColor: '#80C5F6',
  selectedAreaColor: '#7EC2F3',
  
  // Time format
  minuteStep: 30,
  views: [
    { viewName: 'Day', viewType: 0 },
    { viewName: 'Week', viewType: 1 },
    { viewName: 'Month', viewType: 2 }
  ],
  
  // Behavior
  movable: true,
  creatable: true,
  resizable: true,
  
  // Display format
  eventItemHeight: 30,
  eventItemLineHeight: 28,
  nonAgendaSlotMinHeight: 0,
  
  // Date formats
  dayCellWidth: 30,
  monthCellWidth: 80,
  yearCellWidth: 80
}
```

**Exports**:
- `default`: Configuration object

---

### **`src/config/scheduler.js`**
**Location**: `/src/config/scheduler.js`  
**Type**: JavaScript Module  

**Purpose**: Scheduler-specific configuration overrides.

**Functionality**:
- Customizes scheduler appearance
- Sets resource column widths
- Defines event heights and colors
- Business rules (min event duration, working hours)
- Can be customized per deployment

**Configuration**:
```javascript
{
  resourceName: 'Boat',
  schedulerWidth: '100%',
  besidesWidth: 20,
  schedulerMaxHeight: 500,
  checkConflict: true,
  scrollToSpecialMoment: true,
  startResizable: true,
  endResizable: true,
  movable: true,
  creatable: true
}
```

---

## 🛠️ Utilities & Helpers

### **`src/helper/behaviors.js`**
**Location**: `/src/helper/behaviors.js`  
**Type**: JavaScript Module  

**Purpose**: Behavior and interaction utilities.

**Functions**:
```javascript
// Event interaction helpers
getEventText(schedulerData, event)
isNonWorkingTime(schedulerData, time)
getSummary(schedulerData, headerEvents, slotId, slotName, headerStart, headerEnd)

// Validation
isEventInTimeWindow(event, startTime, endTime)
getDateLabel(schedulerData, viewType, startDate, endDate)

// Conflict detection
hasConflict(schedulerData, newEvent)
getConflictEvents(schedulerData, event)
```

**Exports**:
- `default`: Object with behavior functions

---

### **`src/helper/utility.js`**
**Location**: `/src/helper/utility.js`  
**Type**: JavaScript Module  

**Purpose**: General utility functions.

**Functions**:
```javascript
// Date/Time utilities
formatDate(date, format)
parseDate(dateString, format)
addDays(date, days)
getWeekStart(date)
getMonthStart(date)

// Array utilities
sortEvents(events)
filterEvents(events, startDate, endDate)
groupEventsByResource(events)

// Math helpers
calculatePosition(startTime, duration, totalWidth)
calculateDuration(startTime, endTime)

// String formatting
truncate(text, maxLength)
capitalize(string)
formatTime(time, format)
```

**Exports**:
- Individual named exports for each function

---

## 🎨 Styling

### **`src/css/style.css`**
**Location**: `/src/css/style.css`  
**Type**: CSS Stylesheet  
**Lines**: ~500

**Purpose**: Global stylesheet for scheduler components.

**Styling Sections**:

1. **Layout**:
```css
.scheduler-container { ... }
.scheduler-header { ... }
.scheduler-body { ... }
.resource-view { ... }
```

2. **Events**:
```css
.event-item { ... }
.event-item:hover { ... }
.event-item-selected { ... }
.event-refunded { ... }
```

3. **Resources**:
```css
.resource-cell { ... }
.resource-name { ... }
```

4. **Navigation**:
```css
.scheduler-nav { ... }
.nav-button { ... }
.view-selector { ... }
```

5. **Drag-Drop**:
```css
.dragging { ... }
.drop-zone { ... }
.drag-preview { ... }
```

6. **Responsive**:
```css
@media (max-width: 768px) { ... }
```

---

## 🔧 Build & Development Files

### **`webpack.config.js`**
**Location**: `/webpack.config.js`  
**Type**: Webpack Configuration  
**Lines**: ~60

**Purpose**: Webpack build and development server configuration.

**Configuration**:
```javascript
{
  entry: './src/planyo-index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  
  module: {
    rules: [
      // Babel for JSX/ES6
      { test: /\.(js|jsx)$/, use: 'babel-loader' },
      
      // CSS loader
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      
      // Assets (images, fonts, PDFs)
      { test: /\.(svg|png|jpg|woff|woff2|ttf|pdf)$/, type: 'asset' }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/planyo/index.html'
    }),
    new ESLintPlugin({
      emitError: false,      // Don't fail build on errors
      emitWarning: true,     // Show warnings
      failOnError: false     // Continue despite errors
    })
  ],
  
  devServer: {
    port: 8080,
    historyApiFallback: true,
    hot: true
  },
  
  mode: 'development',
  devtool: 'source-map'
}
```

**Key Features**:
- Entry: `src/planyo-index.jsx`
- Template: `src/planyo/index.html`
- ESLint: Warnings only (no build failures)
- Hot reload enabled
- Source maps for debugging

---

### **`.babelrc`**
**Location**: `/.babelrc`  
**Type**: Babel Configuration  

**Purpose**: Babel transpiler configuration.

**Configuration**:
```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead"
    }],
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties"
  ]
}
```

**Features**:
- Modern JavaScript (ES6+) to ES5
- JSX transformation
- Class properties support
- Browser compatibility targeting

---

### **`.eslintrc.json`**
**Location**: `/.eslintrc.json`  
**Type**: ESLint Configuration  

**Purpose**: Code quality and style enforcement.

**Configuration**:
```json
{
  "extends": [
    "airbnb",
    "airbnb/hooks",
    "plugin:react/recommended"
  ],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/react-in-jsx-scope": "off",
    "no-console": "warn",
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }]
  },
  "env": {
    "browser": true,
    "es2021": true
  }
}
```

**Rules**:
- Airbnb style guide
- React hooks rules
- JSX in .js/.jsx files
- Console warnings (not errors)

---

### **`package.json`**
**Location**: `/package.json`  
**Type**: NPM Package Configuration  

**Purpose**: Project metadata and dependencies.

**Content**:
```json
{
  "name": "react-big-schedule",
  "version": "5.1.0",
  "description": "Boat trip booking scheduler",
  
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
  },
  
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-big-schedule": "^5.1.0",
    "antd": "^5.22.1",
    "react-dnd": "^14.0.5",
    "react-dnd-html5-backend": "^14.0.2",
    "dayjs": "^1.11.13"
  },
  
  "devDependencies": {
    "webpack": "^5.103.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.2.0",
    "babel-loader": "^9.2.1",
    "html-webpack-plugin": "^5.6.3",
    "eslint-webpack-plugin": "^4.2.0",
    ...
  }
}
```

**Scripts**:
- `npm run dev`: Start development server
- `npm run build`: Create production build

---

### **`.gitignore`**
**Location**: `/.gitignore`  
**Type**: Git Ignore File  

**Purpose**: Excludes files from version control.

**Ignored Patterns**:
```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
.vscode/
.idea/
```

**Categories**:
- Dependencies (node_modules)
- Build outputs (dist)
- Environment files (.env)
- Logs
- IDE settings

---

## Summary

**Total Files**: 45+

**Categories**:
- **Application**: 4 files (entry point, app wrapper, main scheduler, HTML)
- **Scheduler Library**: 18 components (UI rendering, drag-drop, views)
- **Configuration**: 2 files (defaults, scheduler settings)
- **Utilities**: 2 files (behaviors, general utilities)
- **Styling**: 1 file (global CSS)
- **Build Tools**: 4 files (webpack, babel, eslint, package.json)

**Lines of Code**: ~3,500+ total

**Technologies**:
- React 18.3.1
- react-big-schedule 5.1.0
- Ant Design 5.22.1
- Webpack 5.103.0
- Babel 7.x
- ESLint 8.x

---

## Quick Reference

**Main Entry Point**: `src/planyo-index.jsx`  
**Core Logic**: `src/planyo/components/BookingScheduler.jsx`  
**Scheduler Library**: `src/components/`  
**Configuration**: `src/config/`  
**Build Config**: `webpack.config.js`  

**Development**: `npm run dev` → http://localhost:8080  
**Production**: `npm run build` → `dist/bundle.js`
