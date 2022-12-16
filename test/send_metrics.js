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

'use strict';

const { metrics, trace } = require('@opentelemetry/api');
const express = require('express');
const PORT = process.env.PORT || 15000;

const meter = metrics.getMeter('my-test-app-metrics');
const counter = meter.createCounter('visits');
const tracer = trace.getTracer('visits');


function index(req, res) {
  const span = tracer.startSpan('index');

  counter.add(1);
  res.end('Thank you for visiting!');
  span.end();
}

express()
    .get('/', index)
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))