import './ActivityList.css'

function ActivityList({ activities, onEdit, onDelete }) {
  const getActivityEmoji = (type) => {
    const emojis = {
      'Running': '🏃',
      'Cycling': '🚴',
      'Swimming': '🏊',
      'Gym': '🏋️',
      'Yoga': '🧘',
      'Walking': '🚶',
      'Sports': '⚽',
      'Stretching': '🤸',
      'Cardio': '❤️',
      'Weights': '💪',
      'Other': '🎯'
    }
    return emojis[type] || '🎯'
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    if (dateStr === todayStr) {
      return 'Today'
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    })
  }

  const groupedActivities = {}
  activities.forEach(activity => {
    if (!groupedActivities[activity.date]) {
      groupedActivities[activity.date] = []
    }
    groupedActivities[activity.date].push(activity)
  })

  return (
    <div className="activity-list">
      {Object.entries(groupedActivities).map(([date, dayActivities]) => (
        <div key={date} className="date-group">
          <div className="date-header">
            <h3>{formatDate(date)}</h3>
            <span className="activity-count">{dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}</span>
          </div>
          
          <div className="activities-container">
            {dayActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-emoji">{getActivityEmoji(activity.type)}</div>
                
                <div className="activity-details">
                  <div className="activity-header">
                    <h4>{activity.type}</h4>
                    <span className="activity-duration">⏱️ {activity.duration} min</span>
                  </div>
                  <div className="activity-meta">
                    <span className="calories">🔥 {activity.calories} kcal</span>
                    {activity.notes && <span className="notes">{activity.notes}</span>}
                  </div>
                </div>

                <div className="activity-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => onEdit(activity)}
                    title="Edit activity"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this activity?')) {
                        onDelete(activity.id)
                      }
                    }}
                    title="Delete activity"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityList
