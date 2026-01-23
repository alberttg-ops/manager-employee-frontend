export const environment = {
  production: false,
  auth0: {
    domain: 'dev-6eq2fak8rsh6n851.us.auth0.com',
    clientId: 'xLPpwuPmydOwUi2qR6c225KYjoIwnewU',
    redirectUri: window.location.origin + '/callback',
    audience: 'https://manager-db.api' // optional, but recommended
  }
};
