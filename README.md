Based on the contents of Question.md from the interview.
- index.js is the code solution, 
- the URL https://postcode.estany.ca/ hosts a basic react frontend (built using vite), served by a cloudfront distribution from an s3 bucket
- ./index.js is served via lambda (manually deployed), for local, local.js wraps it.
- The setup instructions below are a bit convoluted because the domain for the post request is hardcoded to match the cloudfront distribution (line 12 of frontend/src/App.jsx, replaced with the sed command for local execution)
- The lambda is unauthenticated, since the demo will be shortlived and there are no exposed resources, the lambda provides sufficient in-built security.
- The prefixToProvinceMap is a js object because they allow ~O(1) lookup.


# PostCode Checker

A web application that validates Canadian postal codes and identifies their associated provinces/territories.

## Project Overview

This application consists of two main components:
- A backend API that processes Canadian postal codes and returns the corresponding province or territory
- A React-based frontend that provides a user interface for entering postal codes and displaying results

The application validates Canadian postal codes in the format `A1A 1A1` (letter-number-letter space number-letter-number) and maps them to their respective provinces based on postal code prefixes.

## Features

- Validation of Canadian postal code format
- Identification of province/territory based on postal code prefix
- RESTful API endpoint for postal code processing
- Simple React UI for user interaction

## Technology Stack

### Backend
- Node.js serverless function
- REST API design

### Frontend
- React 19.x
- Vite 7.x build tool
- Modern JavaScript (ES modules)
- Environment-based configuration system

## Project Structure

```
├── index.js              # Backend serverless function
├── local.js              # Local server wrapper for index.js
├── openapi.yaml          # OpenAPI/Swagger API specification
├── api-docs.html         # Interactive API documentation with Swagger UI
├── Question.md           # Original problem statement
├── tests/                # Test files for the application
└── frontend/             # React frontend application
    ├── public/           # Static assets
    ├── src/              # React source code
    │   ├── App.jsx       # Main React component
    │   └── assets/       # Frontend assets
    ├── package.json      # Frontend dependencies
    ├── vite.config.js    # Vite configuration
    └── src/config.js     # Environment-specific configuration
```

## Configuration System

The frontend uses an environment-aware configuration system that automatically selects the appropriate API endpoint based on the current environment:

- In development mode, it uses `http://localhost:3000/api/postcode`
- In production mode, it uses `https://postcode.estany.ca/api/postcode`

This is managed through the `src/config.js` file and Vite's environment variables (`import.meta.env.MODE`), eliminating the need to manually modify URLs when switching between environments.

## Getting Started

### Backend Setup

The backend is designed as a serverless function. The main code is in `index.js` and implements:
- `province_for`: Returns the province code for a given postal code
- `valid_for`: Validates if a postal code belongs to a specific province
- `checkPostalCode`: Combines the above functions to provide a complete validation

To launch the API server locally (local.js which wraps the serverless function)
   ```bash
   npm run local
   ```  

   This will start the server on port 3000 and make the following available:
   - API endpoint: http://localhost:3000/api/postcode
   - Interactive API documentation: http://localhost:3000/docs
   - OpenAPI specification: http://localhost:3000/openapi.yaml

### Frontend Setup

In a separate terminal from the backend,
 
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. For deployable build:
   ```bash
   npm run build
   ```

### Testing
To run the test suite, execute the following command from the project root:

```bash
npm test
```

This will run all backend and API tests located in the `tests/` directory.

### API Documentation

The API is documented using the OpenAPI (Swagger) specification in the `openapi.yaml` file. This provides a complete description of the API endpoints, request/response formats, and examples.

You can visualize this specification using various tools:

1. Online with Swagger Editor:
   - Visit [Swagger Editor](https://editor.swagger.io/)
   - Import the `openapi.yaml` file

2. Using the included HTML documentation:
   - Open `api-docs.html` in your browser
   - This provides an interactive Swagger UI interface to explore and test the API

3. Using Swagger UI CLI:
   - Install Swagger UI: `npm install -g swagger-ui-cli`
   - Run: `swagger-ui-serve openapi.yaml`

The API provides a single POST endpoint at `/api/postcode` that accepts a JSON body with a `postCode` field and returns the corresponding province or an error message.

## API Usage

The API accepts POST requests with the following structure:

```json
{
  "postCode": "A1A 1A1"
}
```

Successful responses return:

```json
{
  "province": "XX"  // Two-letter province code
}
```

Error responses include appropriate status codes and error messages.

## Postal Code Prefix Mapping

| Province Code | Prefixes      | Province/Territory Name |
|---------------|---------------|-------------------------|
| ON            | K, L, M, N, P | Ontario                 |
| MB            | R             | Manitoba                |
| NU            | X0A, X0B, X0C | Nunavut                 |
| NT            | X0E, X0G, X1A | Northwest Territories   |
