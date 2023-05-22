describe('app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Get ion-button
    cy.get('ion-button').contains('Log in with Google');
  });
});
