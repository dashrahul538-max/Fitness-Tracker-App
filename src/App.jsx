import { useState, useEffect } from 'react'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import ActivityForm from './components/ActivityForm'
import ActivityList from './components/ActivityList'
import ActivityTracker from './components/ActivityTracker'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [activities, setActivities] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const [filter, setFilter] = useState('week')
  const [loading, setLoading] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  // Fetch activities when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchActivities()
    }
  }, [currentUser])

  const handleSignUp = (user) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActivities([])
    localStorage.removeItem('currentUser')
  }

  const fetchActivities = async () => {
    if (!currentUser) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/activities/${currentUser.id}`)
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddActivity = async (activityData) => {
    if (!currentUser) return
    
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          ...activityData
        }),
      })
      if (response.ok) {
        const newActivity = await response.json()
        setActivities([newActivity, ...activities])
        setShowForm(false)
      }
    } catch (error) {
      console.error('Failed to add activity:', error)
    }
  }

  const handleUpdateActivity = async (id, activityData) => {
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      })
      if (response.ok) {
        setActivities(activities.map(a => a.id === id ? { ...a, ...activityData } : a))
        setEditingActivity(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error('Failed to update activity:', error)
    }
  }

  const handleDeleteActivity = async (id) => {
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setActivities(activities.filter(a => a.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete activity:', error)
    }
  }

  const handleEditActivity = (activity) => {
    setEditingActivity(activity)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingActivity(null)
  }

  const getFilteredActivities = () => {
    const now = new Date()
    const activities_copy = [...activities]

    if (filter === 'today') {
      const today = now.toISOString().split('T')[0]
      return activities_copy.filter(a => a.date === today)
    } else if (filter === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return activities_copy.filter(a => {
        const actDate = new Date(a.date)
        return actDate >= oneWeekAgo && actDate <= now
      })
    } else if (filter === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return activities_copy.filter(a => {
        const actDate = new Date(a.date)
        return actDate >= oneMonthAgo && actDate <= now
      })
    }
    return activities_copy
  }

  // Show sign-up page if not logged in
  if (!currentUser) {
    return <SignUp onSignUp={handleSignUp} />
  }

  const filteredActivities = getFilteredActivities()

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>💪 FitTracker</h1>
          <p>Welcome, {currentUser.name}! Track your daily fitness activities</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-add"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ Add Activity'}
          </button>
          <button 
            className="btn-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        {showForm && (
          <div className="form-container">
            <ActivityForm 
              onSubmit={editingActivity ? 
                (data) => handleUpdateActivity(editingActivity.id, data) : 
                handleAddActivity
              }
              initialData={editingActivity}
              onCancel={handleCloseForm}
            />
          </div>
        )}

        <ActivityTracker 
          onActivitySaved={(newActivity) => {
            setActivities([newActivity, ...activities])
          }}
          currentUser={currentUser}
        />

        <Dashboard activities={filteredActivities} />

        <div className="filter-section">
          <h2>Activities</h2>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
              onClick={() => setFilter('today')}
            >
              Today
            </button>
            <button 
              className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
              onClick={() => setFilter('week')}
            >
              Week
            </button>
            <button 
              className={`filter-btn ${filter === 'month' ? 'active' : ''}`}
              onClick={() => setFilter('month')}
            >
              Month
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading activities...</div>
        ) : filteredActivities.length === 0 ? (
          <div className="empty-state">
            <p>No activities recorded yet</p>
            <p>Start by adding your first activity!</p>
          </div>
        ) : (
          <ActivityList 
            activities={filteredActivities}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
          />
        )}
      </main>
    </div>
  )
}

export default App
