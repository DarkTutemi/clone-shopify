import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

const audioRegex = /https:\/\/[^"'\s\)]+\.mp3/gi;
const audios = [...new Set(html.match(audioRegex) || [])];

console.log('Audio URLs:', audios);
