/**
 * Seed script for Prestance X CRM
 * Usage: npm run seed   (run from /backend)
 *
 * - Creates one Admin account (from .env, or sensible defaults)
 * - Creates one sample Commercial account
 * - Inserts a handful of sample leads with notes so the dashboard
 *   isn't empty on first run
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../config/db');

const seed = async () => {
  try {
    console.log('🌱 Seeding database...');

    const adminName = process.env.SEED_ADMIN_NAME || 'Admin User';
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@prestancex.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

    // ---- Admin user ----
    const [existingAdmin] = await db.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    let adminId;
    if (existingAdmin.length > 0) {
      adminId = existingAdmin[0].id;
      console.log(`ℹ️  Admin account already exists (${adminEmail}), skipping creation`);
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [adminName, adminEmail, hashedPassword, 'admin']
      );
      adminId = result.insertId;
      console.log(`✅ Admin account created -> email: ${adminEmail} | password: ${adminPassword}`);
    }

    // ---- Sample commercial user ----
    const commercialEmail = 'commercial@prestancex.com';
    const [existingCommercial] = await db.query('SELECT id FROM users WHERE email = ?', [commercialEmail]);
    let commercialId;
    if (existingCommercial.length > 0) {
      commercialId = existingCommercial[0].id;
      console.log(`ℹ️  Sample commercial account already exists (${commercialEmail}), skipping`);
    } else {
      const hashedPassword = await bcrypt.hash('Commercial@12345', 10);
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Commercial User', commercialEmail, hashedPassword, 'commercial']
      );
      commercialId = result.insertId;
      console.log(`✅ Commercial account created -> email: ${commercialEmail} | password: Commercial@12345`);
    }

    // ---- Sample leads ----
    const [existingLeads] = await db.query('SELECT COUNT(*) AS count FROM leads');
    if (existingLeads[0].count > 0) {
      console.log('ℹ️  Leads already exist, skipping sample lead creation');
    } else {
      const sampleLeads = [
        ['Awa', 'Kokou', '+228 90 11 22 33', 'awa.kokou@example.com', 'Lomé', 'Shirts', 'Interested in the linen shirt collection.', 'WhatsApp', 'New'],
        ['Kossi', 'Mensah', '+228 91 22 33 44', 'kossi.mensah@example.com', 'Lomé', 'Jackets', 'Asked about winter jackets in stock.', 'Facebook', 'Contacted'],
        ['Ama', 'Adjei', '+228 92 33 44 55', null, 'Kpalimé', 'Shoes', 'Wants a pair of size 42 sneakers.', 'Instagram', 'New'],
        ['Yao', 'Dogbe', '+228 93 44 55 66', 'yao.dogbe@example.com', 'Lomé', 'Pants', 'Looking for slim fit trousers.', 'Website', 'Converted'],
        ['Abla', 'Tetteh', '+228 94 55 66 77', null, 'Sokodé', 'Cardigans', 'Requested photos of available cardigans.', 'Referral', 'Contacted'],
        ['Kofi', 'Agbeko', '+228 95 66 77 88', 'kofi.agbeko@example.com', 'Lomé', 'Ties', 'Walked in asking about formal ties for an event.', 'Walk-in', 'New'],
      ];

      for (const lead of sampleLeads) {
        const [result] = await db.query(
          `INSERT INTO leads
            (first_name, last_name, phone, email, city, interested_product, message, lead_source, status, assigned_to, created_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [...lead, commercialId, adminId]
        );

        if (lead[8] !== 'New') {
          await db.query('INSERT INTO notes (lead_id, author_id, content) VALUES (?, ?, ?)', [
            result.insertId,
            commercialId,
            `Followed up with ${lead[0]} ${lead[1]} regarding their interest.`,
          ]);
        }
      }
      console.log(`✅ Inserted ${sampleLeads.length} sample leads with notes`);
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
