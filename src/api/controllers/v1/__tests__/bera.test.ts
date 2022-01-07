import request from 'supertest';
import { Express } from 'express-serve-static-core';

import { createServer } from '@meteo-france-api/utils/server';

let server: Express;

beforeAll(async () => {
  server = (await createServer()).expressServer;
})

describe('GET /bera/{id}', () => {

  it('should return 200 & valid response if massif_id is present', async done => {
    request(server)
      .get(`/v1/bera/10`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body).toEqual(expect.objectContaining({
            massif_id: '10'
        }));
        done();
      })
  })

})