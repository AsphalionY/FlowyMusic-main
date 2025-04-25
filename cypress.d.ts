import 'cypress';
import '@testing-library/cypress';
import 'cypress-axe';

// Étendre le type Chainable de Cypress
declare global {
  namespace Cypress {
    interface Chainable<Subject = unknown> {
      /**
       * Custom command to login to the application
       * @example cy.login('email@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;
    }
  }
}