
const baseUrl = 'http://localhost:3000/api';

describe('api', () => {
  it('should display welcome message', () => {
    // Custom command example, see `../support/commands.ts` file
    // get /api
    // this should error and give a 401
    cy.request({
      method: 'GET',
      url: `${baseUrl}`,
      failOnStatusCode: false,
    }).should((response) => {
      expect(response.status).to.eq(401);
    });
  });
});
