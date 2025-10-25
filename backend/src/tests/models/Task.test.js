const Task = require('../../models/Task');
const pool = require('../../config/database');

describe('Task Model', () => {
  beforeEach(async () => {
    // Clean up test data
    await pool.query('DELETE FROM task WHERE title LIKE $1', ['Test%']);
  });

  afterAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM task WHERE title LIKE $1', ['Test%']);
    await pool.end();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const title = 'Test Task';
      const description = 'Test Description';

      const task = await Task.create(title, description);

      expect(task).toBeDefined();
      expect(task.title).toBe(title);
      expect(task.description).toBe(description);
      expect(task.completed).toBe(false);
      expect(task.id).toBeDefined();
      expect(task.created_at).toBeDefined();
    });

    it('should create a task without description', async () => {
      const title = 'Test Task No Description';

      const task = await Task.create(title, null);

      expect(task.title).toBe(title);
      expect(task.description).toBeNull();
    });

    it('should throw error for invalid data', async () => {
      await expect(Task.create(null, 'description')).rejects.toThrow();
    });
  });

  describe('getRecent', () => {
    beforeEach(async () => {
      // Create test tasks
      await Task.create('Task 1', 'Description 1');
      await Task.create('Task 2', 'Description 2');
      await Task.create('Task 3', 'Description 3');
    });

    it('should return recent tasks', async () => {
      const tasks = await Task.getRecent(5);

      expect(tasks).toBeInstanceOf(Array);
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks[0]).toHaveProperty('title');
      expect(tasks[0]).toHaveProperty('description');
      expect(tasks[0]).toHaveProperty('completed');
    });

    it('should respect limit parameter', async () => {
      const tasks = await Task.getRecent(2);

      expect(tasks.length).toBeLessThanOrEqual(2);
    });

    it('should only return incomplete tasks', async () => {
      const tasks = await Task.getRecent(10);

      tasks.forEach(task => {
        expect(task.completed).toBe(false);
      });
    });
  });

  describe('markAsCompleted', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create('Task to Complete', 'Description');
      taskId = task.id;
    });

    it('should mark task as completed', async () => {
      const completedTask = await Task.markAsCompleted(taskId);

      expect(completedTask.completed).toBe(true);
      expect(completedTask.id).toBe(taskId);
    });

    it('should throw error for non-existent task', async () => {
      await expect(Task.markAsCompleted(99999)).rejects.toThrow('Task not found');
    });

    it('should throw error for already completed task', async () => {
      await Task.markAsCompleted(taskId);
      await expect(Task.markAsCompleted(taskId)).rejects.toThrow('Task not found');
    });
  });

  describe('findById', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create('Test Task', 'Test Description');
      taskId = task.id;
    });

    it('should find task by ID', async () => {
      const task = await Task.findById(taskId);

      expect(task).toBeDefined();
      expect(task.id).toBe(taskId);
      expect(task.title).toBe('Test Task');
    });

    it('should return undefined for non-existent task', async () => {
      const task = await Task.findById(99999);

      expect(task).toBeUndefined();
    });
  });
});
