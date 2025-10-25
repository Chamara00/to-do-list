const request = require('supertest');
const app = require('../server');

describe('Task API', () => {
  describe('GET /api/tasks', () => {
    it('should return recent tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should accept limit parameter', async () => {
      const response = await request(app)
        .get('/api/tasks?limit=3')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(3);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with valid data', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe(taskData.description);
      expect(response.body.data.completed).toBe(false);
    });

    it('should create a task without description', async () => {
      const taskData = {
        title: 'Test Task Without Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
    });

    it('should return 400 for missing title', async () => {
      const taskData = {
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 for empty title', async () => {
      const taskData = {
        title: '',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for title too long', async () => {
      const taskData = {
        title: 'a'.repeat(256),
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for description too long', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'a'.repeat(1001)
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id/complete', () => {
    let createdTask;

    beforeEach(async () => {
      const taskData = {
        title: 'Task to Complete',
        description: 'This task will be completed'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData);

      createdTask = response.body.data;
    });

    it('should mark task as completed', async () => {
      const response = await request(app)
        .put(`/api/tasks/${createdTask.id}/complete`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.completed).toBe(true);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/99999/complete')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid task ID', async () => {
      const response = await request(app)
        .put('/api/tasks/invalid/complete')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 for already completed task', async () => {
      // First, complete the task
      await request(app)
        .put(`/api/tasks/${createdTask.id}/complete`)
        .expect(200);

      // Try to complete it again
      const response = await request(app)
        .put(`/api/tasks/${createdTask.id}/complete`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Route not found');
    });
  });
});
