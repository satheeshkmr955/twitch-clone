import { usePrometheus } from "@graphql-yoga/plugin-prometheus";
import { Registry } from "prom-client";

const prometheusRegisterConnectionSingleton = (): Registry => {
  return new Registry();
};

declare global {
  var prometheusRegistry: Registry | undefined;
}

export const prometheusRegistry =
  globalThis.prometheusRegistry ?? prometheusRegisterConnectionSingleton();

if (process.env.NODE_ENV !== "production") {
  if (!globalThis.prometheusRegistry) {
    globalThis.prometheusRegistry = prometheusRegistry;
  }
}

export function usePrometheusWithRegistry() {
  // or just clear the registry if you use only on plugin instance at a time
  prometheusRegistry.clear();

  return usePrometheus({
    // endpoint: "/metrics/",
    registry: prometheusRegistry,
    metrics: {
      graphql_envelop_request_time_summary: true,
      graphql_envelop_phase_parse: true,
      graphql_envelop_phase_validate: true,
      graphql_envelop_phase_context: true,
      graphql_envelop_phase_execute: true,
      graphql_envelop_phase_subscribe: true,
      graphql_envelop_error_result: true,
      graphql_envelop_deprecated_field: true,
      graphql_envelop_request_duration: true,
      graphql_envelop_schema_change: true,
      graphql_envelop_request: true,
      // This metric is disabled by default.
      // Warning: enabling resolvers level metrics will introduce significant overhead
      graphql_envelop_execute_resolver: true,
    },
    // resolversWhitelist: ["Mutation.*", "Query.*"],
  });
}
