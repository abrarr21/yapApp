FROM node:22-alpine

WORKDIR /app

# enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# compile TypeScript
# RUN pnpm run build

# prune dev dependencies for a smaller runtime image
# RUN pnpm prune --prod

EXPOSE 6969

CMD ["pnpm", "dev"]
