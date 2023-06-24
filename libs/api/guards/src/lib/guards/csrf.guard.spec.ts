import { CsrfGuard } from './csrf.guard';

describe('CsrfGuard', () => {
  it('should be defined', () => {
    expect(new CsrfGuard()).toBeDefined();
  });
});
