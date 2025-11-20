import { useState } from 'react';

export default function Home(){
  const [url, setUrl] = useState('');
  const [res, setRes] = useState(null as any);
  async function submit(){
    const r = await fetch('http://localhost:4000/api/jobs/schedule', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ url }), credentials: 'include' });
    const j = await r.json();
    setRes(j);
  }
  return (
    <main style={{ padding: 20 }}>
      <h1>Scraper UI</h1>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" style={{ width: 400 }} />
      <button onClick={submit}>Schedule Scrape</button>
      <pre>{JSON.stringify(res, null, 2)}</pre>
    </main>
  );
}
