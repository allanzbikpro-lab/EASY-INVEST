/**
 * CHNGR — Serveur webhook léger (Node.js / Express)
 * 
 * Ce fichier est OPTIONNEL. Utilisez-le uniquement si vous
 * hébergez Chngr sur votre propre serveur (VPS, Raspberry Pi, etc.)
 * 
 * Pour la solution sans serveur, utilisez Make.com ou n8n.io
 * (voir RACCOURCI-SETUP.md)
 * 
 * ── Installation ──────────────────────────────────────
 * npm install express cors
 * node webhook-server.js
 * 
 * ── Endpoints ─────────────────────────────────────────
 * POST /webhook/pesee          ← reçoit une pesée depuis le Raccourci iOS
 * GET  /api/pesees/:userId      ← retourne toutes les pesées d'un utilisateur
 * DELETE /api/pesees/:userId/:date ← supprime une pesée
 */

const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const DB   = path.join(__dirname, 'chngr-data.json');

app.use(cors());
app.use(express.json());

// ── Charge / initialise la DB JSON ────────────────────
function loadDB() {
  if (!fs.existsSync(DB)) fs.writeFileSync(DB, '{}');
  return JSON.parse(fs.readFileSync(DB, 'utf8'));
}
function saveDB(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// ── POST /webhook/pesee ────────────────────────────────
// Corps attendu depuis le Raccourci iOS / Make / n8n :
// { "userId": "usr_abc123", "date": "2025-05-15", "poids": 82.5 }
app.post('/webhook/pesee', (req, res) => {
  const { userId, date, poids } = req.body;

  if (!userId || !date || typeof poids !== 'number') {
    return res.status(400).json({ error: 'Paramètres manquants : userId, date, poids' });
  }
  if (poids < 20 || poids > 300) {
    return res.status(400).json({ error: 'Poids hors limites (20–300 kg)' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Format date invalide (YYYY-MM-DD)' });
  }

  const db   = loadDB();
  const user = db[userId] || [];

  const idx = user.findIndex(e => e.date === date);
  if (idx >= 0) user[idx].weight = poids;
  else user.push({ date, weight: poids });

  db[userId] = user;
  saveDB(db);

  console.log(`[CHNGR] ${userId} → ${date} : ${poids} kg`);
  res.json({ ok: true, date, poids, total: user.length });
});

// ── GET /api/pesees/:userId ────────────────────────────
app.get('/api/pesees/:userId', (req, res) => {
  const db   = loadDB();
  const user = db[req.params.userId] || [];
  const sorted = user.sort((a, b) => a.date.localeCompare(b.date));
  res.json(sorted);
});

// ── DELETE /api/pesees/:userId/:date ──────────────────
app.delete('/api/pesees/:userId/:date', (req, res) => {
  const db   = loadDB();
  const user = db[req.params.userId] || [];
  db[req.params.userId] = user.filter(e => e.date !== req.params.date);
  saveDB(db);
  res.json({ ok: true });
});

// ── Health check ──────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.listen(PORT, () => {
  console.log(`\n🟢 Chngr webhook server running on http://localhost:${PORT}`);
  console.log(`\nEndpoints :`);
  console.log(`  POST   http://localhost:${PORT}/webhook/pesee`);
  console.log(`  GET    http://localhost:${PORT}/api/pesees/:userId`);
  console.log(`  DELETE http://localhost:${PORT}/api/pesees/:userId/:date\n`);
});
