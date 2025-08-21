import http from 'http';
import { handler } from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.yaml': 'application/yaml',
  '.yml': 'application/yaml',
};

// Function to serve static files
const serveFile = (filePath, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';
    
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
};

const server = http.createServer(async (req, res) => {
    // Serve OpenAPI documentation
    if (req.method === 'GET' && req.url === '/docs') {
        const filePath = path.join(__dirname, 'api-docs.html');
        serveFile(filePath, res);
        return;
    }
    
    // Serve the OpenAPI specification
    if (req.method === 'GET' && req.url === '/openapi.yaml') {
        const filePath = path.join(__dirname, 'openapi.yaml');
        serveFile(filePath, res);
        return;
    }
    
    if (req.method === 'POST' && req.url === '/api/postcode') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            // Create an event object similar to what AWS Lambda would provide
            const event = {
                httpMethod: req.method,
                path: req.url,
                headers: req.headers,
                body: body
            };
            
            // Call the handler and wait for the response
            const response = await handler(event);
            
            // Set status code and headers from the response
            res.statusCode = response.statusCode || 200;
            
            // Set CORS headers if needed
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
            
            // Send the response body
            res.end(response.body);
        });
    } else if (req.method === 'OPTIONS') {
        // Handle preflight CORS requests
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
        res.end();
    } else if (req.method === 'GET' && req.url === '/') {
        // Redirect to docs page
        res.statusCode = 302;
        res.setHeader('Location', '/docs');
        res.end();
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
    console.log('API documentation available at http://localhost:3000/docs');
});