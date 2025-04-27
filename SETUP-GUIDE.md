# Guide de configuration FlowyMusic avec Vercel et Supabase

Ce guide explique comment configurer votre application FlowyMusic pour utiliser Vercel (frontend) et Supabase (backend/BDD).

## 1. Cru00e9er un compte Supabase

1. Rendez-vous sur [Supabase](https://app.supabase.com) et cru00e9ez un compte ou connectez-vous
2. Cliquez sur "New Project" 
3. Entrez les informations suivantes :
   - **Name** : FlowyMusic
   - **Database Password** : Cru00e9ez un mot de passe fort (conservez-le !)
   - **Region** : Choisissez la ru00e9gion la plus proche de vous
   - **Pricing Plan** : Free tier

## 2. Configurer votre base de donnu00e9es Supabase

Apru00e8s cru00e9ation du projet (environ 1 minute) :

1. Allez dans l'onglet **Table Editor** dans le menu de gauche
2. Cliquez sur **New Table** et cru00e9ez ces tables :

### Table `users`

| Nom de colonne       | Type             | Default Value  | Is Primary Key | Is Nullable |
|---------------------|------------------|----------------|----------------|-------------|
| user_id             | int8             | IDENTITY       | ✅             | ❌          |
| username            | varchar          |                | ❌             | ❌          |
| email               | varchar          |                | ❌             | ❌          |
| password_hash       | varchar          |                | ❌             | ❌          |
| profile_image_url   | text             |                | ❌             | ✅          |
| bio                 | text             |                | ❌             | ✅          |
| created_at          | timestamptz      | now()          | ❌             | ❌          |
| updated_at          | timestamptz      | now()          | ❌             | ❌          |

- Ajoutez un index unique sur `email` et `username`

### Table `tracks`

| Nom de colonne       | Type             | Default Value  | Is Primary Key | Is Nullable |
|---------------------|------------------|----------------|----------------|-------------|
| track_id            | int8             | IDENTITY       | ✅             | ❌          |
| title               | varchar          |                | ❌             | ❌          |
| artist              | varchar          |                | ❌             | ❌          |
| category            | varchar          |                | ❌             | ✅          |
| duration            | varchar          |                | ❌             | ✅          |
| audio_url           | text             |                | ❌             | ❌          |
| plays               | int4             | 0              | ❌             | ❌          |
| user_id             | int8             |                | ❌             | ❌          |
| is_public           | boolean          | true           | ❌             | ❌          |
| created_at          | timestamptz      | now()          | ❌             | ❌          |
| updated_at          | timestamptz      | now()          | ❌             | ❌          |

- Ajoutez une foreign key de `user_id` vers `users.user_id`

## 3. Ru00e9cupu00e9rer vos identifiants Supabase

1. Allez dans **Settings** > **API** dans le menu de gauche
2. Notez les informations suivantes :
   - **Project URL** (ex: `https://abcdefghijkl.supabase.co`)
   - **anon public** key (commence par `eyJhbGci...`)

## 4. Configurer votre application FlowyMusic

1. Ouvrez votre fichier `.env` et ajoutez ces informations :

```
VITE_SUPABASE_URL=votre_project_url
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

2. Testez la connexion u00e0 Supabase avec :

```bash
npm run test:supabase
```

## 5. Configurer Vercel

1. Allez sur [Vercel](https://vercel.com) et cru00e9ez un compte
2. Importez votre projet GitHub/GitLab en cliquant sur "Add New..." > "Project"
3. Su00e9lectionnez votre du00e9pu00f4t FlowyMusic
4. Dans la section **Environment Variables**, ajoutez :
   - `VITE_SUPABASE_URL` = votre_project_url
   - `VITE_SUPABASE_ANON_KEY` = votre_anon_key
5. Cliquez sur "Deploy"

## Bu00e9nu00e9fices de cette architecture

- **Frontend optimisu00e9** : Vercel du00e9ploie automatiquement votre application React
- **Backend sans serveur** : Supabase gu00e8re la base de donnu00e9es et l'API
- **Authentification** : Fonctionnalitu00e9s d'authentification su00e9curisu00e9es via Supabase
- **Stockage** : Stockage pour les fichiers audio via Supabase Storage

## Gu00e9rer les utilisateurs de test

Pour cru00e9er un utilisateur de test dans Supabase :

1. Allez dans l'onglet **Table Editor** > table `users`
2. Cliquez sur "Insert row"
3. Remplissez les informations de l'utilisateur
4. Cliquez sur "Save"

## Pour du00e9velopper en local

Pour tester localement avec Supabase :

```bash
npm run dev
```

Cela lancera votre application qui se connectera u00e0 votre projet Supabase en utilisant les variables d'environnement.
