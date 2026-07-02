# NOOR — Site web (React + Vite)

Site vitrine de **NOOR-SARL**, société de services numériques basée à
Nouakchott (Mauritanie), conforme à la charte graphique de la marque
(violet `#993EAF`, gris `#BABABA`, police Readex Pro, slogan *"illuminate
your digital transformation"*).

## Démarrer le projet

Prérequis : [Node.js](https://nodejs.org) 18 ou plus récent.

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

Le site est alors accessible sur `http://localhost:5173`.

## Construire pour la production

```bash
npm run build
```

Les fichiers optimisés sont générés dans le dossier `dist/`. Vous pouvez
héberger ce dossier sur n'importe quel hébergeur statique (Vercel,
Netlify, GitHub Pages, un serveur classique, etc.).

Pour prévisualiser le build de production en local :

```bash
npm run preview
```

## Structure du projet

```
noor-react/
├── index.html              Page HTML racine (titre, meta description)
├── public/
│   └── logo.png             Logo NOOR (favicon + en-tête)
├── src/
│   ├── main.jsx              Point d'entrée React
│   ├── App.jsx                Composant racine
│   ├── index.css              Styles globaux minimaux
│   └── components/
│       └── NoorSite.jsx        Le site complet (hero, services, contact...)
├── package.json
└── vite.config.js
```

## Modifier le contenu

Tout le contenu (textes, services, coordonnées) se trouve dans
`src/components/NoorSite.jsx` :
- Le tableau `SERVICES` liste les 6 domaines d'activité (icônes SVG incluses)
- Le tableau `APPROACH` liste les 4 étapes de la section « Comment nous travaillons »
- Le téléphone, l'adresse et le slogan sont directement dans le JSX de la section `#contact` et du `<header>`

Le formulaire de contact est actuellement visuel uniquement (il affiche
une confirmation à l'écran). Pour le rendre fonctionnel, connectez-le à
un service d'envoi d'e-mails (ex. [Resend](https://resend.com),
[EmailJS](https://www.emailjs.com)) ou à votre propre API dans la
fonction `onSubmit` du formulaire.

## Charte graphique appliquée

| Élément     | Valeur                                |
|-------------|----------------------------------------|
| Violet primaire | `#993EAF`                          |
| Gris secondaire | `#BABABA`                          |
| Anthracite (piliers) | `#232226`                     |
| Police du nom / titres | Readex Pro (Bold)            |
| Police du corps | IBM Plex Sans                      |
| Slogan | « illuminate your digital transformation » |
