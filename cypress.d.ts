/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-axe" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to login to the application
     * @example cy.login('email@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>;
  }
} 