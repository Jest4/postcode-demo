Based on the contents of Question.md from the interview.
- index.js is the code solution, 
- the URL https://postcode.estany.ca/ hosts a basic react frontend (built using vite), served by a cloudfront distribution from an s3 bucket
- ./index.js is served via lambda (manually deployed), for local, local.js wraps it.
- The setup instructions below are a bit convoluted because the domain for the post request is hardcoded to match the cloudfront distribution (line 12 of frontend/src/App.jsx, replaced with the sed command for local execution)
- The lambda is unauthenticated, since the demo will be shortlived and there are no exposed resources, the lambda provides significant in-built security.
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

## Project Structure

```
├── index.js              # Backend serverless function
├── Question.md           # Original problem statement
└── frontend/             # React frontend application
    ├── public/           # Static assets
    ├── src/              # React source code
    │   ├── App.jsx       # Main React component
    │   └── assets/       # Frontend assets
    ├── package.json      # Frontend dependencies
    └── vite.config.js    # Vite configuration
```

## Getting Started

### Backend Setup

The backend is designed as a serverless function. The main code is in `index.js` and implements:
- `province_for`: Returns the province code for a given postal code
- `valid_for`: Validates if a postal code belongs to a specific province
- `checkPostalCode`: Combines the above functions to provide a complete validation

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```


3. Replace the hardcoded url `https://postcode.estany.ca/` in `App.jsx` in the frontend directory to match the domain from local.js
    ```bash
    sed -i '0,/https:\/\/postcode\.estany\.ca\//s//http:\/\/localhost:3000\//' src/App.jsx
    ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. For local testing, fire up the api
    IN A NEW TERMINAL in the root folder
   ```bash
   node local.js
   ```
   OR from the frontend folder
   ```bash
   node ../local.js
   ```

5. For frontend build:
   ```bash
   npm run build
   ```

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
