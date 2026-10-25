import { execSync } from 'child_process';
import path from 'path';

const artifactsDir = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3';

const imgs = [
  { name: 'orig_slide_2.png', url: 'https://cdn.myshopage.com/58d53d73-4840-45c5-77f9-6ec84c73a700/w400.png' },
  { name: 'orig_slide_3.png', url: 'https://cdn.myshopage.com/c754b610-b567-4cd5-e9a6-0e2510406d00/w400.png' },
  { name: 'orig_slide_4.png', url: 'https://cdn.myshopage.com/b67464cf-c333-4fb6-f130-6fc1fd58a300/w400.png' },
  { name: 'orig_feat_1.jpg', url: 'https://cdn.myshopage.com/a96ba8c9-1e5d-410c-5433-0fbfb65cad00/w600.jpg' },
  { name: 'orig_feat_2.jpg', url: 'https://cdn.myshopage.com/c5f23b84-c0d5-474f-8b7c-7125b59d4800/w600.jpg' },
  { name: 'orig_feat_3.jpg', url: 'https://cdn.myshopage.com/15495612-28a4-4952-c943-21296d1ac400/w600.jpg' },
  { name: 'orig_feat_4.jpg', url: 'https://cdn.myshopage.com/b0bcf402-58d8-4280-6057-126b0c3d3600/w600.jpg' },
  { name: 'orig_rev_1.jpg', url: 'https://cdn.myshopage.com/3efdf57e-eb49-400f-a389-a3118d249d00/w600.jpg' },
  { name: 'orig_rev_2.jpg', url: 'https://cdn.myshopage.com/a54128fd-ca91-44c0-ffcf-99dc23a5bb00/w600.jpg' },
  { name: 'orig_rev_3.jpg', url: 'https://cdn.myshopage.com/aad6e707-7620-4c89-45e8-9c633b5ec700/w600.jpg' },
  { name: 'orig_split_compare.jpg', url: 'https://cdn.myshopage.com/8dfe030d-f1ec-4a8a-02a4-753863454400/w1000.jpg' }
];

for (const item of imgs) {
  const dest = path.join(artifactsDir, item.name);
  try {
    execSync(`curl.exe -s -H "Referer: https://tryzavelyn.com/" "${item.url}" -o "${dest}"`);
    console.log(`Downloaded ${item.name}`);
  } catch (err) {
    console.error(`Failed ${item.name}:`, err.message);
  }
}
