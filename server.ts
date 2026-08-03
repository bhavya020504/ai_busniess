import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ES‑module __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Global middleware
app.use(cors());
app.use(express.json());

// Neon PostgreSQL connection pool
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// DB initialization (run once at startup)
const initDb = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        lead_id VARCHAR(50) UNIQUE NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        business_email VARCHAR(255) NOT NULL,
        phone_number VARCHAR(50) NOT NULL,
        industry VARCHAR(100) NOT NULL,
        call_status VARCHAR(50) DEFAULT 'NEW_LEAD_PENDING_CALL',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    client.release();
    console.log('✅ Neon PostgreSQL connected & leads table ready.');
  } catch (error) {
    console.error('❌ Neon DB init error:', error);
  }
};

initDb();

// ------------------- API ENDPOINTS (unchanged) -------------------

// POST /api/leads – create a lead & optionally trigger a call webhook
app.post('/api/leads', async (req: Request, res: Response) => {
  try {
    const { companyName, contactPerson, businessEmail, phoneNumber, industry } = req.body;
    if (!companyName || !contactPerson || !businessEmail || !phoneNumber || !industry) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const leadId = 'AIB-' + Math.floor(100000 + Math.random() * 900000);
    const callStatus = 'CALL_TRIGGERED';
    const insertQuery = `
      INSERT INTO leads
        (lead_id, company_name, contact_person, business_email, phone_number, industry, call_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [leadId, companyName, contactPerson, businessEmail, phoneNumber, industry, callStatus];
    const result = await pool.query(insertQuery, values);
    const newLead = result.rows[0];
    console.log(`🚀 New lead stored – ID:${leadId} Company:${companyName}`);
    if (process.env.CALL_WEBHOOK_URL) {
      try {
        await fetch(process.env.CALL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId, companyName, contactPerson, businessEmail, phoneNumber, industry }),
        });
        console.log('📡 Call webhook notified.');
      } catch (webhookErr) {
        console.error('Call webhook error:', webhookErr);
      }
    }
    return res.status(200).json({ success: true, message: 'Thank you! Your request has been received.', lead: newLead });
  } catch (error: any) {
    console.error('Error saving lead:', error);
    return res.status(500).json({ success: false, message: 'Failed to save lead. ' + (error.message || '') });
  }
});

// GET /api/leads – protected list of leads
app.get('/api/leads', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || '';
  if (!ADMIN_PASSWORD || authHeader !== ADMIN_PASSWORD) {
    console.warn('Unauthorized leads fetch attempt');
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC;');
    return res.status(200).json({ success: true, count: result.rows.length, leads: result.rows });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch leads.' });
  }
});

// POST /api/leads/:leadId/trigger-call – manual call trigger
app.post('/api/leads/:leadId/trigger-call', async (req: Request, res: Response) => {
  try {
    const { leadId } = req.params;
    const findResult = await pool.query('SELECT * FROM leads WHERE lead_id = $1 OR id::text = $1;', [leadId]);
    if (findResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }
    const lead = findResult.rows[0];
    await pool.query('UPDATE leads SET call_status = $1 WHERE id = $2;', ['CALL_TRIGGERED', lead.id]);
    console.log(`📞 Manual call triggered for ${lead.contact_person} (${lead.phone_number})`);
    return res.status(200).json({ success: true, message: `Call triggered for ${lead.contact_person} (${lead.phone_number})!`, lead });
  } catch (error: any) {
    console.error('Error triggering call:', error);
    return res.status(500).json({ success: false, message: 'Failed to trigger call.' });
  }
});

// GET /api/health – health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'AIBridge Neon DB & Call Trigger API' });
});

// ------------------- PRODUCTION STATIC SERVING -------------------

// Serve Vite's build output
app.use(express.static(path.resolve(__dirname, 'dist')));

// Fallback for React Router – send index.html for any non‑API route
app.use((req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'Not found',
    });
  }

  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`⚡ AIBridge API server running on http://localhost:${PORT}`);
});
