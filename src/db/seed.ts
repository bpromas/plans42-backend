import { db } from './index';
import { users } from './schema';
import 'dotenv/config';

async function seed() {
  console.log('🌱 Seeding database...');

  await db.insert(users).values({
    username: 'admin',
    password: 'senha123', // TO-DO: hash this with bcrypt
  }).onConflictDoNothing();

  console.log('✅ Admin user seeded.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});