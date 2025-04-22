# FlowyMusic

Une application de musique moderne construite avec React, TypeScript, et Vite.

## Fonctionnalités

- Interface utilisateur moderne et responsive
- Gestion de la musique en temps réel
- Thème sombre/clair
- Tests unitaires et E2E
- Analyse de bundle
- Accessibilité (a11y)
- Sécurité renforcée

## Prérequis

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Crée une version de production
- `npm run preview` - Prévisualise la version de production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run lint:fix` - Corrige automatiquement les problèmes ESLint
- `npm run format` - Formate le code avec Prettier
- `npm run test` - Lance les tests unitaires
- `npm run test:watch` - Lance les tests en mode watch
- `npm run test:coverage` - Génère un rapport de couverture des tests
- `npm run cypress:open` - Ouvre Cypress pour les tests E2E
- `npm run cypress:run` - Lance les tests Cypress en mode headless
- `npm run audit` - Vérifie les vulnérabilités de sécurité
- `npm run analyze` - Analyse la taille du bundle

## Structure du projet

```
src/
  ├── components/     # Composants React
  ├── hooks/         # Hooks personnalisés
  ├── pages/         # Pages de l'application
  ├── styles/        # Styles CSS
  ├── utils/         # Utilitaires
  └── __tests__/     # Tests unitaires
cypress/
  ├── e2e/          # Tests E2E
  └── support/      # Configuration Cypress
```

## Tests

### Tests unitaires

Les tests unitaires sont écrits avec Jest et React Testing Library. Exécutez :

```bash
npm run test
```

### Tests E2E

Les tests E2E sont écrits avec Cypress. Exécutez :

```bash
npm run cypress:open
```

## Qualité de code

- ESLint pour le linting
- Prettier pour le formatage
- Jest pour les tests unitaires
- Cypress pour les tests E2E
- Bundle analyzer pour l'optimisation
- Axe pour l'accessibilité

## Sécurité

- Vérification régulière des vulnérabilités avec `npm audit`
- ESLint Security Plugin pour la détection des problèmes de sécurité
- Bonnes pratiques de sécurité implémentées

## Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Licence

MIT