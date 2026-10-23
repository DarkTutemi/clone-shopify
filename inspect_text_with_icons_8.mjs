async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const id = 'template--27860728578148__text_with_icons_8JtTK7';
  const start = html.indexOf(id);
  if (start !== -1) {
    const chunk = html.substring(start, start + 8000);
    console.log(chunk.substring(0, 3500));
  }
}
test().catch(console.error);
