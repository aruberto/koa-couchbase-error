import couchbase from 'couchbase';

export default function createKoaCouchbaseErrorMiddleware () {
  return async function koaCouchbaseErrorMiddleware (ctx, next) {
    try {
      await next();
    } catch (err) {
      if (err.name === 'CouchbaseError' || err.name === 'CbError') {
        if (err.code === couchbase.errors.keyNotFound) {
          ctx.status = 404;
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }
  };
}
