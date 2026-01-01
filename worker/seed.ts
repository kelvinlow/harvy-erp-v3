import { createDb } from './src/db';
import { users } from './src/db/schema';
import { hashPassword } from './src/utils/auth';
import { eq } from 'drizzle-orm';

/**
 * Seed script to create initial admin user
 * Run with: npx tsx seed.ts
 */

async function seed() {
  console.log('🌱 Seeding database...');

  // This would need to be run with actual D1 binding
  // For now, this is a template - actual seeding should be done via wrangler

  const adminEmail = 'admin@harvy.com';
  const adminPassword = 'Admin123!'; // Change this!

  console.log(`Creating admin user: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log(
    '\n⚠️  IMPORTANT: Change the admin password after first login!\n'
  );

  const passwordHash = await hashPassword(adminPassword);

  console.log('Password hash generated:');
  console.log(passwordHash);

  console.log('\n📝 Run this SQL command to create the admin user:');
  console.log(
    `\nnpx wrangler d1 execute harvy-erp-db --local --command "UPDATE users SET password_hash='${passwordHash}', status='active' WHERE email='${adminEmail}'"\n`
  );
}

seed().catch(console.error);
