// Copyright Splunk Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { start } = require('@splunk/otel');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { getInstrumentations } = require('@splunk/otel/lib/instrumentations');

delete process.env.SPLUNK_REALM;

start({
    endpoint: 'http://localhost:4317',
    metrics: {
        exportIntervalMillis: 30000, // default: 5000
    },
    profiling: { memoryProfilingEnabled: true },
    tracing: {
        instrumentations: [
            ...getInstrumentations(),
            new HttpInstrumentation({
                headersToSpanAttributes: {
                    // Server side capturing, e.g. express
                    server: {
                        // Outgoing response headers
                        responseHeaders: ['content-type'],
                        // Incoming request headers
                        requestHeaders: ['accept-language']
                    },
                    // Client side capturing, e.g. node-fetch, got
                    client: {
                        // Incoming response headers
                        responseHeaders: ['server-timing'],
                        // Outgoing request headers
                        requestHeaders: ['accept-encoding']
                    }
                }
            }),
        ],
    },
});