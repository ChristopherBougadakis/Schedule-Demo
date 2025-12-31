# Planyo Integration - Quick Start Guide

## 🚀 Setup Instructions

### 1. Install Dependencies

The required dependencies are already in package.json. If you need to reinstall:

```bash
npm install
```

### 2. Configure API Keys

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Planyo API credentials:
```env
REACT_APP_PLANYO_API_URL=https://api.planyo.com
REACT_APP_PLANYO_API_KEY=your_actual_api_key_here
REACT_APP_PLANYO_SITE_ID=your_site_id_here
```

### 3. Run the Application

**Development mode:**
```bash
npm run dev
```

The scheduler will be available at `http://localhost:8080`

**Production build:**
```bash
npm run build
```

---

## 📁 Project Structure

```
src/planyo/
├── components/
│   ├── BookingScheduler.jsx      # Main scheduler component
│   ├── ReservationPopup.jsx      # Popup showing client list
│   └── ClientDetailsModal.jsx    # Modal with client details & actions
├── services/
│   └── planyoApi.js              # Planyo API integration
├── utils/
│   └── dataMapper.js             # Data transformation utilities
├── config/
│   └── schedulerConfig.js        # Scheduler configuration
├── App.jsx                       # Standalone app wrapper
├── index.js                      # Module exports
└── styles.css                    # Custom styling
```

---

## 🎯 Features Implemented

### ✅ Core Features
- [x] Fetch reservations from Planyo API
- [x] Display reservations on timeline
- [x] Color-coded status indicators
- [x] Click events to view client list
- [x] Click clients to see full details
- [x] Real-time data refresh

### ✅ Admin Actions
- [x] Check-in clients
- [x] Check-out clients
- [x] Cancel reservations
- [x] Process refunds
- [x] Drag-and-drop rescheduling

### ✅ UI/UX
- [x] Statistics dashboard
- [x] Responsive design
- [x] Loading states
- [x] Error handling
- [x] Confirmation dialogs
- [x] Status tags and icons

---

## 💡 Usage Examples

### Basic Usage

```jsx
import React from 'react';
import BookingScheduler from './planyo/components/BookingScheduler';

function App() {
  return <BookingScheduler />;
}

export default App;
```

### Custom Configuration

```jsx
import { SchedulerData, ViewType } from './components';
import schedulerConfig from './planyo/config/schedulerConfig';

// Override default configuration
const customConfig = {
  ...schedulerConfig,
  dayStartFrom: 8,  // Start at 8 AM
  dayStopTo: 20,    // End at 8 PM
  minuteStep: 15,   // 15-minute intervals
};

const scheduler = new SchedulerData(
  dayjs().format('YYYY-MM-DD'),
  ViewType.Week,
  false,
  false,
  customConfig
);
```

### Using Individual Components

```jsx
import { ReservationPopup } from './planyo';

function MyComponent() {
  const [visible, setVisible] = useState(false);
  const [reservations, setReservations] = useState([]);

  return (
    <ReservationPopup
      visible={visible}
      reservations={reservations}
      onClose={() => setVisible(false)}
      onClientClick={(client) => console.log(client)}
    />
  );
}
```

---

## 🔧 API Integration

### Planyo API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/get_reservations` | GET | Fetch all reservations |
| `/api/get_reservation/{id}` | GET | Get single reservation |
| `/api/get_services` | GET | Fetch services/resources |
| `/api/checkin` | POST | Check in a client |
| `/api/checkout` | POST | Check out a client |
| `/api/cancel_reservation` | POST | Cancel a reservation |
| `/api/refund` | POST | Process refund |
| `/api/modify_reservation` | POST | Update reservation time |

### Data Flow

```
Planyo API → planyoApi.js → dataMapper.js → SchedulerData → Scheduler UI
                ↓                                              ↓
         Raw JSON Data                              Rendered Events
                                                           ↓
                                                    User Interactions
                                                           ↓
                                              API Calls (check-in, etc.)
```

---

## 🎨 Customization

### Changing Colors

Edit `src/planyo/utils/dataMapper.js`:

```javascript
export const getStatusColor = (reservation) => {
  if (reservation.cancelled) return '#ff4d4f';      // Your red
  if (reservation.checked_in) return '#52c41a';     // Your green
  if (reservation.pending_payment) return '#faad14'; // Your orange
  // ... etc
};
```

