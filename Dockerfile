FROM oven/bun:alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM deps AS build
COPY . .
RUN bun run build

FROM busybox:stable AS release

COPY --from=build /usr/src/app/api ./api

EXPOSE 3000/tcp
CMD [ "./api" ]
