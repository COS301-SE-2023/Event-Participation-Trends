import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appservice = new AppService();
  let appcontroller = new AppController(appservice);

  beforeEach(() => {
    appservice = new AppService();
    appcontroller = new AppController(appservice); 
  });

  describe('findAll', () => {
    it('Should return `Hello API`', async () => {
      const result = {
        message: 'Hello API',
      };
      jest.spyOn(appservice, 'getData').mockImplementation(() => result);
      expect(await appcontroller.getData()).toBe(result);
    });
  });
});