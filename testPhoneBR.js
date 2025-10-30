// Test script for Brazilian phone regex generator
import { generatePhoneBRRegex } from './src/model/regexPatterns.js';

console.log('Testing Brazilian Phone Regex Generator\n');

// Test 1: Basic phone number without formatting
console.log('Test 1: Basic phone number without formatting');
const basicOptions = {};
const basicResult = generatePhoneBRRegex(basicOptions);
console.log(`Pattern: ${basicResult.pattern}`);
console.log(`Flags: ${basicResult.flags}\n`);

// Test 2: Phone number with formatting allowed
console.log('Test 2: Phone number with formatting allowed');
const formattingOptions = { allowFormatting: true };
const formattingResult = generatePhoneBRRegex(formattingOptions);
console.log(`Pattern: ${formattingResult.pattern}`);
console.log(`Flags: ${formattingResult.flags}\n`);

// Test 3: Phone number with country code allowed
console.log('Test 3: Phone number with country code allowed');
const countryCodeOptions = { allowCountryCode: true };
const countryCodeResult = generatePhoneBRRegex(countryCodeOptions);
console.log(`Pattern: ${countryCodeResult.pattern}`);
console.log(`Flags: ${countryCodeResult.flags}\n`);

// Test 4: Phone number with both formatting and country code allowed
console.log('Test 4: Phone number with both formatting and country code allowed');
const fullOptions = { allowCountryCode: true, allowFormatting: true };
const fullResult = generatePhoneBRRegex(fullOptions);
console.log(`Pattern: ${fullResult.pattern}`);
console.log(`Flags: ${fullResult.flags}\n`);

// Test validation with actual phone numbers
console.log('Testing validation with actual phone numbers:\n');

const testNumbers = [
    '11999999999',           // Valid mobile without formatting
    '(11) 99999-9999',       // Valid mobile with formatting
    '+55 11 99999-9999',     // Valid mobile with country code and formatting
    '11 99999-9999',         // Valid mobile with partial formatting
    '11 3333-3333',          // Valid landline without formatting
    '(11) 3333-3333',        // Valid landline with formatting
    '+55 11 3333-3333',      // Valid landline with country code and formatting
    '99999999999',           // Invalid DDD
    '1199999999',            // Invalid mobile (too short)
    '113333333',             // Invalid landline (too short)
];

// Test with full options (most permissive)
const validator = new RegExp(fullResult.pattern, fullResult.flags);

testNumbers.forEach(number => {
    const isValid = validator.test(number);
    console.log(`${number}: ${isValid ? 'VALID' : 'INVALID'}`);
});