# 🗳️ VoteSecure - Plateforme de Vote Électronique

Découvrez notre plateforme de vote électronique en ligne :  
🔗 **Accédez à l'application ici** 👉 [https://site-election.vercel.app](https://site-election.vercel.app)

Pour tester directement les fonctionnalités de l’application, vous pouvez utiliser l’un des comptes suivants :

| Rôle           | Email                           | Mot de passe   |
|----------------|----------------------------------|----------------|
| 🛠️ Admin       | admin@votesecure.sn              | admin123       |
| 👤 Candidat     | aissatou.diop@education.sn       | candidate123   |
| 🗳️ Électeur     | mamadou.fall@education.sn        | voter123       |
| 👁️ Spectateur  | fatou.sarr@education.sn          | spectator123   |

L’application est pré-remplie avec des comptes utilisateurs et des élections fictives afin de vous offrir un premier aperçu complet dès la connexion.

Toujours afficher les détails

Copier
from pathlib import Path

readme_path = Path("/mnt/data/README.md")
readme_content = readme_path.read_text()

# Nouvelle section à insérer
functionality_section = """
## 🧭 Fonctionnement de l'application

L'application **VoteSecure** fonctionne selon un modèle d'interaction fluide entre les différents rôles d'utilisateurs :

### 🔐 Inscription et Authentification

- Tout utilisateur peut s’inscrire via la plateforme, que ce soit comme **candidat**, **électeur** ou **spectateur**.
- Lorsqu’un utilisateur s’inscrit, son compte reste en **statut “En attente”** jusqu’à **validation manuelle** par un administrateur (par défaut).
- L'administrateur peut choisir d’**activer la validation automatique** des comptes via les paramètres du tableau de bord.

### 🧑‍💼 Rôle de l’Administrateur

- Gère la **validation ou le rejet** des utilisateurs nouvellement inscrits.
- Peut créer, modifier ou supprimer des **élections**, ainsi que les **postes** à pourvoir.
- Peut suivre les **statistiques en temps réel** sur la participation, les inscriptions et les votes.
- Paramètre les règles du système via l’interface d’administration (activation des candidatures, clôture du vote, etc.).

### 🗳️ Rôle du Candidat

- Une fois validé, un **candidat** peut accéder à son **tableau de bord** et soumettre une **candidature** à un poste dans une élection en cours.
- Le candidat peut consulter l’état de sa candidature et les résultats après la clôture des élections.

### 🧑‍🤝‍🧑 Rôle de l’Électeur

- Un **électeur validé** peut accéder à la section **"Voter"**, choisir une élection ouverte et exprimer son vote.
- Le système garantit qu’un électeur ne vote qu’une seule fois par élection.

### 👁️ Rôle du Spectateur

- Les utilisateurs en mode **spectateur** peuvent uniquement **consulter les résultats** publics des élections disponibles.

### 🗂️ Données Fictives

- Pour faciliter la démonstration, plusieurs comptes (admin, électeur, candidat, spectateur) ainsi qu’une **élection fictive avec des postes** et des candidatures ont déjà été créés.
- Ces données permettent de tester l’ensemble du processus dès le premier lancement.

---

L’ensemble de ces interactions est orchestré via des appels sécurisés à l’API backend (Node.js + Express), avec une gestion des statuts et rôles au niveau de la base de données SQLite.
"""


## 🏗️ Architecture

```
VoteSecure/
├── frontend/          # Application React (Vite + TypeScript)
├── backend/           # API Node.js + Express + SQLite
├── .env              # Variables d'environnement frontend
└── package.json      # Scripts de gestion globale
```

## 🚀 Installation et Démarrage Rapide

### Prérequis

- **Node.js** 18+ et **npm**
- **Git** (recommandé)

### 1. Installation complète

```bash
# Cloner le projet (si depuis Git)
git clone <url-du-projet>
cd VoteSecure

# Installation complète (frontend + backend + base de données)
npm run setup
```

### 2. Démarrage en développement

```bash
# Démarre automatiquement frontend (port 5173) et backend (port 3001)
npm run dev
```

L'application sera accessible sur :

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3001/api

## 🎯 Fonctionnalités

### ✅ **Système d'authentification sécurisé**

- JWT tokens avec expiration
- Mots de passe hashés (bcrypt)
- Protection par rôles et statuts

### ✅ **Gestion des utilisateurs**

- 4 rôles : Admin, Candidat, Électeur, Spectateur
- Validation des comptes par les administrateurs
- Statuts : En attente, Approuvé, Rejeté, Bloqué

