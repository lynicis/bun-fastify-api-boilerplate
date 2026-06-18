# typescript-api-boilerplate

[![CI/CD](https://github.com/iemre-sirmali/typescript-api-boilerplate/actions/workflows/master.yml/badge.svg)](https://github.com/iemre-sirmali/typescript-api-boilerplate/actions/workflows/master.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A TypeScript API starter built with [Bun](https://bun.sh) and [Fastify](https://fastify.dev). It ships with OpenTelemetry tracing, structured logging, graceful shutdown, and a Docker build that produces a ~5 MB image.

## Features

- **Bun runtime**: fast startup, built-in test runner, bundler, and package manager
- **Fastify 5**: low overhead, schema-based validation, plugin system
- **OpenTelemetry**: distributed tracing via OTLP HTTP exporter with Fastify instrumentation
- **Graceful shutdown**: SIGINT/SIGTERM handling, in-flight requests finish before the process exits
- **Winston logging**: JSON structured logs with timestamps
- **Error handling**: typed `CustomError` with HTTP status codes, middleware catches and formats them
- **Configuration**: environment-based with dotenv and sensible defaults
- **TypeScript 6**: strict mode, ESNext target, bundler module resolution
- **Docker**: multi-stage build, final image is busybox + a single compiled binary
- **CI/CD**: GitHub Actions for lint, build, and test
- **Code quality**: ESLint flat config with Perfectionist import sorting, Prettier formatting

## Getting started

### Prerequisites

- [Bun](https://bun.sh) >= 1.3
- Node.js >= 24 (for type definitions)

### Install

```bash
git clone <repo-url>
cd bun-fastify-api-boilerplate
bun install
```

Copy the environment file and adjust as needed:

```bash
cp .env.example .env
```

### Run in development

```bash
bun run start
```

The server starts on port 8080 by default. Check the health endpoint:

```bash
curl http://localhost:8080/health
# OK
```

### Build a binary

```bash
bun run build
```

This produces a standalone binary named `api`. No runtime dependencies needed.

## Configuration

All configuration is through environment variables. The app loads a `.env` file automatically when `IS_AT_REMOTE` is not set.

| Variable                             | Default                           | Description                                          |
| ------------------------------------ | --------------------------------- | ---------------------------------------------------- |
| `IS_AT_REMOTE`                       | --                                | When set, skips loading `.env` (for production)      |
| `SERVER_PORT`                        | `8080`                            | HTTP server port                                     |
| `TELEMETRY_ENABLED`                  | `false`                           | Enables OpenTelemetry (accepts `1`, `true`, `yes`)   |
| `OTEL_SERVICE_NAME`                  | `typescript-api-boilerplate`      | Service name for traces                              |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | `http://localhost:4318/v1/traces` | OTLP HTTP endpoint                                   |
| `TELEMETRY_IGNORE_PATHS`             | `/health`                         | Comma-separated paths to skip in tracing             |
| `TELEMETRY_EXPORTER_HEADERS`         | --                                | Comma-separated `key=value` headers for the exporter |

## Project structure

```
├── main.ts                 # Entry point: wires config, telemetry, and server together
├── config/
│   ├── model.ts            # TypeScript types for configuration
│   ├── mainConfig.ts       # Reads env vars and builds a config object
│   └── mainConfig.test.ts
├── server/
│   ├── server.ts           # Fastify server with graceful shutdown, request context, error handler
│   └── server.test.ts
├── error/
│   ├── error.ts            # CustomError class with numeric HTTP code
│   ├── error.test.ts
│   ├── middleware.ts        # Fastify error handler middleware
│   └── middleware.test.ts
├── telemetry/
│   └── telemetry.ts        # OpenTelemetry NodeSDK setup with OTLP exporter
├── .github/workflows/
│   └── master.yml          # CI/CD pipeline
├── Dockerfile              # Multi-stage build, final image ~5 MB
├── eslint.config.mjs       # ESLint flat config
├── tsconfig.json           # TypeScript config (strict, ESNext)
└── package.json
```

## Scripts

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `bun run start`     | Run the app with Bun           |
| `bun run build`     | Compile to a standalone binary |
| `bun run lint`      | Run ESLint                     |
| `bun run lint:fix`  | Run ESLint with auto-fix       |
| `bun test`          | Run tests                      |
| `bun test:ci`       | Run tests in CI mode           |
| `bun test:coverage` | Run tests with coverage        |

## Docker

```bash
docker build -t api-boilerplate .
docker run -p 3000:3000 api-boilerplate
```

The build uses four stages: `base` (Bun alpine), `deps` (install dependencies), `build` (compile binary), and `release` (busybox). The final image contains only the compiled binary and busybox utilities, around 5 MB.

The container exposes port 3000. Set environment variables with `-e` or an env file:

```bash
docker run -p 3000:3000 -e SERVER_PORT=3000 api-boilerplate
```

## Testing

The project uses Bun's built-in test runner with supertest for HTTP integration tests.

```bash
bun test          # Run all tests
bun test:coverage # Run with coverage
```

## How it fits together

`main.ts` reads the config, starts OpenTelemetry (if enabled), and boots the Fastify server. The server registers a `/health` endpoint, a request context plugin that stores the logger, and an error handler that catches `CustomError` instances and returns the right status code. On SIGINT or SIGTERM, it shuts down telemetry first, then closes the server. In-flight requests finish before the process exits because Fastify is configured with `return503OnClosing` and `forceCloseConnections`.

## License

MIT. See [LICENSE](LICENSE).
