declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login to the application
     * @example cy.login('email@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>

    /**
     * Custom command to attach a file to an input
     * @example cy.get('input[type="file"]').attachFile('test.mp3')
     */
    attachFile(fileName: string): Chainable<void>
  }
} 