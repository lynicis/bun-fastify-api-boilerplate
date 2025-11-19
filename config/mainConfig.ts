import dotenv from "dotenv";

import type { TelemetryConfigModel, ServerConfigModel } from "../config/model";
import type { MainConfigModel } from "./model";

const DEFAULT_SERVICE_NAME = "typescript-api-boilerplate";
const DEFAULT_TRACE_ENDPOINT = "http://localhost:4318/v1/traces";
const DEFAULT_IGNORE_PATHS = ["/health"];

const truthyValues = new Set(["1", "true", "yes"]);

const parseBoolean = (value?: string | null): boolean => {
    if (value == null) {
        return false;
    }

    return truthyValues.has(value.trim().toLowerCase());
};

const parseHeaders = (rawHeaders?: string | null): Record<string, string> => {
    if (rawHeaders == null || rawHeaders.trim().length === 0) {
        return {};
    }

    return rawHeaders.split(",").reduce<Record<string, string>>((acc, item) => {
        const [rawKey, ...rawValue] = item.split("=");
        const key = rawKey?.trim();
        const value = rawValue.join("=").trim();

        if (key == null || key.length === 0 || value.length === 0) {
            return acc;
        }

        acc[key] = value;
        return acc;
    }, {});
};

const parseIgnorePaths = (rawPaths?: string | null): Array<string> => {
    if (rawPaths == null || rawPaths.trim().length === 0) {
        return [];
    }

    return rawPaths.split(",").map((path) => path.trim()).filter((path) => path.length > 0);
};

const buildServerConfig = (): ServerConfigModel => {
    return {
        port: process.env.SERVER_PORT ?? "8080",
    };
};

const buildTelemetryConfig = (): TelemetryConfigModel => {
    const enabled = parseBoolean(process.env.TELEMETRY_ENABLED);
    const serviceName = process.env.OTEL_SERVICE_NAME ?? DEFAULT_SERVICE_NAME;
    const environment = process.env.NODE_ENV ?? "development";
    const traceExporterEndpoint =
        process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ??
        process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
        DEFAULT_TRACE_ENDPOINT;

    const ignorePaths = parseIgnorePaths(process.env.TELEMETRY_IGNORE_PATHS);

    return {
        enabled,
        serviceName,
        environment,
        traceExporterEndpoint,
        exporterHeaders: parseHeaders(process.env.TELEMETRY_EXPORTER_HEADERS),
        ignorePaths: ignorePaths.length === 0 ? DEFAULT_IGNORE_PATHS : ignorePaths,
    };
};

interface IConfigReader {
    ReadConfig(): object;
}

class MainConfig implements IConfigReader {
    ReadConfig(): MainConfigModel {
        if (process.env.IS_AT_REMOTE == null) {
            dotenv.config();
        }

        const serverConfig = buildServerConfig();
        const telemetryConfig = buildTelemetryConfig();

        return {
            server: serverConfig,
            telemetry: telemetryConfig,
        };
    }
}

export { type IConfigReader as IConfig, MainConfig };
