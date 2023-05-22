import { GoogleOAuthGuard } from './google-oauth-guard.guard';

describe('GoogleOauthGuardGuard', () => {
  it('should be defined', () => {
    expect(new GoogleOAuthGuard()).toBeDefined();
  });
});
