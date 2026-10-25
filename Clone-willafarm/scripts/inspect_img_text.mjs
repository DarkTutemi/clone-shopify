import fs from 'fs';
const html = fs.readFileSync('Clone-sakerplus/data/heating_lamp/landing.html', 'utf8');

const list = [
  '85f12fb8-c395-429e-11cf-7db7060bbb00',
  '58d53d73-4840-45c5-77f9-6ec84c73a700',
  'c754b610-b567-4cd5-e9a6-0e2510406d00',
  'b67464cf-c333-4fb6-f130-6fc1fd58a300',
  'a96ba8c9-1e5d-410c-5433-0fbfb65cad00',
  'c5f23b84-c0d5-474f-8b7c-7125b59d4800',
  '15495612-28a4-4952-c943-21296d1ac400',
  'b0bcf402-58d8-4280-6057-126b0c3d3600',
  '3efdf57e-eb49-400f-a389-a3118d249d00',
  'a54128fd-ca91-44c0-ffcf-99dc23a5bb00',
  'aad6e707-7620-4c89-45e8-9c633b5ec700'
];

for (const id of list) {
  const idx = html.indexOf(id);
  if (idx !== -1) {
    const snippet = html.slice(Math.max(0, idx - 400), Math.min(html.length, idx + 400))
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');
    console.log(`\n=== ID: ${id} ===\n${snippet}`);
  }
}
