# Backend - FlowyMusic

Cette partie du projet contient la logique serveur et l'API de FlowyMusic, responsable de la gestion des données et des interactions avec la base de données.

## Structure des dossiers

- `api/` - Points d'entrée de l'API REST
- `models/` - Modèles de données et schémas
- `services/` - Logique métier et services
- `utils/` - Fonctions utilitaires pour le backend
- `config/` - Fichiers de configuration

## Base de données

Le backend utilise Supabase pour la persistance des données. Les migrations se trouvent dans le dossier `supabase/migrations/`.

## Développement

Pour lancer le backend en mode développement:

```bash
npm run dev:backend
```

## API

Les principaux services exposés sont:

- Authentification (login, register, logout)
- Gestion de la musique (upload, recherche, partage)
- Profils utilisateurs
