import { handler, prefixToProvinceMap, isValidPostalCodeFormat, province_for, valid_for, checkPostalCode } from '../index.js';

// Mock event objects
const createMockEvent = (httpMethod, body) => ({
  httpMethod,
  body: body ? JSON.stringify(body) : undefined
});

describe('Postal Code Handler', () => {

  // Test invalid JSON body
  test('returns 400 for invalid JSON in body', async () => {
    const event = {
      httpMethod: 'POST',
      body: '{"postCode": "K1A 0A1"' // Missing closing bracket
    };
    
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toHaveProperty('message', 'Invalid JSON in request body');
  });

  // Test missing postCode
  test('returns 400 when postCode is missing', async () => {
    const event = createMockEvent('POST', {});
    
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toHaveProperty('message', 'postCode is required and must be a string');
  });

  // Test invalid postCode type
  test('returns 400 when postCode is not a string', async () => {
    const event = createMockEvent('POST', { postCode: 12345 });
    
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toHaveProperty('message', 'postCode is required and must be a string');
  });

  // Test valid postCode
  test('returns province for valid postal code', async () => {
    const event = createMockEvent('POST', { postCode: 'K1A 0A1' });
    
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty('province', 'ON');
  });

  // Test invalid postCode
  test('returns 404 for invalid postal code', async () => {
    const event = createMockEvent('POST', { postCode: 'Z9Z 9Z9' }); // No such prefix
    
    const response = await handler(event);
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toHaveProperty('message', 'Invalid postal code or province not found');
  });
});

describe('Helper Functions', () => {
  // Test postal code format validation
  test('validates postal code format correctly', () => {
    expect(isValidPostalCodeFormat('K1A 0A1')).toBe(true);
    expect(isValidPostalCodeFormat('k1a 0a1')).toBe(true); // Case insensitive
    expect(isValidPostalCodeFormat('K1A0A1')).toBe(false); // Missing space
    expect(isValidPostalCodeFormat('K1A  0A1')).toBe(false); // Extra space
    expect(isValidPostalCodeFormat('1A0 A1K')).toBe(false); // Wrong format
    expect(isValidPostalCodeFormat('KAA 0A1')).toBe(false); // Letter where number should be
  });

  // Test province matching
  test('matches province code correctly', () => {
    // Test for Ontario
    expect(province_for('K1A 0A1')).toBe('ON');
    expect(province_for('L4C 7B2')).toBe('ON');
    
    // Test for Manitoba
    expect(province_for('R3T 2N2')).toBe('MB');
    
    // Test for Nunavut
    expect(province_for('X0A 0H0')).toBe('NU');
    
    // Test for Northwest Territories
    expect(province_for('X0E 0P0')).toBe('NT');
    expect(province_for('X1A 0A1')).toBe('NT');
    
    // Test invalid prefix
    expect(province_for('Z0A 0A1')).toBe(false);
  });

  // Test valid_for function
  test('validates postal code for a specific province', () => {
    expect(valid_for('K1A 0A1', 'ON')).toBe(true);
    expect(valid_for('K1A 0A1', 'MB')).toBe(false); // Wrong province
    expect(valid_for('K1A0A1', 'ON')).toBe(false); // Invalid format
  });

  // Test checkPostalCode function
  test('checks postal code and returns province or false', () => {
    expect(checkPostalCode('K1A 0A1')).toBe('ON');
    expect(checkPostalCode('X0A 0H0')).toBe('NU');
    expect(checkPostalCode('Z1A 0A1')).toBe(false); // Invalid prefix
    expect(checkPostalCode('K1A0A1')).toBe(false); // Invalid format
  });

    // Test CORS handling
  test('handles OPTIONS request for CORS', async () => {
    const event = createMockEvent('OPTIONS');
    const response = await handler(event);
    
    expect(response.statusCode).toBe(200);
    expect(response.headers).toHaveProperty('Access-Control-Allow-Origin');
    expect(response.headers).toHaveProperty('Access-Control-Allow-Headers');
    expect(response.headers).toHaveProperty('Access-Control-Allow-Methods');
  });

});
