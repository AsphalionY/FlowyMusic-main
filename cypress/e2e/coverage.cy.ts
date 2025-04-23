describe('Test de couverture', () => {
  it('devrait charger la page d\'accueil', () => {
    cy.visit('/');
    cy.get('h1').should('exist');
  });
}); 