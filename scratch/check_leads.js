async function checkLeads() {
  try {
    const res = await fetch('http://localhost:3001/api/leads');
    const data = await res.json();
    console.log('=== CURRENT LEADS IN NEON POSTGRESQL DATABASE ===');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error querying API:', err);
  }
}

checkLeads();
