import { useState } from 'react'
import './ActivityForm.css'

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

function ActivityForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    date: new Date().toISOString().split('T')[0],
    type: 'Running',
    duration: 30,
    calories: 250,
    notes: ''
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.type) newErrors.type = 'Activity type is required'
    if (!formData.duration || formData.duration <= 0) newErrors.duration = 'Duration must be greater than 0'
    if (!formData.calories || formData.calories < 0) newErrors.calories = 'Calories must be 0 or greater'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'calories' ? parseInt(value) || 0 : value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'Running',
        duration: 30,
        calories: 250,
        notes: ''
      })
    }
  }

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit Activity' : 'Add New Activity'}</h2>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Activity Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={errors.type ? 'error' : ''}
          >
            {ACTIVITY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.type && <span className="error-text">{errors.type}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            className={errors.duration ? 'error' : ''}
          />
          {errors.duration && <span className="error-text">{errors.duration}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="calories">Calories Burned</label>
          <input
            type="number"
            id="calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            min="0"
            className={errors.calories ? 'error' : ''}
          />
          {errors.calories && <span className="error-text">{errors.calories}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional notes about this activity..."
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          {initialData ? 'Update Activity' : 'Add Activity'}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ActivityForm
