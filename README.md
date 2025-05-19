# Flowy Music

![HTML](https://img.shields.io/badge/HTML-5-orange?logo=html5&style=flat)
![TAILWIND CSS](https://img.shields.io/badge/TAILWIND-CSS-blue?logo=tailwindcss&style=flat)
![vite](https://img.shields.io/badge/VITE-blue?logo=vite&style=flat)
![TYPESCRIPT](https://img.shields.io/badge/Type-Script-blue?logo=Typescript&style=flat)
![TSX](https://img.shields.io/badge/TSX-TypeScript%20+%20JSX-blue?logo=typescript&style=flat)

##### Flowy est une application créée par l'organisation Codek.

Application de création et partage de musique avec architecture frontend/backend distincte.

## Nouvelle structure du projet

Le projet a été réorganisé avec une séparation claire entre le frontend et le backend :

```
FlowyMusic/
├── frontend/           # Interface utilisateur React
│   ├── src/            # Code source frontend
│   │   ├── components/ # Composants UI par fonctionnalité
│   │   ├── pages/      # Pages de l'application
│   │   ├── hooks/      # Hooks React personnalisés
│   │   ├── contexts/   # Contextes pour la gestion d'état
│   │   └── utils/      # Utilitaires frontend
│   └── public/         # Ressources statiques
│
├── backend/            # Serveur et API
│   ├── api/            # Points d'entrée API
│   ├── models/         # Modèles de données
│   ├── services/       # Services métier
│   └── utils/          # Utilitaires backend
│
├── database/           # Scripts et schémas de base de données
└── supabase/           # Configuration et migrations Supabase
```

## Technologies utilisées

### Frontend
- React avec TypeScript
- Tailwind CSS pour le styling
- Framer Motion pour les animations
- Radix UI pour les composants accessibles

### Backend
- Node.js avec Express
- TypeScript
- PostgreSQL via Supabase

##### Avec une interface simple, intuitive et rapide, Flowy transforme la création musicale en une expérience fluide et sans effort. Que vous soyez un musicien en herbe ou un pro, Flowy vous offre tout ce qu'il vous faut pour partager vos œuvres avec le monde entier.

## Fonctionnalités principales:
- **Creation de musique simplifiée**: Flowy permet l'utilisateur de publier leur musique sans difficulté et juste avec quelques clics, leur musique sera publié
 
- **Partage immédiat**: Partagez vos compositions en 1 seul clic sur vos profils sociaux ou partagez-le avec vos amis!

- **Bibliothèque d'effets et d'instruments**: Accédez à une vaste bibliothèque d'instruments virtuels et d'effets pour enrichir vos morceaux.

- **Collaboration en temps réel**:  Invitez d'autres musiciens à travailler sur vos projets ensemble, peu importe où ils se trouvent.

- **Personnalisation**: Personnalisez l'interface et le thème pour une expérience unique, à votre image.

---

**Pourquoi choisir Flowy** —
 Flowy ne se contente pas de vous permettre de créer de la musique, elle transforme la manière dont vous partagez vos créations. Grâce à sa technologie moderne (Vite, Tailwind CSS, TypeScript), l’application est non seulement ultra-rapide mais aussi parfaitement optimisée pour les performances sur tous les appareils. Vous pouvez vous concentrer sur votre art, sans être limité par la technologie.

 **Pour qui?** — Flowy est conçu pour tout le monde. Si vous êtes un créateur de musique qui souhaite partager ses œuvres sans complications techniques, ou un professionnel à la recherche d'un outil simple pour collaborer avec d'autres artistes, Flowy est l'outil qu'il vous faut.

## Déploiement sur Vercel

FlowyMusic est optimisé pour être déployé facilement sur Vercel. Pour assurer un déploiement sans problème, suivez ces étapes :

### Configuration des variables d'environnement

Ces variables sont **obligatoires** pour que l'application fonctionne correctement :

1. **VITE_SUPABASE_URL** - L'URL de votre projet Supabase
2. **VITE_SUPABASE_ANON_KEY** - La clé anonyme de votre projet Supabase

### Pour configurer sur Vercel

1. Depuis le tableau de bord de votre projet Vercel
2. Allez dans "Settings" -> "Environment Variables"
3. Ajoutez ces deux variables avec leurs valeurs respectives

### Déploiement local vs production

Pour tester localement :
- Créez un fichier `.env` à la racine du projet
- Ajoutez-y les variables mentionnées ci-dessus
- Exécutez `npm run dev`

Le déploiement sur Vercel se fera automatiquement à partir de votre dépôt Git.
