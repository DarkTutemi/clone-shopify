async function checkSourceDescriptions() {
  const handles = [
    'bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort',
    'bronoir%E2%84%A2-limited-barefoot-shoes',
    'bronoir%E2%84%A2-force-barefoot-shoes',
    'bronoir%E2%84%A2-vista-barefoot-shoes',
    'hikers',
    'bronoir%E2%84%A2-flex-barefoot-shoes-1-1-free',
    'bronoir%E2%84%A2-runner-pro-barefoot-shoes',
    'bronoir%E2%84%A2-military-barefoot-shoes'
  ];

  for (const h of handles) {
    const res = await fetch(`https://trybronoir.com/products/${h}.js`);
    if (!res.ok) {
      console.log(`Failed: ${h}`);
      continue;
    }
    const data = await res.json();
    console.log(`\n================ ${data.title} (${data.handle}) ================`);
    console.log(`Description length: ${data.description.length}`);
    // Extract first 2 headings or key phrases
    const headings = [...data.description.matchAll(/<h[23][^>]*>(.*?)<\/h[23]>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    console.log(`Headings in description:`, headings);
    // Extract image urls inside description
    const images = [...data.description.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
    console.log(`Images inside description (${images.length}):`, images.slice(0, 3));
  }
}

checkSourceDescriptions();
