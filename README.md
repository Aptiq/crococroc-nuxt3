# CrocoCroc

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
- PostgreSQL >= 15.0

## 📦 Installation

1. **Cloner le projet**
```bash
git clone https://github.com/Aptiq/crococroc-nuxt3.git
cd crococroc-nuxt3
```

2. **Installer les dépendances**
```bash
pnpm install
pnpm add -D vue-tsc typescript @types/node
pnpm add pinia-plugin-persistedstate
```

3. **Configurer PostgreSQL**
- Installer PostgreSQL si ce n'est pas déjà fait
- Créer une base de données nommée "crococroc"
- Noter vos identifiants PostgreSQL

4. **Configuration de l'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

5. **Initialiser la base de données**
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

# Tests
pnpm test

# Interface Prisma
pnpm db:studio
```

## 📁 Structure du Projet

```
crococroc-nuxt3/
├── components/          # Composants Vue réutilisables
│   ├── CameraCapture/  # Capture d'images
│   └── TestResults/    # Affichage des résultats
├── pages/              # Routes de l'application
│   ├── analyze/        # Page d'analyse
│   ├── dashboard/      # Tableau de bord
│   └── materials/      # Gestion des matières
├── stores/             # Stores Pinia
│   └── materials.ts    # Store des matières
├── server/             # API et logique serveur
│   └── api/           # Endpoints API
├── prisma/             # Base de données
│   └── schema.prisma  # Schéma de données
└── public/             # Assets statiques
```

## 🔧 Configuration

### Persistance des données

L'application utilise `pinia-plugin-persistedstate` pour persister les données du store dans le localStorage. Cela permet de :
- Conserver les données entre les rafraîchissements
- Améliorer les performances
- Supporter le mode hors ligne

### Variables d'Environnement

Créez un fichier `.env` basé sur `.env.example` :

```env
# Base de données
DATABASE_URL=postgresql://postgres:password@localhost:5432/crococroc
POSTGRES_DB=crococroc
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# Auth et sécurité
AUTH_SECRET=your_secret_here
AUTH_ORIGIN=http://localhost:3000
NUXT_SESSION_PASSWORD=your_session_password

# Configuration Node
NODE_ENV=development
PORT=3000
```

## 📝 Scripts Disponibles

- `pnpm dev` - Serveur de développement
- `pnpm build` - Build production
- `pnpm preview` - Preview de la build
- `pnpm lint` - Vérification du code
- `pnpm test` - Tests unitaires
- `pnpm db:studio` - Interface Prisma
- `pnpm db:push` - Mise à jour DB

## 🌟 Fonctionnalités Détaillées

### Analyse d'Images
- Capture d'images via webcam ou appareil photo
- Comparaison automatique des couleurs
- Notation selon les standards ISO
- Historique des analyses par matière

### Persistance et Performance
- Stockage local des données avec Pinia
- Mise en cache automatique
- Synchronisation intelligente
- Optimisation des requêtes

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
- [Documentation Pinia](https://pinia.vuejs.org/)
- [Documentation UI Nuxt](https://ui.nuxt.com/)

## 📄 License

[MIT](LICENSE)

## 🙏 Remerciements

- [Nuxt Team](https://nuxt.com/)
- [Vue.js Team](https://vuejs.org/)
- [Prisma Team](https://www.prisma.io/)
- [Contributeurs](https://github.com/Aptiq/crococroc-nuxt3/graphs/contributors)