---

<p align="center">
  <strong>
    <a href="#getting-started">Getting Started</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="CONTRIBUTING.md">Getting Involved</a>
  </strong>
</p>

<p align="center">
  <a href="https://github.com/signalfx/splunk-otel-collector-heroku/releases">
    <img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/signalfx/splunk-otel-collector-heroku?include_prereleases&style=for-the-badge">
  </a>
  <img alt="Beta" src="https://img.shields.io/badge/status-beta-informational?style=for-the-badge">
</p>

<p align="center">
  <strong>
    <a href="#example">Example</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="TROUBLESHOOTING.md">Troubleshooting</a>
  </strong>
</p>

---

# Splunk OpenTelemetry Connector for Heroku

The Splunk OpenTelemetry Connector for Heroku is a [buildpack](https://devcenter.heroku.com/articles/buildpacks) for the
[Splunk OpenTelemetry
Connector](https://github.com/signalfx/splunk-otel-collector). The buildpack to
installs and runs the Splunk OpenTelemetry Connector on a Dyno to receive,
process and export metric and trace data for [Splunk Observability
Cloud](https://www.observability.splunk.com/):

- [Splunk APM](https://www.splunk.com/en_us/software/splunk-apm.html) via the
  [`sapm`
  exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/sapmexporter).
  The [`otlphttp`
  exporter](https://github.com/open-telemetry/opentelemetry-collector/tree/main/exporter/otlphttpexporter)
  can be used with a [custom
  configuration](https://github.com/signalfx/splunk-otel-collector/blob/main/cmd/otelcol/config/collector/otlp_config_linux.yaml).
  More information available
  [here](https://docs.signalfx.com/en/latest/apm/apm-getting-started/apm-opentelemetry-collector.html).
- [Splunk Infrastructure
  Monitoring](https://www.splunk.com/en_us/software/infrastructure-monitoring.html)
  via the [`signalfx`
  exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/signalfxexporter).
  More information available
  [here](https://docs.signalfx.com/en/latest/otel/imm-otel-collector.html).

> :construction: This project is currently in **BETA**

## Getting Started

[Install the Heroku CLI, login, and create an
app](https://devcenter.heroku.com/articles/heroku-cli). Add and configure the
buildpack:

```
# cd into the Heroku project directory
# WARNING: running `heroku` command outside of project directories
#          will result in unexpected behavior
cd <HEROKU_APP_DIRECTORY>

# Configure Heroku App to expose Dyno metadata; required to set global dimensions.
# See https://devcenter.heroku.com/articles/dyno-metadata for more information.
heroku labs:enable runtime-dyno-metadata

# Add buildpack for Splunk OpenTelemetry Connector
# Note both lines are required together
heroku buildpacks:add https://github.com/signalfx/splunk-otel-collector-heroku.git#\
$(curl -s https://api.github.com/repos/signalfx/splunk-otel-collector-heroku/releases | grep '"tag_name"' | head -n 1 | cut -d'"' -f4)
# For production environment using an explict version number is advised
#heroku buildpacks:add https://github.com/signalfx/splunk-otel-collector-heroku.git#<TAG_NAME>

# Set required environment variables
heroku config:set SPLUNK_ACCESS_TOKEN=<YOUR_ACCESS_TOKEN>
heroku config:set SPLUNK_REALM=<YOUR_REALM>

# Optionally define custom configuration file in your Heroku project directory
#heroku config:set SPLUNK_CONFIG=/app/mydir/myconfig.yaml

# If these buildpacks are being added to an existing project,
# create an empty commit prior to deploying the app
git commit --allow-empty -m "empty commit"

# Deploy your app (assumes `main` branch exists)
git push heroku main
```

## Advanced Configuration

Use the following environment variables to configure this buildpack

| Environment Variable      | Required | Default                                             | Description                                                                                                                |
| ----------------------    | -------- | -------                                             | -------------------------------------------------------------------------                                                  |
| `SPLUNK_ACCESS_TOKEN`     | Yes      |                                                     | [Splunk access token](https://docs.splunk.com/Observability/admin/authentication-tokens/org-tokens.html#admin-org-tokens). |
| `SPLUNK_REALM`            | Yes      |                                                     | [Splunk realm](https://dev.splunk.com/observability/docs/realms_in_endpoints/).                                            |
| `SPLUNK_API_URL`          | No       | `https://api.SPLUNK_REALM.signalfx.com`             | The Splunk API base URL.                                                                                                   |
| `SPLUNK_CONFIG`           | No       | `/app/config.yaml`                                  | The configuration to use. `/app/.splunk/config.yaml` used if default not found.                                            |
| `SPLUNK_INGEST_URL`       | No       | `https://ingest.SPLUNK_REALM.signalfx.com`          | The Splunk Infrastructure Monitoring base URL.                                                                             |
| `SPLUNK_LOG_FILE`         | No       | `/dev/stdout`                                       | Specify location of agent logs. If not specified, logs will go to stdout.                                                  |
| `SPLUNK_MEMORY_TOTAL_MIB` | No       | `512`                                               | Total available memory to agent.                                                                                           |
| `SPLUNK_OTEL_VERSION`     | No       | `latest`                                            | Version of Splunk OTel Connector to use. Defaults to latest.                                                               |
| `SPLUNK_TRACE_URL`        | No       | `https://ingest.SPLUNK_REALM.signalfx.com/v2/trace` | The Splunk APM base URL.                                                                                                   |

## Example

To try the buildpack with the included demo application:

```
# cd into the Heroku project directory
# WARNING: running `heroku` command outside of project directories
#          will result in unexpected behavior
cd test
git init
heroku apps:create splunk-example

# Configure Heroku App to expose Dyno metadata; required to set global dimensions.
# See https://devcenter.heroku.com/articles/dyno-metadata for more information.
heroku labs:enable runtime-dyno-metadata

# Add buildpack for Splunk OpenTelemetry Connector
# Note both lines are required together
heroku buildpacks:add https://github.com/signalfx/splunk-otel-collector-heroku.git#\
$(curl -s https://api.github.com/repos/signalfx/splunk-otel-collector-heroku/releases | grep '"tag_name"' | head -n 1 | cut -d'"' -f4)

# Required for test application
heroku buildpacks:add heroku/nodejs

# Set required environment variables
heroku config:set SPLUNK_ACCESS_TOKEN=<YOUR_ACCESS_TOKEN>
heroku config:set SPLUNK_REALM=<YOUR_REALM>

# Add, commit and deploy your app (assumes `main` branch exists)
git add -A && git commit -av -m "add test application"
git push heroku main

# Check logs
heroku logs -a splunk-example --tail
```

## License

[Apache Software License version 2.0](./LICENSE).
