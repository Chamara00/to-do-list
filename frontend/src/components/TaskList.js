import React from 'react';

const TaskList = ({ tasks, onTaskCompleted, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="tasks-section">
        <h2 className="section-title">Recent Tasks</h2>
        <div className="loading">
          <div>Loading tasks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-section">
        <h2 className="section-title">Recent Tasks</h2>
        <div className="error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-section">
      <h2 className="section-title">Recent Tasks</h2>
      
      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-text">
            No tasks yet. Create your first task!
          </div>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskCompleted={onTaskCompleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TaskCard = ({ task, onTaskCompleted }) => {
  const handleComplete = async () => {
    try {
      await onTaskCompleted(task.id);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <div className="task-card" data-testid="task-card">
      <div className="task-title">{task.title}</div>
      {task.description && (
        <div className="task-description">{task.description}</div>
      )}
      <div className="task-actions">
        <button
          onClick={handleComplete}
          className="btn btn-secondary"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default TaskList;