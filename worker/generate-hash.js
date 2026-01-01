/**
 * Generate password hash for seeding
 * Run with: node generate-hash.js
 */

// Simple PBKDF2 implementation for Node.js
const crypto = require('crypto');

const SALT_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 32;

async function hashPassword(password) {
    const salt = crypto.randomBytes(SALT_LENGTH);

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, 'sha256', (err, derivedKey) => {
            if (err) reject(err);

            const combined = Buffer.concat([salt, derivedKey]);
            resolve(combined.toString('base64'));
        });
    });
}

// Generate hash for default admin password
const password = process.argv[2] || 'Admin123!';

hashPassword(password).then(hash => {
    console.log('\n🔐 Password Hash Generated\n');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n📝 SQL Command:\n');
    console.log(`npx wrangler d1 execute harvy-erp-db --local --command "UPDATE users SET password_hash='${hash}' WHERE email='admin@harvy.com'"`);
    console.log('\n');
}).catch(console.error);
