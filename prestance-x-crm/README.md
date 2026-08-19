# Prestance X — Mini CRM

Ce dépôt contient une application Mini CRM full-stack développée pour la
gestion des prospects d'une petite activité (« Prestance X »). L'application
est composée d'une API Node/Express (backend) et d'une interface client
React (frontend). Le projet a été réalisé dans le cadre du
programme « Future Interns — Full Stack Web Development Internship ».

## Description

Prestance X est une application interne simple permettant :
- la gestion des prospects (CRUD) ;
- le suivi des statuts (New → Contacted → Converted) ;
- l'ajout de notes de suivi par prospect ;
- la gestion des utilisateurs (comptes Admin / Commercial) avec contrôle
  d'accès par rôle ;
- un tableau de bord présentant des statistiques et les prospects récents.

L'API est conçue pour être connectable ultérieurement à un formulaire
de contact public (champ `lead_source` par défaut = `Website`).

## Fonctionnalités principales

- Authentification JWT (login) ;
- Rôles : `admin` (accès complet) et `commercial` (accès restreint) ;
- CRUD complet pour les prospects (`/api/leads`) avec filtres, recherche et
  pagination ;
- Ajout / consultation / suppression de notes liées à un prospect ;
- Gestion des utilisateurs (`/api/users`, Admin uniquement) ;
- Dashboard (`/api/dashboard/stats`) fournissant totaux et récents ;
- Interface React/Vite responsive (Tailwind CSS) avec prise en charge de
  deux langues (français / anglais).

## Technologies

- Frontend : React, Vite, Tailwind CSS, React Router, Axios
- Backend : Node.js, Express.js
- Base de données : MySQL (utilise `mysql2`)
- Auth : JWT, mots de passe hachés avec `bcrypt`

## Arborescence (extrait)

```
prestance-x-crm/
├── backend/
│   ├── config/           # connexion MySQL
│   ├── controllers/      # logique métier (auth, leads, users, notes, dashboard)
│   ├── database/         # schema.sql + seed.js
│   ├── middleware/       # auth / roles / validation / erreurs
│   ├── models/           # accès aux données (MySQL queries)
│   ├── routes/           # routes REST (/api/*)
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/          # instance Axios
    │   ├── components/   # composants réutilisables
    │   ├── context/      # Auth / Language
    │   ├── i18n/         # translations (fr / en)
    │   ├── pages/        # routes page-level
    │   └── App.jsx
    ├── index.html
    └── package.json
```

## Prérequis

- Node.js 18+ (ou version compatible)
- npm
- MySQL (ex. XAMPP, MariaDB, ou toute instance MySQL accessible)

## Configuration

- Copier les fichiers d'exemple d'environnement pour backend et frontend
  si nécessaire :

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

- Variables importantes (dans `backend/.env`)

- `PORT` : port du serveur Node (par défaut `5000`)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` : connexion MySQL
- `JWT_SECRET`, `JWT_EXPIRES_IN` : configuration JWT
- `CLIENT_URL` : origine frontend pour CORS (ex. `http://localhost:5173`)

Le fichier d'exemple est disponible : [backend/.env.example](backend/.env.example).

## Installation et exécution

1) Préparer la base de données

- Créez la base de données et les tables en important
  `backend/database/schema.sql` :

```bash
# en remplaçant les paramètres si besoin
mysql -u root -p < backend/database/schema.sql
```

2) Backend

```bash
cd backend
npm install
# copier .env.example puis ajuster les valeurs si nécessaire
cp .env.example .env
# (optionnel) insérer des données d'exemple
npm run seed
# démarrer en mode développement (nodemon)
npm run dev
```

Le backend écoute par défaut sur `http://localhost:5000`.

3) Frontend

```bash
cd frontend
npm install
# (optionnel) copier .env.example si fourni
cp .env.example .env
npm run dev
```

Le serveur Vite par défaut s'exécute sur `http://localhost:5173`.

## Points de configuration supplémentaires

- L'instance Axios côté frontend utilise `VITE_API_URL` (ou `http://localhost:5000/api` par défaut) :
  voir [frontend/src/api/axios.js](frontend/src/api/axios.js).
- Les traductions se trouvent dans [frontend/src/i18n/translations.js](frontend/src/i18n/translations.js).
- Le seed script (`backend/database/seed.js`) crée un compte Admin (d'après
  `SEED_ADMIN_*` dans `.env`) et un compte Commercial d'exemple
  (`commercial@prestancex.com` / `Commercial@12345`) si ces comptes
  n'existent pas déjà.

## Comptes de développement fournis (seed)

Le script de seed crée par défaut :

- Admin : email `admin@prestancex.com` (mot de passe par défaut défini
  via `SEED_ADMIN_PASSWORD` dans `backend/.env`, exemple : `Admin@12345`)
- Commercial : `commercial@prestancex.com` / `Commercial@12345`

Note : le seed n'écrase pas les comptes existants ; changez les valeurs
dans `backend/.env` avant d'exécuter `npm run seed` pour des identifiants
différents.

## API — aperçu rapide

Base URL : `http://localhost:5000/api`

- Auth
  - `POST /api/auth/login` — authentification (retourne JWT)
  - `GET /api/auth/me` — infos utilisateur (protected)
- Users (Admin only)
  - `GET /api/users`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id`
- Leads
  - `GET /api/leads` (filtres : `status`, `lead_source`, `interested_product`, `search`, `page`, `limit`)
  - `GET /api/leads/:id`, `POST /api/leads`, `PUT /api/leads/:id`, `PATCH /api/leads/:id/status`, `DELETE /api/leads/:id` (Admin required for delete)
- Notes
  - `GET /api/leads/:leadId/notes`, `POST /api/leads/:leadId/notes` (protected)
  - `DELETE /api/notes/:id` (Admin only)
- Dashboard
  - `GET /api/dashboard/stats` (protected)

Les routes protégées attendent un header `Authorization: Bearer <token>`.

## Bonnes pratiques / Sécurité

- Changez `JWT_SECRET` dans `backend/.env` pour une valeur forte en
  production.
- Ne stockez pas les fichiers `.env` dans un dépôt public. Utilisez les
  exemples (`.env.example`) et des mécanismes sécurisés pour la gestion
  des secrets en production.

## Améliorations possibles

- Exposer un endpoint public sécurisé pour la collecte automatique des
  leads depuis un formulaire de site web (rate-limiting, CAPTCHA).
- Notifications en temps réel (WebSocket) pour nouveaux leads ou mises
  à jour de statut.
- Pagination côté frontend améliorée (infinite scroll) et filtres plus
  avancés (dates, attribution).
- Tests automatisés (unit / integration) pour backend et frontend.

## Commandes utiles

```bash
# Backend
cd backend
npm run dev    # démarrage en dev (nodemon)
npm start      # démarrage en production
npm run seed    # exécute le seed pour insérer les comptes/données d'exemple

# Frontend
cd frontend
npm run dev     # démarre Vite (dev server)
npm run build   # build production
npm run preview # preview du build
```

## Licence

Projet conçu à des fins pédagogiques dans le cadre du programme Future
Interns. Libre d'utilisation pour des tests et de l'apprentissage.
