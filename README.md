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
- Docker >= 24.0.0
- Docker Compose >= 2.0.0
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

3. **Configuration de l'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

4. **Démarrer les services Docker**
```bash
docker compose up -d
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
├── public/             # Assets statiques
└── docker/             # Configuration Docker
```

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env` basé sur `.env.example` :

```env
# Base de données
DATABASE_URL=postgresql://postgres:password@db:5432/crococroc
POSTGRES_PASSWORD=your_secure_password

# Auth
AUTH_SECRET=your_secret
AUTH_ORIGIN=http://localhost:3000

# App
NODE_ENV=development
```

### Docker

Le projet utilise Docker pour la base de données et le serveur nginx :

```bash
# Démarrer les services
docker compose up -d

# Voir les logs
docker compose logs -f

# Arrêter les services
docker compose down
```

## 📝 Scripts Disponibles

- `pnpm dev` - Serveur de développement
- `pnpm build` - Build production
- `pnpm preview` - Preview de la build
- `pnpm lint` - Vérification du code
- `pnpm test` - Tests unitaires
- `pnpm db:studio` - Interface Prisma
- `pnpm db:push` - Mise à jour DB