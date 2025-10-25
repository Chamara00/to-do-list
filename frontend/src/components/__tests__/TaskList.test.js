import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../TaskList';
import { taskAPI } from '../../services/api';

// Mock the API
jest.mock('../../services/api', () => ({
  taskAPI: {
    markTaskCompleted: jest.fn()
  }
}));

describe('TaskList', () => {
  const mockOnTaskCompleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    render(
      <TaskList
        tasks={[]}
        onTaskCompleted={mockOnTaskCompleted}
        isLoading={true}
        error={null}
      />
    );

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const errorMessage = 'Failed to load tasks';
    render(
      <TaskList
        tasks={[]}
        onTaskCompleted={mockOnTaskCompleted}
        isLoading={false}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders empty state when no tasks', () => {
    render(
      <TaskList
        tasks={[]}
        onTaskCompleted={mockOnTaskCompleted}
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getByText('No tasks yet. Create your first task!')).toBeInTheDocument();
  });

  it('renders task list', () => {
    const tasks = [
      { id: 1, title: 'Task 1', description: 'Description 1' },
      { id: 2, title: 'Task 2', description: 'Description 2' }
    ];

    render(
      <TaskList
        tasks={tasks}
        onTaskCompleted={mockOnTaskCompleted}
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('renders tasks without description', () => {
    const tasks = [
      { id: 1, title: 'Task 1', description: null }
    ];

    render(
      <TaskList
        tasks={tasks}
        onTaskCompleted={mockOnTaskCompleted}
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('calls onTaskCompleted when Done button is clicked', async () => {
    const user = userEvent.setup();
    const tasks = [
      { id: 1, title: 'Task 1', description: 'Description 1' }
    ];

    render(
      <TaskList
        tasks={tasks}
        onTaskCompleted={mockOnTaskCompleted}
        isLoading={false}
        error={null}
      />
    );

    const doneButton = screen.getByRole('button', { name: /done/i });
    await user.click(doneButton);

    expect(mockOnTaskCompleted).toHaveBeenCalledWith(1);
  });

  it('handles multiple tasks correctly', () => {
    const tasks = [
      { id: 1, title: 'Task 1', description: 'Description 1' },
      { id: 2, title: 'Task 2', description: 'Description 2' },
      { id: 3, title: 'Task 3', description: 'Description 3' }
    ];

    render(
      <TaskList
        tasks={tasks}
        onTaskCompleted={mockOnTaskCompleted}
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getAllByRole('button', { name: /done/i })).toHaveLength(3);
  });
});
