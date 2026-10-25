async function test() {
  const versions = ['1.50.0', '1.49.1', '1.49.0', '1.48.2', '1.48.0', '1.47.0', '1.46.0', '1.45.0', '1.51.0'];
  for (const v of versions) {
    const url = `https://playwright.azureedge.net/builds/driver/playwright-${v}-win32_x64.zip`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(v, res.status);
    } catch (e) {
      console.log(v, e.message);
    }
  }
}
test();
