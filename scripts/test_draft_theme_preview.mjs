async function testDraftPreview() {
  const url = 'https://tryzavelyn.com/?preview_theme_id=187597717689';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  console.log('Preview HTTP Status:', res.status);
  const html = await res.text();
  console.log('HTML Length:', html.length);

  // Check preview bar or theme name
  const themeMatch = html.match(/theme_name["']?:["']([^"']+)["']/i) || html.match(/theme:\s*\{[^}]*name:\s*["']([^"']+)["']/i);
  console.log('Theme signature match:', themeMatch ? themeMatch[1] : 'Not explicitly found');

  const hasZavelynElixir = html.includes('zavelyn-elixir') || html.includes('elixir');
  console.log('Includes Elixir styles/sections:', hasZavelynElixir);
}

testDraftPreview().catch(console.error);
