/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-axe" />
/// <reference types="cypress-file-upload" />

import '@testing-library/cypress/add-commands';
import 'cypress-axe';
import 'cypress-file-upload';
import '@cypress/code-coverage/support';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login to the application
       * @example cy.login('email@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>
    }
  }
}

// Add custom command implementation
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
})