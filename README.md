# koa-couchbase-error

Intercept couchbase errors and convert them into non-500 responses. Currently only converts couchbase.errors.keyNotFound into 404 response.

## Requirements
* node __^7.6.0__

## Installation
```
npm install --save koa koa-error koa-couchbase-error
```

## Usage
```
import Koa from 'koa';
import error from 'koa-error';
import couchbaseError from 'koa-couchbase-error';

// make sure to use after koa-error
const app = new Koa();
app.use(error());
app.use(couchbaseError());
```

## License
MIT
