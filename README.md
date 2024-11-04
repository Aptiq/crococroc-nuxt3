# CrocoCroc

Application d'analyse et de suivi de matières développée avec Nuxt 3.

## 🚀 Fonctionnalités

- 📸 Capture et analyse d'images
- 📊 Comparaison et notation ISO
- 📱 Interface PWA responsive
- 🔄 Synchronisation en temps réel
- 🗄️ Stockage sécurisé des données

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

## 📄 License

[MIT](LICENSE)