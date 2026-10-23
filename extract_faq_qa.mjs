async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const id = 'custom_newsletter_faq_3NQika';
  const start = html.indexOf(id);
  if (start !== -1) {
    const chunk = html.substring(start, start + 15000);
    const questions = [...chunk.matchAll(/itemprop="name">([^<]+)<[\s\S]*?itemprop="text">([\s\S]*?)<\/div>/gi)];
    console.log('FAQ items count:', questions.length);
    for (const q of questions) {
      console.log('\nQ:', q[1].trim());
      console.log('A:', q[2].replace(/<[^>]+>/g, '').trim());
    }
  }
}
test().catch(console.error);
