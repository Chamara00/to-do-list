const pool = require('../config/database');

class Task {
  static async create(title, description) {
    const query = `
      INSERT INTO task (title, description, completed, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [title, description, false, new Date(), new Date()];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  static async getRecent(limit = 5) {
    const query = `
      SELECT * FROM task 
      WHERE completed = false 
      ORDER BY created_at DESC 
      LIMIT $1
    `;
    
    try {
      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch recent tasks: ${error.message}`);
    }
  }

  static async markAsCompleted(id) {
    const query = `
      UPDATE task 
      SET completed = true, updated_at = $1 
      WHERE id = $2 AND completed = false
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [new Date(), id]);
      if (result.rows.length === 0) {
        throw new Error('Task not found or already completed');
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to mark task as completed: ${error.message}`);
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM task WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to find task: ${error.message}`);
    }
  }
}

module.exports = Task;
