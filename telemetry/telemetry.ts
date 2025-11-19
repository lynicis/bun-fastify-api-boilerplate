import type winston from "winston";

import { ATTR_DEPLOYMENT_ENVIRONMENT_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { resourceFromAttributes } from "@opentelemetry/resources";
import FastifyOtelInstrumentation from "@fastify/otel";
import { NodeSDK } from "@opentelemetry/sdk-node";

import type { TelemetryConfigModel } from "../config/model";

const buildIgnorePattern = (patterns: Array<string>): string | undefined => {
    if (patterns.length === 0) {
        return undefined;
    }

    if (patterns.length === 1) {
        return patterns[0];
    }

    return `{${patterns.join(",")}}`;
};

class Telemetry {
    private sdk?: NodeSDK;

    constructor(
        private readonly config: TelemetryConfigModel,
        private readonly logger?: winston.Logger,
    ) { }

    async Start(): Promise<void> {
        if (!this.config.enabled) {
            this.logger?.info("telemetry disabled");
            return;
        }

        if (this.sdk != null) {
            return;
        }

        const instrumentations = [
            new HttpInstrumentation(),
            new FastifyOtelInstrumentation({
                registerOnInitialization: true,
                ignorePaths: buildIgnorePattern(this.config.ignorePaths),
            }),
        ];

        this.sdk = new NodeSDK({
            resource: resourceFromAttributes({
                [ATTR_SERVICE_NAME]: this.config.serviceName,
                [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: this.config.environment,
            }),
            instrumentations,
            traceExporter: new OTLPTraceExporter({
                url: this.config.traceExporterEndpoint,
                headers: this.config.exporterHeaders,
            }),
        });

        this.sdk.start();
        this.logger?.info("telemetry initialized", {
            serviceName: this.config.serviceName,
            endpoint: this.config.traceExporterEndpoint,
        });
    }

    async Stop(): Promise<void> {
        if (this.sdk == null) {
            return;
        }

        await this.sdk.shutdown();
        this.sdk = undefined;
        this.logger?.info("telemetry stopped");
    }
}

export { Telemetry };

