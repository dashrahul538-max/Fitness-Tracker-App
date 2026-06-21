import { useState, useEffect, useRef } from 'react'
import './ActivityTracker.css'

const ACTIVITY_TYPES = [
  'Running',
  'Cycling',
  'Swimming',
  'Gym',
  'Yoga',
  'Walking',
  'Sports',
  'Stretching',
  'Cardio',
  'Weights',
  'Other'
]

function ActivityTracker({ onActivitySaved, currentUser }) {
  const [isTracking, setIsTracking] = useState(false)
  const [activity, setActivity] = useState({
    type: 'Running',
    duration: 0,
    calories: 0,
    notes: ''
  })
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [saved, setSaved] = useState(false)
  const intervalRef = useRef(null)
  const autoSaveRef = useRef(null)

  // Calculate calories based on activity type and duration
  const calculateCalories = (type, minutes) => {
    const calorieRates = {
      'Running': 10,
      'Cycling': 8,
      'Swimming': 12,
      'Gym': 6,
      'Yoga': 3,
      'Walking': 4,
      'Sports': 9,
      'Stretching': 2,
      'Cardio': 10,
      'Weights': 7,
      'Other': 5
    }
    const rate = calorieRates[type] || 5
    return Math.round(minutes * rate)
  }

  // Timer logic
  useEffect(() => {
    if (isTracking) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => {
          const newSeconds = prev + 1
          const minutes = Math.floor(newSeconds / 60)
          
          // Update activity data
          setActivity(prev => ({
            ...prev,
            duration: minutes,
            calories: calculateCalories(prev.type, minutes)
          }))
          
          return newSeconds
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isTracking])

  // Auto-save every 10 seconds while tracking
  useEffect(() => {
    if (isTracking && elapsedSeconds > 0 && elapsedSeconds % 10 === 0) {
      saveActivity(false) // Save without stopping
    }
  }, [elapsedSeconds])

  const startTracking = () => {
    setIsTracking(true)
    setSaved(false)
    setElapsedSeconds(0)
  }

  const stopTracking = async () => {
    setIsTracking(false)
    if (elapsedSeconds > 0) {
      await saveActivity(true)
    }
  }

  const saveActivity = async (stopTracking = true) => {
    if (!currentUser || activity.duration === 0) return

    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch('http://localhost:5000/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          date: today,
          type: activity.type,
          duration: activity.duration,
          calories: activity.calories,
          notes: activity.notes,
          trackedAt: new Date().toISOString()
        }),
      })

      if (response.ok) {
        const newActivity = await response.json()
        setSaved(true)
        
        if (stopTracking) {
          setElapsedSeconds(0)
          setActivity({
            type: 'Running',
            duration: 0,
            calories: 0,
            notes: ''
          })
          
          if (onActivitySaved) {
            onActivitySaved(newActivity)
          }

          // Show saved message for 3 seconds
          setTimeout(() => setSaved(false), 3000)
        }
      }
    } catch (error) {
      console.error('Failed to save activity:', error)
    }
  }

  const handleActivityTypeChange = (e) => {
    const newType = e.target.value
    setActivity(prev => ({
      ...prev,
      type: newType,
      calories: calculateCalories(newType, prev.duration)
    }))
  }

  const handleNotesChange = (e) => {
    setActivity(prev => ({
      ...prev,
      notes: e.target.value
    }))
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  return (
    <div className="activity-tracker">
      <div className="tracker-header">
        <h2>⏱️ Real-Time Activity Tracker</h2>
        <p>Start tracking and it will auto-save every 10 seconds</p>
      </div>

      <div className="tracker-content">
        <div className="timer-display">
          <div className={`timer ${isTracking ? 'active' : ''}`}>
            {formatTime(elapsedSeconds)}
          </div>
          {saved && <div className="save-indicator">✓ Saved</div>}
        </div>

        {!isTracking && (
          <div className="tracker-form">
            <div className="form-group">
              <label htmlFor="tracker-type">Activity Type</label>
              <select
                id="tracker-type"
                value={activity.type}
                onChange={handleActivityTypeChange}
              >
                {ACTIVITY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tracker-notes">Notes (optional)</label>
              <textarea
                id="tracker-notes"
                value={activity.notes}
                onChange={handleNotesChange}
                placeholder="Add notes about this activity..."
                rows="2"
              />
            </div>
          </div>
        )}

        <div className="tracker-stats">
          <div className="stat">
            <span className="stat-label">Duration</span>
            <span className="stat-value">{Math.floor(elapsedSeconds / 60)}m</span>
          </div>
          <div className="stat">
            <span className="stat-label">Calories</span>
            <span className="stat-value">{activity.calories}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Type</span>
            <span className="stat-value">{activity.type}</span>
          </div>
        </div>

        <div className="tracker-actions">
          {!isTracking ? (
            <button className="btn-start" onClick={startTracking}>
              ▶️ Start Tracking
            </button>
          ) : (
            <>
              <button className="btn-stop" onClick={stopTracking}>
                ⏹️ Stop & Save
              </button>
              <div className="auto-save-indicator">
                Auto-saving every 10 seconds...
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityTracker
