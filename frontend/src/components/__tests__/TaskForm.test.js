import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../TaskForm';
import { taskAPI } from '../../services/api';

// Mock the API
jest.mock('../../services/api', () => ({
  taskAPI: {
    createTask: jest.fn()
  }
}));

describe('TaskForm', () => {
  const mockOnTaskCreated = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} onError={mockOnError} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('updates form fields when user types', async () => {
    const user = userEvent.setup();
    render(<TaskForm onTaskCreated={mockOnTaskCreated} onError={mockOnError} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');

    expect(titleInput).toHaveValue('Test Task');
    expect(descriptionInput).toHaveValue('Test Description');
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockTask = { id: 1, title: 'Test Task', description: 'Test Description' };
    taskAPI.createTask.mockResolvedValue({ data: mockTask });

    render(<TaskForm onTaskCreated={mockOnTaskCreated} onError={mockOnError} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add/i });

    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    await user.click(submitButton);

    await waitFor(() => {
      expect(taskAPI.createTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description'
      });
    });

    expect(mockOnTaskCreated).toHaveBeenCalledWith(mockTask);
    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
  });

  it('shows error for empty title', async () => {
    const user = userEvent.setup();
    render(<TaskForm onTaskCreated={mockOnTaskCreated} onError={mockOnError} />);
    
    const submitButton = screen.getByRole('button', { name: /add/i });
    await user.click(submitButton);

    expect(mockOnError).toHaveBeenCalledWith('Title is required');
    expect(taskAPI.createTask).not.toHaveBeenCalled();
  });

  it('shows error for whitespace-only title', async () => {
    const user = userEvent.setup();
    render(<TaskForm onTaskCreated={mockOnTaskCreated} onError={mockOnError} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /add/i });

    await user.type(titleInput, '   ');
    await user.click(submitButton);

    expect(mockOnError).toHaveBeenCalledWith('Title is required');
  });

  it('handles API errors', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Network error';
    taskAPI.createTask.mockRejectedValue(new Error(errorMessage));

    render(<TaskForm onTaskCreated={mockOnTaskCreated} onError={mockOnError} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /add/i });

    await user.type(titleInput, 'Test Task');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    taskAPI.createTask.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<TaskForm onTaskCreated={mockOnTaskCreated} onError={mockOnError} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /add/i });

    await user.type(titleInput, 'Test Task');
    await user.click(submitButton);

    expect(screen.getByText('Adding...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('trims whitespace from inputs', async () => {
    const user = userEvent.setup();
    const mockTask = { id: 1, title: 'Test Task', description: 'Test Description' };
    taskAPI.createTask.mockResolvedValue({ data: mockTask });

    render(<TaskForm onTaskCreated={mockOnTaskCreated} onError={mockOnError} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add/i });

    await user.type(titleInput, '  Test Task  ');
    await user.type(descriptionInput, '  Test Description  ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(taskAPI.createTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description'
      });
    });
  });
});
