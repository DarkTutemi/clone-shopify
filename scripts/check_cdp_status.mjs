async function checkCdp() {
  try {
    const res = await fetch('http://localhost:9222/json');
    const tabs = await res.json();
    console.log(`CDP available! Found ${tabs.length} tabs:`);
    for (const t of tabs) {
      console.log(`- [${t.type}] ${t.title} (${t.url})`);
    }
  } catch (err) {
    console.log('CDP not responding:', err.message);
  }
}

checkCdp();
