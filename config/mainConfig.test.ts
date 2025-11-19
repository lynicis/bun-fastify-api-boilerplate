import { beforeEach, afterEach, describe, expect, jest, test } from "bun:test";

import type { MainConfigModel } from "./model";

import { MainConfig } from "./mainConfig";

describe("when call ReadConfig should return MainConfigModel", () => {
    const env = process.env;

    beforeEach(() => {
        jest.resetAllMocks();
        process.env = { ...env };
    });

    afterEach(() => {
        process.env = env;
    });

    test("from environment variable", () => {
        process.env.SERVER_PORT = "3000";
        process.env.TELEMETRY_ENABLED = "true";
        process.env.OTEL_SERVICE_NAME = "api-service";
        process.env.NODE_ENV = "production";
        process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = "http://otel-collector:4318/v1/traces";
        process.env.TELEMETRY_IGNORE_PATHS = "/health,/metrics";
        process.env.TELEMETRY_EXPORTER_HEADERS = "authorization=bearer token,x-tenant-id=tenant1";

        const config: MainConfigModel = new MainConfig().ReadConfig();

        const expectedConfig: MainConfigModel = {
            server: {
                port: "3000",
            },
            telemetry: {
                enabled: true,
                serviceName: "api-service",
                environment: "production",
                traceExporterEndpoint: "http://otel-collector:4318/v1/traces",
                exporterHeaders: {
                    authorization: "bearer token",
                    "x-tenant-id": "tenant1",
                },
                ignorePaths: ["/health", "/metrics"],
            },
        };

        expect(expectedConfig).toEqual(config);
    });

    test("from defaults when env missing", () => {
        process.env.IS_AT_REMOTE = "YES";
        delete process.env.SERVER_PORT;
        delete process.env.TELEMETRY_ENABLED;
        delete process.env.OTEL_SERVICE_NAME;
        delete process.env.NODE_ENV;
        delete process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;
        delete process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
        delete process.env.TELEMETRY_IGNORE_PATHS;
        delete process.env.TELEMETRY_EXPORTER_HEADERS;

        const config: MainConfigModel = new MainConfig().ReadConfig();

        const expectedConfig: MainConfigModel = {
            server: {
                port: "8080",
            },
            telemetry: {
                enabled: false,
                serviceName: "typescript-api-boilerplate",
                environment: "development",
                traceExporterEndpoint: "http://localhost:4318/v1/traces",
                exporterHeaders: {},
                ignorePaths: ["/health"],
            },
        };

        expect(expectedConfig).toEqual(config);
    });
});
