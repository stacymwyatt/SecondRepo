// generate-test-data.js
// Run this script to fill your database with random test contacts.
//
// Usage:
//   node generate-test-data.js        ← adds 10 contacts
//   node generate-test-data.js 25     ← adds 25 contacts
//   node generate-test-data.js 10 --clear  ← wipes existing data first, then adds 10

const Database = require('better-sqlite3');
const path     = require('path');

// ── Name parts to mix and match ─────────────────────────────────
const firstNames = [
  'Alice', 'Brian', 'Carmen', 'Derek', 'Elena',
  'Frank', 'Grace', 'Henry', 'Isabel', 'James',
  'Karen', 'Liam',  'Maria', 'Nathan', 'Olivia',
  'Pablo', 'Quinn', 'Rachel','Samuel','Tanya',
  'Ulric', 'Vera',  'Wayne', 'Xena',  'Yolanda', 'Zach'
];

const lastNames = [
  'Anderson', 'Baker',   'Carter',  'Davis',   'Evans',
  'Foster',   'Garcia',  'Harris',  'Ingram',  'Johnson',
  'King',     'Lopez',   'Miller',  'Nelson',  'Owens',
  'Patel',    'Quinn',   'Rivera',  'Smith',   'Taylor',
  'Upton',    'Vargas',  'Walker',  'Xavier',  'Young',   'Zhang'
];

const emailDomains = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'hotmail.com'
];

const areaCodes = [
  '512', '713', '214', '832', '469',
  '281', '346', '737', '915', '210'
];

// ── Helper functions ────────────────────────────────────────────

// Pick a random item from an array.
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a random 7-digit local phone number.
function randomLocalNumber() {
  return String(Math.floor(1000000 + Math.random() * 9000000));
}

// Build one random contact object.
function generateContact() {
  const first  = pick(firstNames);
  const last   = pick(lastNames);
  const domain = pick(emailDomains);
  const area   = pick(areaCodes);
  const local  = randomLocalNumber();

  return {
    name:  `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`,
    phone: `${area}-${local.slice(0, 3)}-${local.slice(3)}`
  };
}

// ── Main ────────────────────────────────────────────────────────
const args  = process.argv.slice(2);
const count = parseInt(args[0]) || 10;
const clear = args.includes('--clear');

const db = new Database(path.join(__dirname, 'contacts.db'));

if (clear) {
  db.prepare('DELETE FROM contacts').run();
  console.log('Cleared existing contacts.');
}

const insert = db.prepare(
  'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)'
);

// Use a transaction so all inserts happen at once (faster).
const insertMany = db.transaction((contacts) => {
  for (const c of contacts) {
    insert.run(c.name, c.email, c.phone);
  }
});

const contacts = Array.from({ length: count }, generateContact);
insertMany(contacts);

console.log(`Added ${count} random contacts to contacts.db`);
