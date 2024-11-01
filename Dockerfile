FROM node:20.11.1-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Build stage
FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm prisma generate
RUN pnpm build

# Production stage
FROM base
COPY --from=build /app/.output /app/.output
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/prisma /app/prisma
ENV NUXT_HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]