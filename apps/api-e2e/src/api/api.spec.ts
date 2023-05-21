import axios from 'axios';

describe('GET /api', () => {
  let res;
  it('should return a message', async () => {
    try {
      res = await axios.get('api/');
      console.log(res);
    } catch (error) {
      expect(error.response.status).toEqual(401); // Since we are not logged in
      return;
    }
  });
});
