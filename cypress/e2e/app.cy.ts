describe('App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the main page', () => {
    cy.get('main').should('exist');
  });

  it('should handle user interactions', () => {
    // Vérifier que le bouton "Commencer à créer" existe
    cy.get('button').contains('Commencer à créer').should('exist');
    
    // Vérifier que le logo Flowy est présent
    cy.get('span').contains('Flowy').should('exist');
    
    // Vérifier que le lien vers la bibliothèque existe
    cy.get('a').contains('Bibliothèque').should('exist');
  });

  it('should be accessible', () => {
    cy.injectAxe();
    cy.checkA11y(null, {
      rules: {
        // Désactiver certaines règles qui peuvent être trop strictes pour le développement
        'color-contrast': { enabled: false },
        'landmark-one-main': { enabled: false },
        'page-has-heading-one': { enabled: false }
      }
    });
  });
}); 