FROM node:24-alpine

WORKDIR /app

COPY . .

RUN corepack enable pnpm && pnpm install

CMD ["pnpm", "dev"]

EXPOSE 3000
