-- Create the task table
CREATE TABLE IF NOT EXISTS task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on created_at for efficient ordering
CREATE INDEX IF NOT EXISTS idx_task_created_at ON task(created_at DESC);

-- Create an index on completed for efficient filtering
CREATE INDEX IF NOT EXISTS idx_task_completed ON task(completed);

-- Insert some sample data for testing
INSERT INTO task (title, description, completed) VALUES
('Buy books', 'Buy books for the next school year', false),
('Clean home', 'Need to clean the bed room', false),
('Takehome assignment', 'Finish the mid-term assignment', false),
('Play Cricket', 'Plan the soft ball cricket match on next Sunday', false),
('Help Saman', 'Saman need help with his software project', false);
