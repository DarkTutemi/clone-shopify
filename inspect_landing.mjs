async function inspectLandingPage() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('saker'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  ws.addEventListener('open', async () => {
    console.log('Navigating to landing page...');
    await send('Page.navigate', { url: 'https://m.sakerplus.com/funnel/landing-saker-cordless-turbo-leaf-blower-51-1' });
    await new Promise(r => setTimeout(r, 6000));

    const htmlRes = await send('Runtime.evaluate', { expression: 'document.documentElement.outerHTML' });
    const titleRes = await send('Runtime.evaluate', { expression: 'document.title' });
    console.log('Landing Title:', titleRes.result.value);
    console.log('Landing HTML Length:', htmlRes.result.value.length);

    import('fs').then(fs => {
      fs.writeFileSync('saker_leaf_blower_landing.html', htmlRes.result.value);
      console.log('Saved to saker_leaf_blower_landing.html');
    });

    ws.close();
  });
}
inspectLandingPage().catch(console.error);
