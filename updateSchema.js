#!/usr/bin/env babel-node --optional es7.asyncFunctions

import fs from 'fs';
import path from 'path';
import { AppSchema, BackendSchema } from '../server/schema';
import { graphql }  from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

// Save JSON of full schema introspection for Babel Relay Plugin to use
(async () => {
  var result = await (graphql(AppSchema, introspectionQuery));
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFileSync(
      path.join(__dirname, 'appschema.json'),
      JSON.stringify(result, null, 2)
    );
  }
})();

// Save user readable type system shorthand of schema
fs.writeFileSync(
  path.join(__dirname, 'appschema.graphql'),
  printSchema(AppSchema)
);

// Save JSON of full schema introspection for Babel Relay Plugin to use
(async () => {
  var result = await (graphql(BackendSchema, introspectionQuery));
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFileSync(
      path.join(__dirname, 'backendschema.json'),
      JSON.stringify(result, null, 2)
    );
  }
})();

// Save user readable type system shorthand of schema
fs.writeFileSync(
  path.join(__dirname, 'backendschema.graphql'),
  printSchema(BackendSchema)
);
