const http = require('http');
const { handler } = require('./index.js');

const server = http.createServer(async (req, res) => {
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
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});