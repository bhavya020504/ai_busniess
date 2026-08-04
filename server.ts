// server.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

// __dirname shim for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL pool (Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Initialize DB: ensure leads table
async function initDb(): Promise<void> {
  const client = await pool.connect();
  try {
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
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ DB ready – leads table ensured');
  } finally {
    client.release();
  }
}

initDb().catch(err => console.error('DB init error:', err));

// Types
interface LeadInput {
  companyName: string;
  contact_person: string;
  business_email: string;
  phone_number: string;
  industry: string;
}

interface Lead extends LeadInput {
  id: number;
  lead_id: string;
  call_status: string;
  created_at: string;
}

function generateLeadId(): string {
  return 'AIB-' + Math.floor(100000 + Math.random() * 900000);
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'AIBridge API' });
});

// Create lead
app.post('/api/leads', async (req: Request, res: Response) => {
  const { companyName, contact_person, business_email, phone_number, industry } = req.body as LeadInput;
  if (!companyName || !contact_person || !business_email || !phone_number || !industry) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  const leadId = generateLeadId();
  const callStatus = 'CALL_TRIGGERED';
  try {
    const result = await pool.query(
      `INSERT INTO leads (lead_id, company_name, contact_person, business_email, phone_number, industry, call_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [leadId, companyName, contact_person, business_email, phone_number, industry, callStatus]
    );
    const newLead = result.rows[0] as Lead;
    if (process.env.CALL_WEBHOOK_URL) {
      try {
        await fetch(process.env.CALL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId, companyName, contact_person, business_email, phone_number, industry }),
        });
        console.log('✅ Call webhook notified');
      } catch (wh) {
        console.error('⚠️ Call webhook error:', wh);
      }
    }
    res.status(201).json({ success: true, lead: newLead });
  } catch (err) {
    console.error('Insert lead error:', err);
    res.status(500).json({ success: false, message: 'Failed to save lead.' });
  }
});

// List leads (protected)
app.get('/api/leads', async (req: Request, res: Response) => {
  const adminPwd = process.env.ADMIN_PASSWORD || '';
  const authHeader = req.headers.authorization || '';
  if (!adminPwd || authHeader !== adminPwd) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC;');
    res.json({ success: true, count: result.rowCount, leads: result.rows });
  } catch (err) {
    console.error('Fetch leads error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch leads.' });
  }
});

// Manual call trigger
app.post('/api/leads/:leadId/trigger-call', async (req: Request, res: Response) => {
  const { leadId } = req.params;
  try {
    const findRes = await pool.query(
      'SELECT * FROM leads WHERE lead_id = $1 OR id::text = $1;',
      [leadId]
    );
    if (findRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }
    const lead = findRes.rows[0] as Lead;
    await pool.query('UPDATE leads SET call_status = $1 WHERE id = $2;', ['CALL_TRIGGERED', lead.id]);
    console.log(`✅ Manual call triggered for lead ${lead.lead_id}`);
    res.json({ success: true, message: `Call triggered for lead ${lead.lead_id}`, lead });
  } catch (err) {
    console.error('Trigger call error:', err);
    res.status(500).json({ success: false, message: 'Failed to trigger call.' });
  }
});

// Serve static files
app.use(express.static(path.resolve(__dirname, 'dist')));

// SPA fallback for Express 5
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
