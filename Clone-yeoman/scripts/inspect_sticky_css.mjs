import fs from 'fs';

const css = fs.readFileSync('Clone-yeoman/data/sup_style.css', 'utf8');

const atcPos = css.indexOf('.sup-atc {');
if (atcPos !== -1) {
  console.log('ATC CSS snippet:\n', css.substring(atcPos, atcPos + 800));
}
