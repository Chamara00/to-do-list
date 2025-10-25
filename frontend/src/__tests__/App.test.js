import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { taskAPI } from '../services/api';

// Mock the API
jest.mock('../services/api', () => ({
  taskAPI: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    markTaskCompleted: jest.fn()
  }
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders app title and subtitle', () => {
    taskAPI.getTasks.mockResolvedValue({ data: [] });
    
    render(<App />);
    
    expect(screen.getByText('To-Do App')).toBeInTheDocument();
    expect(screen.getByText('Stay organized and get things done')).toBeInTheDocument();
  });

  it('loads tasks on mount', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', description: 'Description 1' }
    ];
    taskAPI.getTasks.mockResolvedValue({ data: mockTasks });

    render(<App />);

    await waitFor(() => {
      expect(taskAPI.getTasks).toHaveBeenCalled();
    });

    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('handles task creation', async () => {
    const user = userEvent.setup();
    const mockNewTask = { id: 1, title: 'New Task', description: 'New Description' };
    
    taskAPI.getTasks.mockResolvedValue({ data: [] });
    taskAPI.createTask.mockResolvedValue({ data: mockNewTask });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet. Create your first task!')).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'New Description');
    await user.click(addButton);

    await waitFor(() => {
      expect(taskAPI.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description'
      });
    });

    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('handles task completion', async () => {
    const user = userEvent.setup();
    const mockTasks = [
      { id: 1, title: 'Task 1', description: 'Description 1' }
    ];
    
    taskAPI.getTasks.mockResolvedValue({ data: mockTasks });
    taskAPI.markTaskCompleted.mockResolvedValue({ data: { id: 1 } });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const doneButton = screen.getByRole('button', { name: /done/i });
    await user.click(doneButton);

    await waitFor(() => {
      expect(taskAPI.markTaskCompleted).toHaveBeenCalledWith(1);
    });

    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'Network error';
    taskAPI.getTasks.mockRejectedValue(new Error(errorMessage));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    taskAPI.getTasks.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<App />);
    
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });
});
