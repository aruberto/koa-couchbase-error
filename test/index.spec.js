/* eslint-disable no-unused-expressions */

import Koa from 'koa';
import error from 'koa-error';
import Router from 'koa-router';
import supertest from 'supertest';
import { expect } from 'chai';
import couchbase from 'couchbase';

import couchbaseError from '../src';

const app = new Koa();
app.use(error());
app.use(couchbaseError());

const router = new Router();

router.get('/test1', async ctx => {
  ctx.body = {
    name: 'Joe Blow',
    email: 'jblow@blah.com'
  };
});

router.get('/test2', async ctx => {
  const err = new couchbase.Error('random error');

  err.code = couchbase.errors.keyNotFound;

  throw err;
});

router.get('/test3', async ctx => {
  throw new Error('random error');
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8080);

const request = supertest.agent(app.listen());

describe('Koa Couchbase Error Middleware', () => {
  it('should return data when no error is thrown', async () => {
    return request.get('/test1')
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        expect(res.body).to.deep.equal({
          name: 'Joe Blow',
          email: 'jblow@blah.com'
        });
      });
  });

  it('should return 404 when key not found error is thrown', async () => {
    return request.get('/test2')
      .set('Accept', 'application/json')
      .expect(404);
  });

  it('should return internal server error when non couchbase error is thrown', async () => {
    return request.get('/test3')
      .set('Accept', 'application/json')
      .expect(500);
  });
});
