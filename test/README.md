# Example Heroku App

Simple NodeJS application based on [Splunk Distribution of OpenTelemetry for Node.js](https://github.com/signalfx/splunk-otel-js).

Emits metrics to local Splunk OpenTelemetry Collector. See Procfile for run command.


To run locally:
```
npm install
OTEL_SERVICE_NAME=my-test-app OTEL_LOG_LEVEL=info node -r ./instrument.js send_metrics.js
```
