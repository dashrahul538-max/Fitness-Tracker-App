# 🏋️ Fitness Tracker App

A modern, user-friendly fitness tracking application that helps you monitor your daily activities, workouts, and progress with beautiful visualizations and easy data management.

## Features

✨ **Core Features:**
- 📊 **Activity Logging** - Track workouts, running, cycling, swimming, yoga, and more
- 📈 **Progress Dashboard** - View daily and weekly statistics
- 📅 **Date-based Tracking** - Add activities for any date
- 📝 **Detailed Information** - Record exercise type, duration, calories burned, and notes
- 🎯 **Smart Insights** - Get insights about your favorite activities and most active days
- 📱 **Responsive Design** - Works great on desktop and mobile devices
- 💾 **Local Data Storage** - Uses SQLite for reliable offline data persistence

## Tech Stack

**Frontend:**
- React 18
- Vite (build tool)
- CSS3 (modern styling with gradients and animations)

**Backend:**
- Node.js with Express
- SQLite3 (better-sqlite3)
- CORS enabled for frontend communication

## Project Structure

```
fitness-tracker-app/
├── src/
│   ├── components/
│   │   ├── ActivityForm.jsx       # Form to add/edit activities
│   │   ├── ActivityForm.css
│   │   ├── Dashboard.jsx          # Progress dashboard
│   │   ├── Dashboard.css
│   │   ├── ActivityList.jsx       # List of activities
│   │   └── ActivityList.css
│   ├── App.jsx                     # Main application component
│   ├── App.css
│   └── main.jsx                    # React entry point
├── db/
│   └── database.js                 # SQLite database management
├── public/
│   └── index.html                  # HTML entry point
├── server.js                       # Express server
├── package.json
├── vite.config.js                  # Vite configuration
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Navigate to project directory:**
   ```bash
   cd "Fitness Tracker App"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the frontend:**
   ```bash
   npm run build
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:5000`

## Development

For development with hot reload:

```bash
# Terminal 1: Start backend with watch mode
npm run dev

# Terminal 2: Start frontend development server (optional, for faster hot reload)
npx vite
```

## Usage

### Adding an Activity
1. Click the **"+ Add Activity"** button in the header
2. Select a date and activity type
3. Enter duration (in minutes) and calories burned
4. Add optional notes
5. Click **"Add Activity"** to save

### Editing an Activity
1. Click the ✏️ (edit) icon on any activity
2. Modify the details
3. Click **"Update Activity"**

### Deleting an Activity
1. Click the 🗑️ (delete) icon on any activity
2. Confirm the deletion

### Viewing Progress
- **Dashboard Cards** show today's and this week's statistics
- **Weekly breakdown chart** visualizes daily calorie burn
- **Filter activities** by Today, Week, or Month
- **Insights section** shows your favorite activities and most active day

## Activity Types

The app supports the following activity types:
- Running 🏃
- Cycling 🚴
- Swimming 🏊
- Gym 🏋️
- Yoga 🧘
- Walking 🚶
- Sports ⚽
- Stretching 🤸
- Cardio ❤️
- Weights 💪
- Other 🎯

## Database

The app uses **SQLite** with better-sqlite3 for data storage. The database file (`fitness_tracker.db`) is automatically created in the `db/` directory on first run.

### Database Schema

```sql
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  calories INTEGER NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
```

## API Endpoints

**Base URL:** `http://localhost:5000/api`

### Endpoints:
- `GET /activities` - Get all activities
- `GET /activities/:startDate/:endDate` - Get activities within date range
- `POST /activities` - Create new activity
- `PUT /activities/:id` - Update activity
- `DELETE /activities/:id` - Delete activity
- `GET /health` - Server health check

## Features in Detail

### Dashboard
- **Today's Stats**: Total calories, duration, and activity count
- **Weekly Stats**: Aggregate metrics for the past 7 days
- **Insights**: Favorite activity type and most active day
- **Daily Progress Chart**: Visual representation of 7-day calorie burn

### Activity Management
- Full CRUD (Create, Read, Update, Delete) operations
- Flexible date selection
- Custom notes for each activity
- Real-time UI updates

### Data Filtering
- View activities from Today, This Week, or This Month
- Quick filter buttons for easy navigation

## UI/UX Design

- **Modern gradient backgrounds** - Purple and gradient color schemes
- **Responsive layout** - Works on all screen sizes
- **Smooth animations** - Subtle transitions and hover effects
- **Clear typography** - Easy-to-read fonts and sizes
- **Intuitive controls** - Emoji icons for quick visual reference
- **Empty states** - Helpful messages when no data exists

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- 📱 Mobile app version
- 🔐 User authentication
- 📊 Advanced analytics and reports
- 🎯 Goal setting and reminders
- 📤 Data export (CSV, PDF)
- 🌐 Cloud synchronization
- 💬 Community features
- 📍 Activity geolocation tracking

## Troubleshooting

### Port 5000 is already in use
Change the port in `server.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

### Database file errors
Delete the `fitness_tracker.db` file in the `db/` directory to reset the database.

### CORS errors
Ensure the frontend is correctly configured to use `http://localhost:5000` in the API calls.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please check the code comments and documentation. The app is designed to be simple and intuitive!

---

**Happy Tracking! 💪**
