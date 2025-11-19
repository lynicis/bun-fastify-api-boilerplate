export type ServerConfigModel = {
    port: string;
};

export type TelemetryConfigModel = {
    enabled: boolean;
    serviceName: string;
    environment: string;
    traceExporterEndpoint: string;
    exporterHeaders: Record<string, string>;
    ignorePaths: Array<string>;
};

export type MainConfigModel = {
    server: ServerConfigModel;
    telemetry: TelemetryConfigModel;
};
