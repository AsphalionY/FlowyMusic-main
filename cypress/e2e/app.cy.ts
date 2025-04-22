describe('App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the main page', () => {
    cy.get('main').should('exist');
  });

  it('should handle user interactions', () => {
    cy.get('button').contains('click me').click();
    cy.contains('clicked').should('be.visible');
  });

  it('should be accessible', () => {
    cy.injectAxe();
    cy.checkA11y();
  });
}); 