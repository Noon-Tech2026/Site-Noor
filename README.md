# NOOR-SARL — Site & Panneau Client

Plateforme web de **NOOR-SARL** (Nouakchott, Mauritanie) :
- **Site vitrine** public présentant les services de l'entreprise.
- **Panneau client** (dashboard) permettant aux clients de suivre leurs
  sites, factures et documents ; et aux administrateurs de tout gérer.

Conforme à la charte graphique NOOR (violet `#983EAF`, gris `#BABABA`,
police Readex Pro).

---

## Architecture

```
Navigateur (React)
      |  HTTPS
      v
  panel.noor.lu  (Nginx + SSL Cloudflare)
      |
      +--  /        -> fichiers statiques React (site + dashboard)
      +--  /api/... -> backend Node.js (port interne 8082)
                            |
                            v
                     MariaDB (base noor_panel)
```

- **Frontend** : React + Vite (dossier `frontend/`)
- **Backend** : Node.js + Express (dossier `backend/`)
- **Base de données** : MariaDB / MySQL (scripts dans `database/`)

L'authentification est **réelle et sécurisée** : mots de passe hachés
avec bcrypt, sessions par jetons aléatoires, séparation stricte des
rôles (un client ne voit que ses propres données).

---

## Structure du dépôt

```
Site-Noor/
├── frontend/           Application React (site + dashboard)
│   ├── src/
│   │   ├── api/client.js       Client API (fetch vers le backend)
│   │   ├── auth/AuthContext.jsx Authentification réelle
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── backend/            API Node.js + Express
│   ├── server.js               Serveur & routes sécurisées
│   ├── docker-compose.yml
│   ├── .env.example
│   └── package.json
│
├── database/           Scripts SQL
│   ├── 01_schema.sql           Tables (users, sites, invoices...)
│   └── 02_db_user.sql          Utilisateur MariaDB dédié
│
├── docs/
│   ├── DEPLOYMENT.md           Comment déployer sur le serveur
│   └── ARCHITECTURE.md         Comment tout fonctionne
│
└── .gitignore          Bloque .env et secrets
```

---

## Démarrage rapide (développement local)

Prérequis : Node.js 20+, et une base MariaDB accessible.

```bash
# 1. Base de données
#    Exécuter database/01_schema.sql puis database/02_db_user.sql
#    dans phpMyAdmin ou en ligne de commande.

# 2. Backend
cd backend
cp .env.example .env        # puis remplir les vraies valeurs
npm install
npm start                    # API sur http://localhost:8082

# 3. Frontend
cd ../frontend
cp .env.example .env         # VITE_API_BASE=http://localhost:8082/api
npm install
npm run dev                  # site sur http://localhost:5173
```

---

## Sécurité — points importants

- **Aucun secret dans le dépôt.** Les mots de passe et clés vivent dans
  des fichiers `.env` locaux, ignorés par Git (voir `.gitignore`).
  Chaque développeur copie `.env.example` vers `.env` et remplit ses
  propres valeurs.
- Les mots de passe utilisateurs sont **hachés (bcrypt)**, jamais stockés
  en clair.
- Le backend utilise des **requêtes préparées** (protection contre les
  injections SQL).
- Un client ne peut accéder qu'à ses propres données (vérifié côté
  serveur, pas côté navigateur).

---

## Déploiement

Voir [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) pour la procédure complète
de mise en ligne sur le serveur (`panel.noor.lu`).
