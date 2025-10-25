const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const { taskValidation } = require('../middleware/validation');

// GET /api/tasks - Get recent tasks
router.get('/', TaskController.getRecentTasks);

// POST /api/tasks - Create a new task
router.post('/', taskValidation, TaskController.createTask);

// PUT /api/tasks/:id/complete - Mark task as completed
router.put('/:id/complete', TaskController.markTaskAsCompleted);

module.exports = router;
