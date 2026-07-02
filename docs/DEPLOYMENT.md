# Déploiement — panel.noor.lu

Procédure pour mettre le site + panneau en ligne sur le serveur NOOR 2
(`167.86.77.49`), avec HTTPS via Cloudflare.

## Prérequis (déjà en place sur le serveur)

- Docker + Docker Compose
- Nginx (reverse proxy)
- MariaDB + phpMyAdmin (conteneurs `mariadb` / `phpmyadmin`)
- Réseau Docker `database_noor_db`

---

## 1. Base de données

Dans phpMyAdmin (`https://db.noor.lu`) :

1. Exécuter `database/01_schema.sql` → crée la base `noor_panel` et ses tables.
2. Exécuter `database/02_db_user.sql` (après avoir remplacé le mot de passe)
   → crée l'utilisateur `noor_panel_user`.
3. Créer le compte admin (voir section « Compte admin » plus bas).

---

## 2. Backend (API Node.js)

```bash
mkdir -p /srv/noor/panel/backend
# copier server.js, package.json, docker-compose.yml dans ce dossier
cd /srv/noor/panel/backend

# Configurer le mot de passe BDD dans docker-compose.yml
nano docker-compose.yml   # remplacer REMPLACER_PAR_MOT_DE_PASSE_FORT

docker compose up -d
docker logs panel-api      # attendre "API démarrée sur le port 8082"
curl http://127.0.0.1:8082/api/health   # doit répondre {"ok":true}
```

---

## 3. Frontend (build React)

Le build se fait en local puis on envoie le dossier `dist/` :

```bash
cd frontend
cp .env.example .env       # VITE_API_BASE=/api
npm install
npm run build              # génère dist/
```

Envoyer `dist/` vers le serveur :

```bash
scp -i ~/.ssh/id_ed25519 -r dist/* noor_admin@167.86.77.49:/srv/noor/panel/web/
```

(créer d'abord `/srv/noor/panel/web` sur le serveur)

---

## 4. Nginx

Fichier `/etc/nginx/sites-available/panel.noor.lu` :

```nginx
server {
    listen 80;
    server_name panel.noor.lu;

    root /srv/noor/panel/web;
    index index.html;

    # Fichiers statiques React (site + dashboard)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API backend
    location /api/ {
        proxy_pass http://127.0.0.1:8082/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activer + SSL :

```bash
sudo ln -s /etc/nginx/sites-available/panel.noor.lu /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# DNS Cloudflare : ajouter panel -> 167.86.77.49 (DNS only le temps du certif)
sudo certbot --nginx -d panel.noor.lu --agree-tos -m noorinfo2026@gmail.com --redirect
# puis repasser panel en Proxied dans Cloudflare
```

---

## Compte admin

Générer le hash du mot de passe (le mot de passe n'apparaît pas en clair) :

```bash
docker run --rm -it node:20-alpine sh -c "npm i -g bcryptjs >/dev/null 2>&1; node -e 'const b=require(\"bcryptjs\");const p=process.argv[1];console.log(b.hashSync(p,10))' 'VOTRE_MOT_DE_PASSE_FORT'"
```

Puis dans phpMyAdmin :

```sql
USE noor_panel;
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('admin@noor.mr', 'COLLER_LE_HASH', 'Administrateur NOOR', 'admin');
```

---

## Mise à jour ultérieure

```bash
# Backend
cd /srv/noor/panel/backend && docker compose restart panel-api

# Frontend : rebuild local puis re-scp dist/ vers /srv/noor/panel/web/
```
