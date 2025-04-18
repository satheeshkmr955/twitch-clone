import {
  BatchSpanProcessor,
  // ConsoleSpanExporter,
  // SimpleSpanProcessor,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";

import { registerInstrumentations } from "@opentelemetry/instrumentation";
// import { Resource } from "@opentelemetry/resources";
// import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { getWebAutoInstrumentations } from '../node_modules/@opentelemetry/auto-instrumentations-web/build/esm/utils';

console.log(
  "metrics and trace urls",
  process.env.NEXT_PUBLIC_OTEL_METRICS_ENDPOINT,
  process.env.NEXT_PUBLIC_OTEL_TRACE_ENDPOINT
);

const traceExporter = new OTLPTraceExporter({
  url: process.env.NEXT_PUBLIC_OTEL_TRACE_ENDPOINT!,
  // headers: {},
});

const metricExporter = new OTLPMetricExporter({
  url: process.env.NEXT_PUBLIC_OTEL_METRICS_ENDPOINT!,
  // headers: {},
});

const tracerProvider = new WebTracerProvider({
  // resource: new Resource({
  //   [ATTR_SERVICE_NAME]: "nextjs-app",
  // }),
  spanProcessors: [
    new BatchSpanProcessor(traceExporter, {
      maxQueueSize: 100,
      maxExportBatchSize: 10,
      scheduledDelayMillis: 500,
      exportTimeoutMillis: 30000,
    }),
    // new SimpleSpanProcessor(new ConsoleSpanExporter()),
  ],
});

const meterProvider = new MeterProvider({
  // resource: new Resource({
  //   [ATTR_SERVICE_NAME]: "nextjs-app",
  // }),
  readers: [
    new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 1000 * 60 * 1,
    }),
  ],
});

registerInstrumentations({
  tracerProvider: tracerProvider,
  meterProvider: meterProvider,
  instrumentations: [
    getWebAutoInstrumentations({}),
  ],
});

tracerProvider.register();

console.log("OpenTelemetry initialized frontend");
