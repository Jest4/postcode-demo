const prefixToProvinceMap = {
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

function isValidPostalCodeFormat(postalCode) {
    const postalCodeRegex = /^[A-Za-z][0-9][A-Za-z]\s[0-9][A-Za-z][0-9]$/;
    return postalCodeRegex.test(postalCode);
}

function province_for(postalCode) {
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

function valid_for(postalCode, provinceCode) {
    // Check if postal code format is valid
    if (!isValidPostalCodeFormat(postalCode)) {
        return false;
    }

    // Get the province for the postal code
    const matchedProvince = province_for(postalCode);

    // Return true if the matched province matches the provided province code
    return matchedProvince === provinceCode;
}

// Export the functions
module.exports = {
    province_for,
    valid_for
};

function checkPostalCode(postalCode) {
     // Get the province for the postal code
    const matchedProvince = province_for(postalCode);
    // If a province is matched and the postal code is valid for that province, return the province
    // otherwise return false (invalid post codes, unable to match province)
    return (matchedProvince && valid_for(postalCode, matchedProvince)) ? matchedProvince : false;
}