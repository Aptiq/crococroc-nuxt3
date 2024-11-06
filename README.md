# Crococroc

Application d'analyse et de suivi de matières développée avec Nuxt 3.

## 🚀 Fonctionnalités

- 📸 Capture et analyse d'images
- 📊 Comparaison et notation automatique des couleurs
- 📱 Interface PWA responsive
- 🔄 Synchronisation en temps réel
- 🗄️ Stockage sécurisé des données
- 📈 Tableau de bord analytique
- 🔍 Recherche et filtrage des matières
- 📱 Mode hors ligne

## 🛠 Prérequis

- Node.js >= 20.11.1
- PNPM >= 9.0.0
- Une base de données PostgreSQL (Neon recommandé pour Vercel)

## 📦 Installation

1. **Cloner le projet**
```bash
git clone https://github.com/Aptiq/crococroc-nuxt3.git
cd crococroc-nuxt3
```

2. **Installer les dépendances**
```bash
pnpm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

4. **Initialiser la base de données**
```bash
pnpm prisma generate
pnpm prisma db push
```

## 🚀 Développement

```bash
# Serveur de développement
pnpm dev

# Linter
pnpm lint

# Interface Prisma
pnpm prisma studio
```

## 📁 Structure du Projet

```
crococroc-nuxt3/
├── components/          # Composants Vue réutilisables
│   ├── app/            # Composants de l'application
│   └── ui/             # Composants UI
├── pages/              # Routes de l'application
│   ├── analyze/        # Page d'analyse
│   ├── dashboard/      # Tableau de bord
│   └── materials/      # Gestion des matières
├── server/             # API et logique serveur
│   └── api/           # Endpoints API
├── prisma/             # Base de données
│   └── schema.prisma  # Schéma de données
└── public/             # Assets statiques
```

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env` basé sur `.env.example` :

```env
# URLs de base de données pour Prisma (Neon)
POSTGRES_PRISMA_URL=postgres://user:password@your-neon-db.server:5432/dbname?sslmode=require
POSTGRES_URL_NON_POOLING=postgres://user:password@your-neon-db.server:5432/dbname?sslmode=require

# Auth et sécurité
AUTH_SECRET=your_secret_here
AUTH_ORIGIN=http://localhost:3000
NUXT_SESSION_PASSWORD=your_session_password

# Configuration de déploiement (production uniquement)
# NITRO_PRESET=vercel
```

## 🌟 Fonctionnalités Détaillées

### Analyse d'Images
- Capture d'images via webcam ou appareil photo
- Comparaison automatique des couleurs
- Notation selon les standards définis
- Historique des analyses par matière

### Gestion des Matières
- Création et édition de matières
- Upload d'images
- Catégorisation et description
- Recherche et filtrage

### Dashboard
- Statistiques en temps réel
- Visualisation des dernières analyses
- Suivi des performances
- Export des données

### PWA
- Installation sur l'appareil
- Mode hors ligne
- Notifications push
- Mise à jour automatique

## 🚀 Déploiement

L'application est configurée pour être déployée sur Vercel avec une base de données Neon.

1. **Configuration Vercel**
   - Connectez votre repository GitHub à Vercel
   - Configurez les variables d'environnement dans Vercel
   - Activez le build automatique

2. **Configuration Neon**
   - Créez une base de données sur Neon
   - Copiez les URLs de connexion dans vos variables d'environnement
   - Assurez-vous que la base est accessible depuis Vercel

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'feat: add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📚 Documentation Additionnelle

- [Documentation Nuxt 3](https://nuxt.com/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Guide PWA](https://web.dev/progressive-web-apps/)
- [Documentation UI Nuxt](https://ui.nuxt.com/)

## 📄 License

[MIT](LICENSE)

## 🙏 Remerciements

- [Nuxt Team](https://nuxt.com/)
- [Vue.js Team](https://vuejs.org/)
- [Prisma Team](https://www.prisma.io/)
- [Contributeurs](https://github.com/Aptiq/crococroc-nuxt3/graphs/contributors)