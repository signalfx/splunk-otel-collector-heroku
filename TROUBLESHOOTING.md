# Troubleshooting

## Heroku Error Messages and Reasons

### remote rejected

Something is wrong with the heroku app. See the error messages preceeding this.

### error fetching custom buildpack

The repository and/or tag specified could not be found. Validate and fix the
repository and path. Be sure to remove the invalid buildpack (`heroku
buildpacks:remove ...`) and add the valid buildpack (`heroku buildpacks:add
...`).

### Couldn't find that feature

Ensure you are in a heroku app directory. If this is a new heroku application
create it first.

### Error: Missing required flag: -a, --app APP

Ensure you are in a heroku app directory. If this is a new heroku application
create it first.

## OpenTelemetry Collector

Review the [troubleshooting
documentation](https://github.com/signalfx/splunk-otel-collector/blob/main/docs/troubleshooting.md).
