# Architecture — comment tout fonctionne

## Vue d'ensemble

Le projet a trois parties qui communiquent :

```
┌─────────────────┐     HTTPS      ┌──────────────┐     SQL      ┌───────────┐
│  React (frontend)│ ──────────────>│ Node (backend)│ ───────────>│  MariaDB  │
│  site + dashboard│  fetch /api    │   Express     │  mysql2      │ noor_panel│
└─────────────────┘                └──────────────┘              └───────────┘
```

## Pourquoi un backend ?

React s'exécute dans le navigateur du client. Il ne peut donc **pas**
contenir le mot de passe de la base de données (tout le monde pourrait le
lire). Le backend Node sert d'intermédiaire de confiance : lui seul
connaît les identifiants de la base, et il vérifie chaque demande.

C'est ce qui corrige le problème de l'ancienne version où le mot de passe
admin (`admin123`) était écrit dans le code React.

## Flux de connexion

1. L'utilisateur saisit email + mot de passe dans `LoginPage`.
2. `AuthContext.login()` appelle `POST /api/login`.
3. Le backend cherche l'utilisateur, compare le mot de passe avec le hash
   bcrypt stocké (`password_verify`).
4. Si OK, il crée une **session** : un jeton aléatoire est généré, son
   hash SHA-256 est stocké en base avec une date d'expiration (8 h).
5. Le jeton est renvoyé au frontend, qui le garde dans `localStorage`.
6. Chaque requête suivante envoie `Authorization: Bearer <jeton>`.

## Séparation des rôles

`GET /api/dashboard` renvoie des données différentes selon le rôle :

- **client** : uniquement SES sites, factures et documents
  (`WHERE user_id = <son id>`).
- **admin** : tout, avec le nom du client associé.

Cette vérification est faite **côté serveur**. Même si un client modifie
le code du navigateur, il ne peut pas voir les données des autres.

## Tables de la base

| Table       | Rôle                                             |
|-------------|--------------------------------------------------|
| `users`     | Comptes (admin + clients), mots de passe hachés  |
| `sites`     | Sites/projets de chaque client + statut + liens  |
| `documents` | Fichiers/documents rattachés à un client         |
| `invoices`  | Factures (montant en MRU, statut de paiement)    |
| `sessions`  | Jetons de connexion actifs                        |

## Points d'entrée de l'API

| Méthode | Chemin            | Accès      | Rôle                          |
|---------|-------------------|------------|-------------------------------|
| POST    | `/api/login`      | public     | Se connecter                  |
| POST    | `/api/logout`     | connecté   | Se déconnecter                |
| GET     | `/api/me`         | connecté   | Infos de l'utilisateur courant|
| GET     | `/api/dashboard`  | connecté   | Données (filtrées par rôle)   |
| GET     | `/api/health`     | public     | Vérifier que l'API tourne     |

## Prochaines évolutions possibles

- Endpoints admin pour créer/modifier clients, sites, factures.
- Upload de documents (relié à Filebrowser ou stockage dédié).
- Expiration/rafraîchissement automatique des jetons.
- Journal d'audit des connexions.
