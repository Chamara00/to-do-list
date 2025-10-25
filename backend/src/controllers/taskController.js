const Task = require('../models/Task');
const { validationResult } = require('express-validator');

class TaskController {
  static async createTask(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { title, description } = req.body;
      const task = await Task.create(title, description);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getRecentTasks(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const tasks = await Task.getRecent(limit);

      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async markTaskAsCompleted(req, res) {
    try {
      const { id } = req.params;
      const taskId = parseInt(id);

      if (isNaN(taskId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID'
        });
      }

      const task = await Task.markAsCompleted(taskId);

      res.status(200).json({
        success: true,
        message: 'Task marked as completed',
        data: task
      });
    } catch (error) {
      console.error('Error marking task as completed:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or already completed'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = TaskController;
