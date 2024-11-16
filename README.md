# CrocoCroc - Guide de contribution

## À propos
CrocoCroc est une application web permettant d'analyser la résistance des matériaux aux tests de rayures selon la norme ISO. L'application permet de capturer des photos standardisées, analyser leur qualité et calculer les niveaux de gris pour attribuer des notes selon la norme ISO.

## Prérequis

- Node.js >= 18
- PNPM >= 9
- PostgreSQL >= 14

## Installation

1. Cloner le dépôt
```bash
git clone https://github.com/Aptiq/crococroc-nuxt3.git
cd crococroc
```

2. Installer les dépendances
```bash
pnpm install
```

3. Configuration de la base de données
- Créer une base de données PostgreSQL
- Copier `.env.exemple` vers `.env`
- Configurer les variables de connexion :
```env
POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/crococroc"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/crococroc"
```

4. Initialiser la base de données
```bash
pnpm prisma generate
pnpm prisma db push
```

5. Lancer l'application en développement
```bash
pnpm dev
```

## Scripts disponibles

```bash
pnpm dev        # Lance le serveur de développement
pnpm build      # Build l'application
pnpm clean      # Nettoie les dossiers de build
pnpm reset      # Réinstalle les dépendances
```

## Déploiement

Le projet est configuré pour être déployé sur Vercel :

1. Créer un compte sur [Vercel](https://vercel.com)
2. Connecter votre repository GitHub
3. Configurer les variables d'environnement dans Vercel
4. Déployer !

## Structure du projet

```
├── components/          # Composants Vue réutilisables
├── pages/              # Pages de l'application
├── server/             # API et utilitaires serveur
├── prisma/             # Schéma et migrations DB
└── types/              # Types TypeScript
```

## Contribution

1. Créer une branche pour votre fonctionnalité
2. Commiter vos changements
3. Créer une Pull Request

## Licence

MIT