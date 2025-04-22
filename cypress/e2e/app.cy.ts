describe('Parcours utilisateur', () => {
  beforeEach(() => {
    // Mock des appels API
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com'
        }
      }
    }).as('getUser');

    cy.intercept('GET', '/api/music', {
      statusCode: 200,
      body: {
        tracks: [
          {
            id: '1',
            title: 'Test Track 1',
            artist: 'Test Artist',
            duration: 180
          },
          {
            id: '2',
            title: 'Test Track 2',
            artist: 'Test Artist',
            duration: 240
          }
        ]
      }
    }).as('getMusic');

    cy.visit('/');
  });

  it('devrait permettre à l\'utilisateur de naviguer sur la page d\'accueil', () => {
    // Vérifier que la page d'accueil est chargée
    cy.get('main').should('exist');
    cy.get('span').contains('Flowy').should('exist');
    
    // Vérifier que le bouton de création est présent
    cy.get('button').contains('Commencer à créer').should('exist');
  });

  it('devrait permettre à l\'utilisateur d\'accéder à la bibliothèque', () => {
    // Cliquer sur le lien de la bibliothèque
    cy.get('a').contains('Bibliothèque').click();
    
    // Vérifier que nous sommes sur la page de la bibliothèque
    cy.url().should('include', '/shared-music');
    
    // Vérifier que la liste de musique est chargée
    cy.wait('@getMusic');
    cy.get('[data-testid="music-list"]').should('exist');
  });

  it('devrait permettre à l\'utilisateur de se connecter', () => {
    // Cliquer sur le bouton de connexion
    cy.get('button').contains('Connexion').click();
    
    // Vérifier que nous sommes sur la page de connexion
    cy.url().should('include', '/auth');
    
    // Remplir le formulaire de connexion
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    
    // Mock de la réponse de connexion
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com'
        }
      }
    }).as('login');
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Vérifier que la connexion a réussi
    cy.wait('@login');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('devrait permettre à l\'utilisateur de télécharger une musique', () => {
    // Se connecter d'abord
    cy.get('button').contains('Connexion').click();
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Aller à la page de téléchargement
    cy.get('a').contains('Ajouter une musique').click();
    
    // Mock du téléchargement de fichier
    cy.intercept('POST', '/api/music/upload', {
      statusCode: 200,
      body: {
        success: true,
        track: {
          id: '3',
          title: 'Nouvelle musique',
          artist: 'testuser',
          duration: 180
        }
      }
    }).as('uploadMusic');
    
    // Sélectionner un fichier
    cy.get('input[type="file"]').attachFile('test.mp3');
    
    // Remplir le titre
    cy.get('input[name="title"]').type('Nouvelle musique');
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Vérifier que le téléchargement a réussi
    cy.wait('@uploadMusic');
    cy.get('.success-message').should('contain', 'Musique téléchargée avec succès');
  });
}); 