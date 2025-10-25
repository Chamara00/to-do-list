describe('To-Do Application E2E Tests', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/');
    
    // Wait for the page to load
    cy.get('[data-testid="app"]', { timeout: 10000 }).should('be.visible');
  });

  it('should display the application title and subtitle', () => {
    cy.contains('To-Do App').should('be.visible');
    cy.contains('Stay organized and get things done').should('be.visible');
  });

  it('should show empty state when no tasks exist', () => {
    // Clear any existing tasks
    cy.getTasks().then((tasks) => {
      tasks.forEach((task) => {
        cy.completeTask(task.id);
      });
    });

    cy.reload();
    
    cy.contains('No tasks yet. Create your first task!').should('be.visible');
  });

  it('should create a new task', () => {
    const taskTitle = 'E2E Test Task';
    const taskDescription = 'This is a test task created during E2E testing';

    // Fill in the form
    cy.get('input[name="title"]').type(taskTitle);
    cy.get('textarea[name="description"]').type(taskDescription);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify the task appears in the list
    cy.contains(taskTitle).should('be.visible');
    cy.contains(taskDescription).should('be.visible');
  });

  it('should create a task without description', () => {
    const taskTitle = 'Task without description';

    // Fill in only the title
    cy.get('input[name="title"]').type(taskTitle);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify the task appears in the list
    cy.contains(taskTitle).should('be.visible');
  });

  it('should not create a task with empty title', () => {
    const taskDescription = 'This should not be created';

    // Fill in only the description
    cy.get('textarea[name="description"]').type(taskDescription);

    // Try to submit the form
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should mark a task as completed', () => {
    // Create a task first
    const taskTitle = 'Task to be completed';
    cy.get('input[name="title"]').type(taskTitle);
    cy.get('button[type="submit"]').click();

    // Verify the task is visible
    cy.contains(taskTitle).should('be.visible');

    // Click the Done button
    cy.contains('button', 'Done').click();

    // Verify the task is no longer visible
    cy.contains(taskTitle).should('not.exist');
  });

  it('should handle multiple tasks correctly', () => {
    const tasks = [
      { title: 'First Task', description: 'First description' },
      { title: 'Second Task', description: 'Second description' },
      { title: 'Third Task', description: 'Third description' }
    ];

    // Create multiple tasks
    tasks.forEach((task) => {
      cy.get('input[name="title"]').clear().type(task.title);
      cy.get('textarea[name="description"]').clear().type(task.description);
      cy.get('button[type="submit"]').click();
    });

    // Verify all tasks are visible
    tasks.forEach((task) => {
      cy.contains(task.title).should('be.visible');
      cy.contains(task.description).should('be.visible');
    });

    // Complete one task
    cy.contains('button', 'Done').first().click();

    // Verify only 2 tasks remain
    cy.get('[data-testid="task-card"]').should('have.length', 2);
  });

  it('should show only the 5 most recent tasks', () => {
    // Create 6 tasks
    for (let i = 1; i <= 6; i++) {
      cy.get('input[name="title"]').clear().type(`Task ${i}`);
      cy.get('textarea[name="description"]').clear().type(`Description ${i}`);
      cy.get('button[type="submit"]').click();
    }

    // Verify only 5 tasks are visible (most recent)
    cy.get('[data-testid="task-card"]').should('have.length', 5);

    // Verify the oldest task (Task 1) is not visible
    cy.contains('Task 1').should('not.exist');
    
    // Verify the newest tasks are visible
    cy.contains('Task 6').should('be.visible');
    cy.contains('Task 5').should('be.visible');
  });

  it('should handle form validation', () => {
    // Test title too long
    const longTitle = 'a'.repeat(256);
    cy.get('input[name="title"]').type(longTitle);
    cy.get('button[type="submit"]').should('be.disabled');

    // Test valid title
    cy.get('input[name="title"]').clear().type('Valid Title');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should handle network errors gracefully', () => {
    // Intercept API calls and return error
    cy.intercept('POST', '**/api/tasks', { statusCode: 500, body: { message: 'Server error' } }).as('createTaskError');
    cy.intercept('GET', '**/api/tasks', { statusCode: 500, body: { message: 'Server error' } }).as('getTasksError');

    cy.reload();

    // Try to create a task
    cy.get('input[name="title"]').type('Test Task');
    cy.get('button[type="submit"]').click();

    // Should show error message
    cy.contains('Failed to create task').should('be.visible');
  });

  it('should be responsive on mobile devices', () => {
    // Set mobile viewport
    cy.viewport(375, 667);

    // Verify the layout is responsive
    cy.get('.main-content').should('be.visible');
    
    // Create a task to test functionality
    cy.get('input[name="title"]').type('Mobile Test Task');
    cy.get('button[type="submit"]').click();
    cy.contains('Mobile Test Task').should('be.visible');
  });
});
