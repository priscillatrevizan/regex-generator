// Simple unit test harness for regexPatterns.generateIPv4Regex
const assert = require('assert');
const path = require('path');

// Import the module (ES module exports are transpiled? file uses export const — require may not work directly).
// To keep this simple, load the file as an ES module using dynamic import.
(async () => {
  const modulePath = path.resolve(__dirname, '..', 'src', 'model', 'regexPatterns.js');

  try {
    const mod = await import('file://' + modulePath.replace(/\\/g, '/'));

    const { generateIPv4Regex } = mod;

    // Test cases
    const valid = [
      '192.168.0.1',
      '0.0.0.0',
      '255.255.255.255',
      '8.8.8.8'
    ];

    const invalid = [
      '256.0.0.1',
      '1.2.3',
      '1234.5.6.7',
      '192.168.0.256'
    ];

    const { pattern } = generateIPv4Regex({ allowCIDR: false });
    const re = new RegExp(pattern);

    valid.forEach(v => assert(re.test(v), `Should match valid address: ${v}`));
    invalid.forEach(v => assert(!re.test(v), `Should NOT match invalid address: ${v}`));

    // Test CIDR allowed
    const { pattern: patternCIDR } = generateIPv4Regex({ allowCIDR: true });
    const reCIDR = new RegExp(patternCIDR);

    assert(reCIDR.test('192.168.1.0/24'), 'Should match valid CIDR');
    assert(!reCIDR.test('192.168.1.0/33'), 'Should NOT match invalid CIDR prefix');

    console.log('All IPv4 generator tests passed.');
    process.exit(0);
  } catch (err) {
    console.error('Test run failed:', err);
    process.exit(2);
  }
})();