### ✅ **Base de données relationnelle**

- SQLite (facile à migrer vers PostgreSQL)
- Tables : users, elections, positions, candidates, votes
- Relations et contraintes de données

### ✅ **Interface d'administration**

- Dashboard avec statistiques en temps réel
- Gestion des électeurs et candidats
- Validation des inscriptions

### ✅ **Sécurité renforcée**

- Rate limiting sur les APIs
- Validation des données (express-validator)
- Headers de sécurité (helmet)
- CORS configuré

## 🔐 Comptes de Test

| Rôle           | Email                 | Mot de passe |
| -------------- | --------------------- | ------------ |
| **Admin**      | admin@votesecure.sn   | admin123     |
| **Candidat**   | aissatou.diop@education.sn | candidate123 |
| **Électeur**   | mamadou.fall@education.sn  | voter123     |
| **Spectateur** |  fatou.sarr@education.sn   | spectator123 |

## 📁 Structure Détaillée

### Backend (`/backend/`)

```
backend/
├── src/
│   ├── controllers/     # Logique métier (auth, users)
│   ├── middleware/      # Authentification, validation
│   ├── routes/          # Routes API
│   └── database/        # Configuration DB + init
├── .env                 # Config backend
├── package.json
└── server.js           # Point d'entrée
```

### Frontend (`/src/`)

```
src/
├── components/          # Composants UI réutilisables
├── context/            # AuthContext (gestion d'état)
├── lib/                # API client + types
├── pages/              # Pages de l'application
└── App.tsx             # Point d'entrée React
```

## 🛠️ Scripts Disponibles

### Scripts globaux (à la racine)

```bash
npm run dev            # Démarre frontend + backend
npm run setup          # Installation complète
npm run dev:frontend   # Frontend uniquement
npm run dev:backend    # Backend uniquement
npm run build          # Build de production
```

### Scripts backend (`cd backend/`)

```bash
npm run dev            # Développement avec nodemon
npm run start          # Production
npm run init-db        # Réinitialise la base de données
```

## 🔧 Configuration

### Variables d'environnement

**Frontend (`.env`)** :

```env
VITE_API_URL=http://localhost:3001/api
```

**Backend (`backend/.env`)** :

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
DB_NAME=votesecure.db
CORS_ORIGIN=http://localhost:5173
```

## 📊 Base de Données

### Tables principales

- **users** : Comptes utilisateurs avec authentification
- **elections** : Élections avec périodes et statuts
- **positions** : Postes à pourvoir dans chaque élection
- **candidates** : Candidatures liées aux postes
- **votes** : Votes exprimés (anonymisés)

### Localisation de la DB

```
backend/votesecure.db
```

## 🚀 Déploiement en Production

### 1. Build de production

```bash
npm run build
```

### 2. Variables d'environnement de production

- Changer `JWT_SECRET` avec une clé sécurisée
- Configurer `CORS_ORIGIN` avec le domaine de production
- Utiliser `NODE_ENV=production`

### 3. Migration vers PostgreSQL (recommandé)

La structure actuelle peut facilement migrer vers PostgreSQL :

```bash
npm install pg
# Adapter les requêtes SQL dans les controllers
```

## 🆘 Dépannage

### Le backend ne démarre pas

```bash
cd backend
npm install
npm run init-db
npm run dev
```

### Erreur de CORS

Vérifiez que `CORS_ORIGIN` dans `backend/.env` correspond à l'URL du frontend.

### Base de données corrompue

```bash
cd backend
rm votesecure.db
npm run init-db
```

### Ports occupés

- Changer `PORT` dans `backend/.env`
- Ou tuer les processus : `lsof -ti:3001 | xargs kill -9`

## 📈 Développement Futur

### Fonctionnalités prévues

- [ ] Système de vote en temps réel
- [ ] Gestion complète des élections
- [ ] Résultats avec graphiques
- [ ] Audit trail et logging
- [ ] Interface mobile responsive
- [ ] Notifications en temps réel

### Améliorations techniques

- [ ] Migration PostgreSQL
- [ ] Cache Redis
- [ ] Tests automatisés
- [ ] CI/CD Pipeline
- [ ] Monitoring et métriques

## 📞 Support

Pour toute question ou problème :

1. Vérifiez ce README
2. Consultez les logs : `npm run dev`
3. Réinitialisez : `npm run setup`

---

**VoteSecure** - Vote électronique sécurisé et transparent 🔐✅
