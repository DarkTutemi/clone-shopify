import fs from 'fs';

const html = fs.readFileSync('ackerman_page.html', 'utf8');
const regex = /"title":"([^"]+)"[^}]*?"option1":"([^"]+)"[^}]*?"image":"([^"]+)"/g;

let m;
while ((m = regex.exec(html)) !== null) {
  console.log('Title:', m[1], 'Option1:', m[2], 'Image:', m[3]);
}
