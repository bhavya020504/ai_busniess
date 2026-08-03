async function test() {
  const res = await fetch('http://localhost:3001/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyName: 'Acme AI Enterprise',
      contactPerson: 'Sarah Jenkins',
      businessEmail: 'sarah@acmeai.com',
      phoneNumber: '+1 555-019-2834',
      industry: 'Healthcare',
    }),
  });

  const json = await res.json();
  console.log('Insert Result:', json);

  const getRes = await fetch('http://localhost:3001/api/leads');
  const getJson = await getRes.json();
  console.log('All Stored Leads in Neon DB:', getJson);
}

test();
