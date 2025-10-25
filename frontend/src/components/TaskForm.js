import React, { useState } from 'react';
import { taskAPI } from '../services/api';

const TaskForm = ({ onTaskCreated, onError }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      onError('Title is required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await taskAPI.createTask({
        title: formData.title.trim(),
        description: formData.description.trim()
      });
      
      setFormData({ title: '', description: '' });
      onTaskCreated(response.data);
    } catch (error) {
      onError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-section">
      <h2 className="section-title">Add a Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter task title"
            disabled={isSubmitting}
            maxLength={255}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input form-textarea"
            placeholder="Enter task description (optional)"
            disabled={isSubmitting}
            maxLength={1000}
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !formData.title.trim()}
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
