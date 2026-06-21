# Fitness Tracker App - Development Guidelines

## Project Overview
This is a full-stack fitness tracking application built with React (frontend), Express (backend), and SQLite (database). It allows users to track daily fitness activities with a clean, modern UI and provides progress dashboards.

## Tech Stack
- **Frontend**: React 18, Vite, CSS3
- **Backend**: Node.js, Express
- **Database**: SQLite (better-sqlite3)
- **Package Manager**: npm

## Key Features
- Activity logging (workouts, running, cycling, etc.)
- Daily and weekly progress tracking
- Beautiful dashboard with statistics
- Activity management (CRUD operations)
- Responsive design

## Development Workflow

### Setup
1. Install dependencies: `npm install`
2. Build frontend: `npm run build`
3. Start server: `npm start`

### Development Mode
- Backend watch mode: `npm run dev`
- Frontend: Built files served from `dist/`

### File Structure
```
src/
  ├── components/          # React components
  ├── App.jsx             # Main app component
  └── main.jsx            # React entry point
db/
  └── database.js         # SQLite operations
server.js                 # Express server
```

## Coding Standards

### React Components
- Use functional components with hooks
- Each component has its own CSS file
- Props validation for better debugging
- Clear component naming

### CSS
- Mobile-first responsive design
- Use CSS variables for colors
- Gradient backgrounds for modern feel
- Smooth transitions and animations

### Database
- All queries in `db/database.js`
- UUID for unique IDs
- ISO date strings for date storage
- Proper error handling

## Common Tasks

### Adding a New Activity Type
1. Add to `ACTIVITY_TYPES` array in `ActivityForm.jsx`
2. Add emoji mapping in `ActivityList.jsx`
3. Update database if schema changes needed

### Modifying Dashboard Stats
1. Edit calculation logic in `Dashboard.jsx`
2. Update stat cards to display new metrics
3. Update CSS styling in `Dashboard.css`

### Changing Styling
- Main colors: #667eea (purple), #764ba2 (dark purple)
- Accent red: #ef4444
- All stylesheets: `*.css` files in components

## Testing
- Manual testing through UI
- Check browser console for errors
- Verify database persistence

## Deployment Notes
- Build frontend: `npm run build`
- Output: `dist/` directory
- Serve static files from Express
- SQLite database travels with app

## Important Notes
- Database uses WAL (Write-Ahead Logging) mode
- All dates stored as YYYY-MM-DD strings
- Durations in minutes, calories in kcal
- CORS enabled for development flexibility

## Performance Considerations
- Activities cached in component state
- Date filtering done client-side
- No pagination implemented yet
- Suitable for ~1000+ activities

---

Last Updated: 2024
