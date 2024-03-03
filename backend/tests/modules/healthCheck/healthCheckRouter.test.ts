import request from 'supertest';

import { ApiResponse } from '@common/models/ApiResponse';
import { app } from '@src/server';

describe('Health Check API endpoints', () => {
  it('GET / - success', async () => {
    const response = await request(app).get('/health-check');
    const result: ApiResponse = response.body;

    expect(response.statusCode).toEqual(200);
    expect(result.success).toBeTruthy();
    expect(result.data).toMatchObject({});
    expect(result.message).toEqual('Service is healthy');
  });
});
