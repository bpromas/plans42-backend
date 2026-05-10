import { db } from './index';
import { users } from './schema';
import bcrypt from 'bcrypt';
import 'dotenv/config';

async function seed() {
  console.log('🌱 Seeding database...');

  await db.insert(users).values({
    username: 'admin',
    password: await bcrypt.hash('senha123', 10),
    role: 'admin'
  }).onConflictDoNothing();

  console.log('✅ Admin user seeded.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});