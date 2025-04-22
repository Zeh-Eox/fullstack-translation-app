# 🌍 Application Fullstack React + Laravel

Cette application facilite la création de correspondances linguistiques (ex : français <-> anglais) pour constituer un **corpus de données** destiné à l'entraînement de modèles d'intelligence artificielle. Le système inclut une **authentification complète** et une interface intuitive pour gérer les contributions multilingues.

## 📦 Tech Stack

- **Frontend** : React 18 avec Vite, Tailwind CSS
- **Backend** : Laravel 10 avec Sanctum (API RESTful)
- **Base de données** : SQLite
- **Containerisation** : Docker & Docker Compose
- **Package Manager** : `pnpm` (Frontend), `composer` (Backend)

## 🚀 Fonctionnalités principales

- ✍️ **Gestion de correspondances** : Création et édition de paires linguistiques
- 🔐 **Authentification sécurisée** : Inscription, connexion et déconnexion
- 👤 **Profil utilisateur** : Suivi des contributions et préférences
- 🔌 **API robuste** : Endpoints RESTful protégés par tokens (Laravel Sanctum)
- 📱 **Design responsive** : Interface adaptée à tous les appareils

## 🛠️ Installation & Démarrage

### Prérequis

- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Node.js](https://nodejs.org/) (v16+)
- [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)
- [Git](https://git-scm.com/downloads)

### Étape 1: Cloner le projet

```bash
git clone https://github.com/Zeh-Eox/fullstack-translation-app.git
cd fullstack-translation-app
```

### Étape 2: Configurer et lancer le backend

```bash
cd backend

# Copier le fichier d'environnement
cp .env.example .env

# Lancer les conteneurs Docker
docker compose up -d

# Installer les dépendances et configurer l'application
docker compose exec app composer install
docker compose exec app php artisan migrate
docker compose exec app php artisan db:seed  # Optionnel - données de démonstration
```

### Étape 3: Configurer et lancer le frontend

```bash
cd ../frontend

# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm run dev
```

L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
.
├── backend/                  # API Laravel
│   ├── app/                  # Logique de l'application
│   │   ├── Http/Controllers/ # Contrôleurs API
│   │   └── Models/           # Modèles de données
│   ├── database/             # Migrations et seeds
│   ├── routes/               # Configuration des routes API
│   ├── docker-compose.yml    # Configuration Docker
│   └── ...
│
└── frontend/                 # Application React
    ├── src/
    │   ├── components/       # Composants React
    │   ├── pages/            # Pages de l'application
    │   ├── context/          # Contextes React (auth, etc.)
    │   ├── services/         # Services API
    │   └── App.jsx           # Composant racine
    ├── docker-compose.yml    # Configuration Docker
    └── ...
```
