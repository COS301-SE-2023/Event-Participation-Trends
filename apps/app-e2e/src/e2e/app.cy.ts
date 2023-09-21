import { getGreeting } from '../support/app.po';

describe('app', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('/');
    cy.setCookie('csrf', 'TestCSRFValue');
    cy.setCookie('jwt', 'TestJWTValue');
    cy.intercept(
      {
        method: 'GET',
        url: '/api/auth/google',
      },
      {
        statusCode: 302,
        headers: {
          location: 'http://localhost:4200/home/viewevents',
        },
      }
    ).as('googleAuth');
    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/getRole',
      },
      {
        statusCode: 200,
        body: {
          userRole: 'admin',
        },
      }
    ).as('getRole');
    cy.intercept(
      {
        method: 'GET',
        url: '/api/event/getAllEvents',
      },
      {
        statusCode: 200,
        body: {
          "events": [
            {
                "_id": "6485baa6e9ff924f40d2047c",
                "StartDate": "2023-06-11T04:34:57.000Z",
                "EndDate": "2023-06-14T06:34:56.000Z",
                "Name": "3UP Project day",
                "Category": "Project Demonstrations",
                "Location": {
                    "Latitude": -25.7462,
                    "Longitude": 28.1881,
                    "StreetName": "Lynnwood Road",
                    "CityName": "Pretoria",
                    "ProvinceName": "Gauteng",
                    "CountryName": "South Africa",
                    "ZIPCode": "0038",
                    "_id": "6496d4e1f41f11c89be457c5",
                    "createdAt": "2023-06-25T13:18:10.740Z",
                    "updatedAt": "2023-06-25T13:18:10.740Z"
                },
                "thisFloorLayout": null,
                "Stalls": null,
                "Sensors": null,
                "Devices": null,
                "BTIDtoDeviceBuffer": null,
                "TEMPBuffer": null,
                "Manager": "64871cdadffae52559d23502",
                "Requesters": [
                    "64876d8890328353935bc762"
                ],
                "Viewers": [
                    "64871cdadffae52559d23502"
                ],
                "createdAt": "2023-06-11T12:14:30.935Z",
                "updatedAt": "2023-06-25T14:43:55.039Z",
                "__v": 0
            },
          ]
        }
      }
    ).as('getAllEvents');
  });
  it('should contain an event', () => {
    // cy.get('div').contains('LOG IN WITH GOOGLE').click();
    // cy.visit('/');
    // cy.window().then((win) => {
    //   win.location.href = 'http://localhost:4200/home/viewevents';
    // });
    // cy.get('ion-card').should('contain', '3UP Project day');
  });
});
