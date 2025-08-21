export const handler = async (event) => {

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({})
        };
    }

    let body;
    try {
        body = event.body ? JSON.parse(event.body) : {};
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid JSON in request body" })
        };
    }

    const response = {};

    // Check if postCode exists in the request body and is a string
    if (!body.postCode || typeof body.postCode !== 'string') {
        response.statusCode = 400;
        response.body = JSON.stringify({ message: "postCode is required and must be a string" });
        return response;
    }

    const result = checkPostalCode(body.postCode);

    if (result) {
        response.statusCode = 200;
        response.body = JSON.stringify({ province: result });
    } else {
        response.statusCode = 404;
        response.body = JSON.stringify({ message: "Invalid postal code or province not found" });
    }

    return response;
};

export const prefixToProvinceMap = {
    'K': 'ON',
    'L': 'ON',
    'M': 'ON',
    'N': 'ON',
    'P': 'ON',
    'R': 'MB',
    'X0A': 'NU',
    'X0B': 'NU',
    'X0C': 'NU',
    'X0E': 'NT',
    'X0G': 'NT',
    'X1A': 'NT'
};

export function isValidPostalCodeFormat(postalCode) {
    const postalCodeRegex = /^[A-Za-z][0-9][A-Za-z]\s[0-9][A-Za-z][0-9]$/;
    return postalCodeRegex.test(postalCode);
}

export function province_for(postalCode) {
    // Convert to uppercase for consistency
    postalCode = postalCode.toUpperCase();

    // Because the multicharacter prefixes in the table don't overlap with single character prefixes
    // we can check the first character first.
    // The preference for checking single character prefixes first is because only 0.2% of  
    // Canada's population live in NT and NU. 
    // If there is overlap between multicharacter prefixes and single character prefixes, the
    // order would need to be reversed.
    const firstChar = postalCode.charAt(0);
    if (prefixToProvinceMap[firstChar]) {
        return prefixToProvinceMap[firstChar];
    }

    const firstThreeChars = postalCode.substring(0, 3);
    if (prefixToProvinceMap[firstThreeChars]) {
        return prefixToProvinceMap[firstThreeChars];
    }

    // No match
    return false;
}

export function valid_for(postalCode, provinceCode) {
    // Check if postal code format is valid
    if (!isValidPostalCodeFormat(postalCode)) {
        return false;
    }

    // Get the province for the postal code
    const matchedProvince = province_for(postalCode);

    // Return true if the matched province matches the provided province code
    return matchedProvince === provinceCode;
}

export function checkPostalCode(postalCode) {
    // Get the province for the postal code
    const matchedProvince = province_for(postalCode);
    // If a province is matched and the postal code is valid for that province, return the province
    // otherwise return false (invalid post codes, unable to match province)
    return (matchedProvince && valid_for(postalCode, matchedProvince)) ? matchedProvince : false;
}