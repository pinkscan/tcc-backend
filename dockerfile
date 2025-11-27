# ---------- STAGE 1: build ----------
FROM node:20-bullseye AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY scripts ./scripts
RUN pnpm install --frozen-lockfile

# generate Prisma client now so types are available for the TypeScript build
RUN npx prisma generate

# copy remaining source files and build
COPY . .

# build TS
RUN pnpm build

# ---------- STAGE 2: runtime ----------
FROM node:20-bullseye
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package.json ./

CMD ["node", "dist/index.js"]
