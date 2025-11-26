# ---------- STAGE 1: build ----------
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# gera dist/
RUN pnpm build

# ---------- STAGE 2: runtime ----------
FROM node:20-alpine
WORKDIR /app
RUN corepack enable

ENV NODE_ENV=production
ENV PORT=4000

# copia node_modules e dist do stage de build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 4000

# ATENÇÃO: migrations do Prisma você roda fora ou
# adiciona um entrypoint chamando `prisma migrate deploy`
CMD ["node", "dist/index.js"]
