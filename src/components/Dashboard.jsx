import { useMemo } from 'react'
import './Dashboard.css'

function Dashboard({ activities }) {
  const stats = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    // Today's stats
    const todayActivities = activities.filter(a => a.date === todayStr)
    const todayCalories = todayActivities.reduce((sum, a) => sum + a.calories, 0)
    const todayDuration = todayActivities.reduce((sum, a) => sum + a.duration, 0)
    
    // Weekly stats
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weeklyActivities = activities.filter(a => {
      const actDate = new Date(a.date)
      return actDate >= oneWeekAgo && actDate <= today
    })
    const weeklyCalories = weeklyActivities.reduce((sum, a) => sum + a.calories, 0)
    const weeklyDuration = weeklyActivities.reduce((sum, a) => sum + a.duration, 0)
    
    // Most active day this week
    const activityByDay = {}
    weeklyActivities.forEach(a => {
      if (!activityByDay[a.date]) {
        activityByDay[a.date] = 0
      }
      activityByDay[a.date]++
    })
    
    const mostActiveDay = Object.entries(activityByDay).length > 0 
      ? Object.entries(activityByDay).reduce((a, b) => b[1] > a[1] ? b : a)[0]
      : 'N/A'
    
    // Activity types count
    const activityTypes = {}
    weeklyActivities.forEach(a => {
      activityTypes[a.type] = (activityTypes[a.type] || 0) + 1
    })
    const favoriteType = Object.entries(activityTypes).length > 0
      ? Object.entries(activityTypes).reduce((a, b) => b[1] > a[1] ? b : a)[0]
      : 'N/A'
    
    return {
      today: {
        calories: todayCalories,
        duration: todayDuration,
        activities: todayActivities.length
      },
      week: {
        calories: weeklyCalories,
        duration: weeklyDuration,
        activities: weeklyActivities.length,
        days: Object.keys(activityByDay).length
      },
      favoriteType: typeof favoriteType === 'string' ? favoriteType : favoriteType[0],
      mostActiveDay: mostActiveDay
    }
  }, [activities])

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatDate = (dateStr) => {
    if (dateStr === 'N/A') return 'N/A'
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card today-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Today</h3>
            <div className="stat-row">
              <span className="stat-label">Calories</span>
              <span className="stat-value">{stats.today.calories}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Duration</span>
              <span className="stat-value">{formatTime(stats.today.duration)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Activities</span>
              <span className="stat-value">{stats.today.activities}</span>
            </div>
          </div>
        </div>

        <div className="stat-card week-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>This Week</h3>
            <div className="stat-row">
              <span className="stat-label">Calories</span>
              <span className="stat-value">{stats.week.calories}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Duration</span>
              <span className="stat-value">{formatTime(stats.week.duration)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Days Active</span>
              <span className="stat-value">{stats.week.days}</span>
            </div>
          </div>
        </div>

        <div className="stat-card insight-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>Insights</h3>
            <div className="stat-row">
              <span className="stat-label">Favorite Activity</span>
              <span className="stat-value">{stats.favoriteType}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Most Active Day</span>
              <span className="stat-value">{formatDate(stats.mostActiveDay)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Avg Daily Calories</span>
              <span className="stat-value">
                {stats.week.days > 0 ? Math.round(stats.week.calories / stats.week.days) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="weekly-breakdown">
        <h2>Daily Progress</h2>
        <div className="weekly-bars">
          {[6, 5, 4, 3, 2, 1, 0].map(daysAgo => {
            const date = new Date()
            date.setDate(date.getDate() - daysAgo)
            const dateStr = date.toISOString().split('T')[0]
            const dayActivities = activities.filter(a => a.date === dateStr)
            const dayCalories = dayActivities.reduce((sum, a) => sum + a.calories, 0)
            const maxCalories = 800
            const height = Math.min((dayCalories / maxCalories) * 100, 100)
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
            
            return (
              <div key={dateStr} className="bar-container">
                <div className="bar" style={{ height: `${height || 10}%` }}>
                  {dayCalories > 0 && <span className="bar-label">{dayCalories}</span>}
                </div>
                <div className="bar-day">{dayName}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
