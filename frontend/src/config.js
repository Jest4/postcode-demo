// Configuration file for API endpoints
// Endpoints are selected based on the current environment (development/production)
export const config = {
  development: {
    apiEndpoint: 'http://localhost:3000/api/postcode'
  },
  production: {
    apiEndpoint: 'https://postcode.estany.ca/api/postcode'
  }
};

export default config;
