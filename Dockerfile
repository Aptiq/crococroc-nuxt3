FROM node:20.11.1-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Étape de build
FROM base AS build
COPY package.json pnpm-lock.yaml ./
# Suppression de --frozen-lockfile pour permettre la mise à jour des dépendances
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
COPY . .
RUN pnpm run build

# Étape de production
FROM base
COPY --from=build /app/.output /app/.output
ENV NUXT_HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]