// server.js — the backend
// This file runs a web server and handles all API requests.
// Data is stored in a SQLite database file (contacts.db).

const express  = require('express');
const Database = require('better-sqlite3');
const path     = require('path');

const app  = express();
const PORT = 3000;

// ── Database setup ──────────────────────────────────────────────
// Opens (or creates) contacts.db in this folder.
const db = new Database(path.join(__dirname, 'contacts.db'));

// Create the contacts table if it doesn't exist yet.
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT    NOT NULL,
    email TEXT    NOT NULL DEFAULT '',
    phone TEXT    NOT NULL DEFAULT ''
  )
`);

// ── Middleware ──────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── API Routes ──────────────────────────────────────────────────

// GET /contacts — return all contacts
app.get('/contacts', (req, res) => {
  const contacts = db.prepare('SELECT * FROM contacts ORDER BY name').all();
  res.json(contacts);
});

// POST /contacts — add a new contact
app.post('/contacts', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const result = db.prepare(
    'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)'
  ).run(name, email || '', phone || '');
  res.json({ id: result.lastInsertRowid, name, email: email || '', phone: phone || '' });
});

// PUT /contacts/:id — update an existing contact
app.put('/contacts/:id', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  db.prepare(
    'UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?'
  ).run(name, email || '', phone || '', req.params.id);
  res.json({ id: Number(req.params.id), name, email: email || '', phone: phone || '' });
});

// DELETE /contacts/:id — delete a contact
app.delete('/contacts/:id', (req, res) => {
  db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ── Start server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