### Modifying Scheduler Behavior

Edit `src/planyo/config/schedulerConfig.js`:

```javascript
export const schedulerConfig = {
  // Your custom settings
  eventItemHeight: 30,
  minuteStep: 15,
  dayStartFrom: 6,
  dayStopTo: 22,
  checkConflict: true,
  // ... etc
};
```

### Custom Event Templates

```javascript
const eventItemTemplateResolver = (schedulerData, event, bgColor) => {
  return (
    <div style={{ backgroundColor: bgColor }}>
      {event.planyoData.checked_in ? '✓' : '○'} {event.title}
    </div>
  );
};

<Scheduler
  schedulerData={schedulerData}
  eventItemTemplateResolver={eventItemTemplateResolver}
/>
```

---

## 🐛 Troubleshooting

### Events Not Displaying

**Check:**
- API key is correct in `.env`
- `resourceId` matches a valid service ID
- Date format is `YYYY-MM-DD HH:mm:ss`
- Events are sorted by start time

**Solution:**
```javascript
// Verify data transformation
const events = mapReservationsToEvents(planyoReservations);
console.log('Transformed events:', events);
```

### API Calls Failing

**Check:**
- Network connection
- API endpoint URLs are correct
- Authentication headers are set
- CORS is configured on Planyo side

**Solution:**
```javascript
// Add error logging in planyoApi.js
catch (error) {
  console.error('API Error:', error.message);
  console.error('Response:', error.response);
  throw error;
}
```

### Drag-and-Drop Not Working

**Check:**
- `dragAndDropEnabled: true` in config
- Events have `movable: true` (default)
- `moveEvent` handler is implemented

**Solution:**
```javascript
// Ensure events are movable
const events = planyoReservations.map(r => ({
  ...r,
  movable: !r.checked_in && !r.cancelled, // Can't move checked-in or cancelled
}));
```

---

## 📊 Performance Optimization

### 1. Pagination

For large datasets, implement pagination:

```javascript
const fetchReservations = async (startDate, endDate, page = 1, limit = 100) => {
  return await apiRequest(
    `/api/get_reservations?start=${startDate}&end=${endDate}&page=${page}&limit=${limit}`
  );
};
```

### 2. Caching

Cache frequently accessed data:

```javascript
const cache = new Map();

const fetchWithCache = async (key, fetchFn) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const data = await fetchFn();
  cache.set(key, data);
  return data;
};
```

### 3. Debounced Refresh

Prevent excessive API calls:

```javascript
import { debounce } from 'lodash';

const debouncedRefresh = debounce(refreshData, 500);
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Validate user input** before API calls
4. **Implement rate limiting** on API calls
5. **Use HTTPS** for all API communication

---

## 📝 Testing

### Manual Testing Checklist

- [ ] Load scheduler with sample data
- [ ] Click on event box - popup appears
- [ ] Click on client - modal opens
- [ ] Check-in a client - status updates
- [ ] Cancel a reservation - event updates
- [ ] Process a refund - API call succeeds
- [ ] Drag event to new time - reschedule works
- [ ] Refresh button - data reloads
- [ ] Navigate between weeks - data updates
- [ ] Change view type - layout adjusts

### Sample Test Data

```javascript
const sampleReservation = {
  id: '123',
  client_name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  country: 'USA',
  service_id: 'service-1',
  service_name: 'Massage Therapy',
  start_time: '2025-01-15 10:00:00',
  end_time: '2025-01-15 11:00:00',
  checked_in: false,
  payment_status: 'paid',
  total_amount: 100.00,
};
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

Create `.env.production`:

```env
REACT_APP_PLANYO_API_URL=https://api.planyo.com
REACT_APP_PLANYO_API_KEY=production_key_here
REACT_APP_ENV=production
```

---

## 📞 Support

For issues or questions:

1. Check the [PLANYO_INTEGRATION_GUIDE.md](PLANYO_INTEGRATION_GUIDE.md)
2. Review [react-big-schedule documentation](https://github.com/ansulagrawal/react-big-schedule)
3. Check [Planyo API docs](https://www.planyo.com/api.php)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

**Ready to use! 🎉**

To get started right now:

1. `cp .env.example .env`
2. Add your Planyo API key to `.env`
3. `npm run dev`
4. Open `http://localhost:8080`
