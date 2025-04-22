describe('Parcours utilisateur', () => {
  beforeEach(() => {
    // Configuration des logs Cypress
    Cypress.on('uncaught:exception', (err) => {
      console.error('Test error:', err);
      return false;
    });

    // Mock des appels API avec des stubs
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

    // Stub pour la requête de login
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

    cy.visit('/');
    cy.log('Page d\'accueil chargée');
  });

  it('devrait permettre à l\'utilisateur de naviguer sur la page d\'accueil', () => {
    cy.log('Vérification de la page d\'accueil');
    cy.get('main', { timeout: 10000 }).should('exist');
    cy.get('span').contains('Flowy').should('exist');
    cy.get('[data-testid="start-creating-button"]').should('exist');
  });

  it('devrait permettre à l\'utilisateur d\'accéder à la bibliothèque', () => {
    cy.log('Accès à la bibliothèque');
    cy.get('[data-testid="library-link"]').click();
    cy.url().should('include', '/shared-music');
    cy.wait('@getMusic', { timeout: 10000 });
    cy.get('[data-testid="music-list"]', { timeout: 10000 }).should('exist');
  });

  it('devrait permettre à l\'utilisateur de se connecter', () => {
    cy.log('Tentative de connexion');
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/auth');
    
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    
    cy.get('[data-testid="submit-login"]').click();
    
    cy.wait('@login', { timeout: 10000 });
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('devrait permettre à l\'utilisateur de télécharger une musique', () => {
    cy.log('Début du processus de téléchargement');
    
    // Se connecter d'abord
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="submit-login"]').click();
    
    // Attendre que la connexion soit terminée
    cy.wait('@login', { timeout: 10000 });
    
    // Aller à la page de téléchargement
    cy.get('[data-testid="add-music-link"]').click();
    
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
    cy.get('[data-testid="file-input"]').attachFile('test.mp3');
    
    // Remplir le titre
    cy.get('[data-testid="title-input"]').type('Nouvelle musique');
    
    // Soumettre le formulaire
    cy.get('[data-testid="submit-upload"]').click();
    
    // Vérifier que le téléchargement a réussi
    cy.wait('@uploadMusic', { timeout: 10000 });
    cy.get('[data-testid="success-message"]').should('contain', 'Musique téléchargée avec succès');
  });
}); 