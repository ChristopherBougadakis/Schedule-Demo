# Refactored BookingScheduler Structure

This document explains the new modular file structure for better code organization and maintainability.

## 📁 New File Structure

```
src/planyo/
├── components/
│   └── BookingScheduler.jsx          (Main component - 283 lines, down from 1450!)
├── data/
│   └── boatData.js                    (Boat resources & dummy events)
├── handlers/
│   ├── bookingHandlers.js             (Check-in, cancel, refund handlers)
│   └── moveHandlers.js                (Move/reschedule handlers)
├── modals/
│   ├── BigBoatModal.jsx               (Big boat passenger list modal)
│   ├── SmallBoatModal.jsx             (Small boat details modal)
│   ├── PassengerModal.jsx             (Individual passenger modal)
│   ├── MovePassengerModal.jsx         (Move passenger modal)
│   └── MoveSmallBoatModal.jsx         (Reschedule small boat modal)
└── utils/
    └── bookingHelpers.js              (Utility functions)
```

## 📝 File Descriptions

### **Main Component**
- **`components/BookingScheduler.jsx`** (283 lines)
  - Main orchestrator component
  - Manages state
  - Imports and composes all sub-modules
  - Clean and easy to understand

### **Data**
- **`data/boatData.js`**
  - `createBoatResources()` - Creates boat resource objects
  - `createDummyEvents()` - Generates test booking data
  - Easy to modify test data

### **Handlers**
- **`handlers/bookingHandlers.js`**
  - `createBookingHandlers()` - Returns all booking action handlers:
    - `handleEventClick` - Open booking details
    - `handlePassengerClick` - Open passenger details
    - `handleCheckIn` / `handleCheckInPassenger` - Check-in logic
    - `handleCancelClick` - Cancel with double-confirmation
    - `handleRefund` / `handleRefundPassenger` - Refund logic
    - `handleRemovePassenger` - Remove passenger from booking
  - `createNavigationHandlers()` - Scheduler navigation:
    - `prevClick` / `nextClick` - Navigate dates
    - `onViewChange` - Switch views (Day/Week/Month)
    - `onSelectDate` - Calendar date selection

- **`handlers/moveHandlers.js`**
  - `createMoveHandlers()` - Returns move/reschedule handlers:
    - `handleMoveReservation` - Move passenger to new/existing reservation
    - `handleMoveSmallBoat` - Reschedule small boat bookings
  - Includes navigation to new dates after moving

### **Modals**
All modal components are self-contained with their own UI logic:

- **`modals/BigBoatModal.jsx`**
  - Shows passenger list for big boats
  - Passenger grid with check-in status
  - Booking-level actions (cancel, refund)

- **`modals/SmallBoatModal.jsx`**
  - Shows booking details for small boats
  - Customer info, date/time, duration
  - Check-in, cancel, refund, move actions

- **`modals/PassengerModal.jsx`**
  - Individual passenger details
  - Edit number of people
  - Passenger-specific actions (check-in, refund, remove, move)

- **`modals/MovePassengerModal.jsx`**
  - Move passenger to existing or new reservation
  - Date/time pickers for new reservations
  - Dropdown to select existing reservations

- **`modals/MoveSmallBoatModal.jsx`**
  - Reschedule small boat reservations
  - New date/time selection
  - Conflict checking

### **Utilities**
- **`utils/bookingHelpers.js`**
  - `checkBoatTimeOverlap()` - Detect scheduling conflicts
  - `updateEventStatus()` - Update event status (cancelled/refunded)
  - `calculateRefund()` - Calculate refund amounts

## ✅ Benefits

### **Before Refactoring**
- ❌ 1 file with 1,450 lines
- ❌ Hard to navigate
- ❌ Difficult to find specific functions
- ❌ Risky to modify (everything in one place)

### **After Refactoring**
- ✅ 13 focused files with clear responsibilities
- ✅ Main component only 283 lines
- ✅ Easy to navigate by feature
- ✅ Reusable modal components
- ✅ Testable handler functions
- ✅ Clear separation of concerns

## 🔧 How to Extend

### **Add a new booking action:**
1. Add handler function to `handlers/bookingHandlers.js`
2. Import and use in `BookingScheduler.jsx`
3. Add UI button to relevant modal

### **Add a new modal:**
1. Create new component in `modals/`
2. Import in `BookingScheduler.jsx`
3. Pass necessary props and handlers

### **Modify test data:**
1. Edit `data/boatData.js`
2. No need to touch any other files

### **Add utility function:**
1. Add to `utils/bookingHelpers.js`
2. Import where needed

## 📦 Backup Files

The original monolithic file has been preserved:
- `components/BookingScheduler.old.jsx` (original 1,450 lines)
- `components/BookingScheduler.jsx.backup` (backup copy)

You can compare or revert if needed.

## 🚀 Getting Started

The refactored code works exactly the same as before. No changes needed to use it:

```bash
npm run dev    # Start development server
npm run build  # Build for production
```

All functionality is preserved - just organized better!
