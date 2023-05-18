import { JwtHandlerMiddleware } from './jwt-handler.middleware';

describe('JwtHandlerMiddleware', () => {
  it('should be defined', () => {
    expect(new JwtHandlerMiddleware()).toBeDefined();
  });
});
