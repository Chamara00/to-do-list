// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to create a task via API
Cypress.Commands.add('createTask', (title, description = '') => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3001/api/tasks',
    body: { title, description }
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body.data;
  });
});

// Custom command to get tasks via API
Cypress.Commands.add('getTasks', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3001/api/tasks'
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.data;
  });
});

// Custom command to complete a task via API
Cypress.Commands.add('completeTask', (taskId) => {
  cy.request({
    method: 'PUT',
    url: `http://localhost:3001/api/tasks/${taskId}/complete`
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.data;
  });
});
