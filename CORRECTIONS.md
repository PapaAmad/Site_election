# 🔧 Corrections à Appliquer - VoteSecure Sénégal

## 📋 Liste des Problèmes et Solutions

### 1. ❌ Problème d'authentification des nouveaux utilisateurs

**Problème**: Les utilisateurs validés par l'admin ne peuvent pas se connecter
**Cause**: Le backend refuse les connexions des comptes "pending"

**Solution**: Modifier `backend/src/controllers/authController.js` ligne 66-70

```javascript
// REMPLACER CETTE LIGNE:
if (user.status === "rejected" || user.status === "blocked") {

// PAR CES LIGNES:
if (user.status === "pending") {
  return res.status(403).json({
    error: "Compte en attente de validation par un administrateur",
  });
}
if (user.status === "rejected" || user.status === "blocked") {
```

### 2. 🇸🇳 Sénégalisation des Données

**Modifier ces fichiers pour remplacer les infos françaises par sénégalaises:**

#### `backend/src/database/init.js` - Ligne 94:

```javascript
// REMPLACER:
"admin@votesecure.fr";
// PAR:
"admin@votesecure.sn";
```

#### Lignes 112-156 - Remplacer tous les noms français:

```javascript
// REMPLACER:
"marie.dubois@email.fr", "Marie", "Dubois";
// PAR:
"aissatou.diop@email.sn", "Aissatou", "Diop";

// REMPLACER:
"jean.dupont@email.fr", "Jean", "Dupont";
// PAR:
"mamadou.fall@email.sn", "Mamadou", "Fall";

// REMPLACER:
"paul.martin@email.fr", "Paul", "Martin";
// PAR:
"fatou.sarr@email.sn", "Fatou", "Sarr";

// REMPLACER:
"claire.moreau@email.fr", "Claire", "Moreau";
// PAR:
"aminata.ndiaye@email.sn", "Aminata", "Ndiaye";

// REMPLACER:
"lucas.bernard@email.fr", "Lucas", "Bernard";
// PAR:
"ibrahima.ba@email.sn", "Ibrahima", "Ba";
```

#### `src/lib/api.ts` - Ligne 208-220:

```javascript
// REMPLACER toutes les références françaises:
const testAccounts: Record<string, { password: string; user: any }> = {
  "admin@votesecure.sn": {
    password: "admin123",
    user: { id: "admin_1", email: "admin@votesecure.sn", firstName: "Admin", lastName: "System", role: "admin", status: "approved" }
  },
  "aissatou.diop@email.sn": {
    password: "candidate123",
    user: { id: "candidate_1", email: "aissatou.diop@email.sn", firstName: "Aissatou", lastName: "Diop", role: "candidate", status: "approved" }
  },
  "mamadou.fall@email.sn": {
    password: "voter123",
    user: { id: "voter_1", email: "mamadou.fall@email.sn", firstName: "Mamadou", lastName: "Fall", role: "voter", status: "approved" }
  },
  "fatou.sarr@email.sn": {
    password: "spectator123",
    user: { id: "spectator_1", email: "fatou.sarr@email.sn", firstName: "Fatou", lastName: "Sarr", role: "spectator", status: "approved" }
  }
};
```

### 3. 📱 Boutons Non Fonctionnels

**Problème**: Guide d'utilisation, Support, Paramètres ne font rien

#### Solution A - `src/pages/AdminSettings.tsx`:

Ajouter ces fonctions après la ligne 50:

```javascript
const saveSettings = () => {
  alert("Paramètres sauvegardés avec succès !");
  localStorage.setItem("votesecure_settings", JSON.stringify(settings));
};

const showUserGuide = () => {
  window.open("https://docs.votesecure.sn/guide", "_blank");
};

const contactSupport = () => {
  window.open(
    "mailto:support@votesecure.sn?subject=Support VoteSecure",
    "_blank",
  );
};

const exportData = () => {
  const data = {
    settings,
    timestamp: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "votesecure-settings.json";
  a.click();
  URL.revokeObjectURL(url);
};
```

#### Solution B - Dans les boutons, remplacer les `onClick` vides:

```javascript
// Bouton Guide d'utilisation:
<Button onClick={showUserGuide}>

// Bouton Support:
<Button onClick={contactSupport}>

// Bouton Sauvegarder:
<Button onClick={saveSettings}>

// Bouton Exporter:
<Button onClick={exportData}>
```

## 🚀 Étapes d'Application

1. **Appliquer les corrections**: Modifier les fichiers selon les instructions ci-dessus
2. **Réinitialiser la base**: `cd backend && rm votesecure.db && npm run init-db`
3. **Redémarrer**: `npm run dev`
4. **Tester**: Inscrire un nouvel utilisateur → L'approuver → Se connecter avec

## 🔐 Nouveaux Comptes de Test (Sénégal)

| Rôle       | Email                  | Mot de passe |
| ---------- | ---------------------- | ------------ |
| Admin      | admin@votesecure.sn    | admin123     |
| Candidate  | aissatou.diop@email.sn | candidate123 |
| Électeur   | mamadou.fall@email.sn  | voter123     |
| Spectateur | fatou.sarr@email.sn    | spectator123 |

## ✅ Résultat Attendu

- ✅ Nouveaux utilisateurs peuvent se connecter après validation
- ✅ Tous les exemples utilisent des noms sénégalais et .sn
- ✅ Tous les boutons fonctionnent avec des actions réelles
- ✅ Interface entièrement localisée pour le Sénégal
