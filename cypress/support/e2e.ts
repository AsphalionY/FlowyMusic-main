// Import des types Cypress
import 'cypress';
import '@testing-library/cypress';
import '@testing-library/cypress/add-commands';
import 'cypress-axe';
import 'cypress-file-upload';
import '@cypress/code-coverage/support';

// Les types personnalisés sont définis dans cypress.d.ts

// Add custom command implementation
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
})