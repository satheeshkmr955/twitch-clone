import { NodeSDK } from "@opentelemetry/sdk-node";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

// Function to set up OpenTelemetry
export async function initOpenTelemetry() {
  const traceExporter = new OTLPTraceExporter({
    url: process.env.OTEL_TRACE_ENDPOINT!,
    // headers: {},
  });

  const metricExporter = new OTLPMetricExporter({
    url: process.env.OTEL_METRICS_ENDPOINT!,
    // headers: {},
  });

  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
  });

  // const meterProvider = new MeterProvider({
  //   readers: [metricReader],
  // });

  // const meter = meterProvider.getMeter("nextjs-app");

  const sdk = new NodeSDK({
    traceExporter: traceExporter,
    metricReader: metricReader,
    resource: new Resource({
      [ATTR_SERVICE_NAME]: "nextjs-app",
    }),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new FetchInstrumentation(), // Instrument fetch calls
    ],
  });

  sdk.start();

  console.log("OpenTelemetry initialized");

  process.on("SIGTERM", () => {
    sdk
      .shutdown()
      .then(() => console.log("OpenTelemetry shut down gracefully"))
      .catch((error) =>
        console.error("Error shutting down OpenTelemetry", error)
      )
      .finally(() => process.exit(0));
  });
}
