import fs from 'fs';

function inspectFolder(dir) {
  if (!fs.existsSync(dir)) return { error: 'Folder does not exist' };
  const result = {};
  if (fs.existsSync(dir + '/data')) {
    result.dataFiles = fs.readdirSync(dir + '/data');
  }
  if (fs.existsSync(dir + '/theme')) {
    result.themeFiles = fs.readdirSync(dir + '/theme');
  }
  return result;
}

console.log('Thoson:', inspectFolder('Clone-thoson'));
console.log('Srefalsteam:', inspectFolder('Clone-srefalsteam'));
console.log('Yeoman:', inspectFolder('Clone-yeoman'));
