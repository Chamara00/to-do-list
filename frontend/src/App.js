import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { taskAPI } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await taskAPI.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError(error.message);
      toast.error(`Failed to load tasks: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks(prevTasks => [newTask, ...prevTasks.slice(0, 4)]);
    toast.success('Task created successfully!');
  };

  const handleTaskCompleted = async (taskId) => {
    try {
      await taskAPI.markTaskCompleted(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success('Task completed!');
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error(`Failed to complete task: ${error.message}`);
    }
  };

  const handleError = (errorMessage) => {
    toast.error(errorMessage);
  };

  return (
    <div className="App" data-testid="app">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">To-Do App</h1>
          <p className="app-subtitle">Stay organized and get things done</p>
        </header>

        <main className="main-content">
          <TaskForm
            onTaskCreated={handleTaskCreated}
            onError={handleError}
          />
          
          <TaskList
            tasks={tasks}
            onTaskCompleted={handleTaskCompleted}
            isLoading={isLoading}
            error={error}
          />
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;