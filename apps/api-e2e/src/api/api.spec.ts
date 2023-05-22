import axios from 'axios';
import { spawn } from 'child_process';

describe('GET /api', () => {
  let apiServer;
  beforeAll(async () => {
    axios.defaults.baseURL = 'http://localhost:3000';
    apiServer = spawn('yarn', ['start:dev'], {
      cwd: './',
      shell: true,
    });
    let notUp = true;
    while (notUp) {
      try {
        await axios.get('api/');
      } catch (error) {
        console.log(error);
        if (error?.response?.status === 401) {
          notUp = false;
        }
      }
    }
  }, 10000);

  let res;
  it('should return a message', async () => {
    try {
      res = await axios.get('api/');
      console.log(res);
    } catch (error) {
      expect(error.response.status).toEqual(401);
      return;
    }
  });

  afterAll(() => {
    apiServer.kill();
  });
});
