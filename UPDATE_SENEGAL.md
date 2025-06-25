# 🇸🇳 MISE À JOUR COMPLÈTE SÉNÉGAL - VoteSecure

## 🔧 PROBLÈME 1: Authentification qui ne marche pas

### Étape 1: Vérifier le backend

1. Ouvrez `backend/src/controllers/authController.js`
2. À la ligne 65-75, assurez-vous d'avoir EXACTEMENT ce code :

```javascript
// Check account status
if (user.status === "pending") {
  return res.status(403).json({
    error: "Compte en attente de validation par un administrateur",
  });
}
if (user.status === "rejected") {
  return res.status(403).json({
    error: "Compte rejeté. Contactez un administrateur.",
  });
}
if (user.status === "blocked") {
  return res.status(403).json({
    error: "Compte bloqué. Contactez un administrateur.",
  });
}
```

### Étape 2: Redémarrer complètement

```bash
# Arrêter l'application (Ctrl+C)
cd backend
rm votesecure.db
npm run init-db
cd ..
npm run dev
```

## 🇸🇳 PROBLÈME 2: Sénégalisation Complète

### 1. Dans `src/pages/AdminDashboard.tsx` (lignes 88-105)

REMPLACER:

```javascript
const mockCandidates = [
  {
    id: "1",
    name: "Marie Dubois",
    email: "marie.dubois@email.fr",
    position: "Président",
    status: "approved",
    votes: 245,
  },
  {
    id: "2",
    name: "Pierre Martin",
    email: "pierre.martin@email.fr",
    position: "Vice-Président",
    status: "pending",
    votes: 189,
  },
  {
    id: "3",
    name: "Sophie Bernard",
    email: "sophie.bernard@email.fr",
    position: "Secrétaire",
    status: "rejected",
    votes: 156,
  },
```

PAR:

```javascript
const mockCandidates = [
  {
    id: "1",
    name: "Aissatou Diop",
    email: "aissatou.diop@email.sn",
    position: "Président",
    status: "approved",
    votes: 245,
  },
  {
    id: "2",
    name: "Mamadou Sall",
    email: "mamadou.sall@email.sn",
    position: "Vice-Président",
    status: "pending",
    votes: 189,
  },
  {
    id: "3",
    name: "Fatou Ndiaye",
    email: "fatou.ndiaye@email.sn",
    position: "Secrétaire",
    status: "rejected",
    votes: 156,
  },
```

### 2. Dans `src/pages/AdminDashboard.tsx` (ligne 399)

REMPLACER:

```javascript
<span>Candidature de Marie Dubois approuvée</span>
```

PAR:

```javascript
<span>Candidature d'Aissatou Diop approuvée</span>
```

### 3. Dans `src/pages/ResultsPage.tsx` (ligne 32)

REMPLACER:

```javascript
title: "Élection du Conseil d'Administration 2024",
```

PAR:

```javascript
title: "Élection Présidentielle Sénégal 2024",
```

### 4. Dans `src/pages/ResultsPage.tsx` (lignes 38-40)

REMPLACER:

```javascript
title: "Président du Conseil",
description: "Direction générale de l'organisation",
```

PAR:

```javascript
title: "Président de la République",
description: "Chef de l'État du Sénégal",
```

### 5. Dans `src/pages/ResultsPage.tsx` (lignes 64-76)

REMPLACER:

```javascript
candidates: [
  {
    id: "1",
    name: "Pierre Martin",
    votes: 112,
    percentage: 59.3,
    party: "Parti A",
    isWinner: true,
  },
  {
    id: "2",
    name: "Marie Dubois",
    votes: 77,
    percentage: 40.7,
    party: "Parti B",
    isWinner: false,
  },
],
```

PAR:

```javascript
candidates: [
  {
    id: "1",
    name: "Ousmane Diouf",
    votes: 112,
    percentage: 59.3,
    party: "Coalition Yewwi",
    isWinner: true,
  },
  {
    id: "2",
    name: "Aissatou Diop",
    votes: 77,
    percentage: 40.7,
    party: "Benno Bokk Yakaar",
    isWinner: false,
  },
],
```

### 6. Dans `src/pages/ResultsPage.tsx` (lignes 81-83)

REMPLACER:

```javascript
title: "Vice-Président",
description: "Assistance à la direction générale",
```

PAR:

```javascript
title: "Député National",
description: "Représentation à l'Assemblée Nationale",
```

### 7. Dans `src/pages/ResultsPage.tsx` (lignes 86-110)

REMPLACER:

```javascript
candidates: [
  {
    id: "3",
    name: "Jean Rousseau",
    votes: 89,
    percentage: 48.1,
    party: "Parti C",
    isWinner: true,
  },
  {
    id: "4",
    name: "Claire Moreau",
    votes: 67,
    percentage: 36.2,
    party: "Parti D",
    isWinner: false,
  },
  {
    id: "5",
    name: "Paul Durand",
    votes: 29,
    percentage: 15.7,
    party: "Parti E",
    isWinner: false,
  },
],
```

PAR:

```javascript
candidates: [
  {
    id: "3",
    name: "Mamadou Fall",
    votes: 89,
    percentage: 48.1,
    party: "Pastef",
    isWinner: true,
  },
  {
    id: "4",
    name: "Aminata Touré",
    votes: 67,
    percentage: 36.2,
    party: "APR",
    isWinner: false,
  },
  {
    id: "5",
    name: "Ibrahima Ba",
    votes: 29,
    percentage: 15.7,
    party: "PDS",
    isWinner: false,
  },
],
```

## 🧪 TEST FINAL

### Étape 1: Test d'inscription

1. Allez sur la page d'accueil
2. Cliquez "S'inscrire"
3. Remplissez avec vos vraies informations
4. Rôle: Électeur
5. Cliquez "S'inscrire"

### Étape 2: Validation admin

1. Connectez-vous : `admin@votesecure.sn` / `admin123`
2. Allez dans "Gestion des électeurs"
3. Trouvez votre compte en statut "En attente"
4. Cliquez "Valider"

### Étape 3: Test de connexion

1. Déconnectez-vous
2. Reconnectez-vous avec VOS identifiants
3. ✅ **DEVRAIT MARCHER !**

## 🎯 COMPTES DE TEST SÉNÉGAL

| Rôle       | Email                  | Mot de passe |
| ---------- | ---------------------- | ------------ |
| Admin      | admin@votesecure.sn    | admin123     |
| Candidate  | aissatou.diop@email.sn | candidate123 |
| Électeur   | mamadou.fall@email.sn  | voter123     |
| Spectateur | fatou.sarr@email.sn    | spectator123 |

## ✅ RÉSULTAT ATTENDU

- ✅ Nouveaux utilisateurs peuvent se connecter après validation
- ✅ Tous les noms sont sénégalais (Ousmane, Aissatou, Mamadou...)
- ✅ Tous les emails finissent par .sn
- ✅ Partis politiques sénégalais (Pastef, APR, PDS...)
- ✅ Contexte électoral sénégalais
