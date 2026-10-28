import fs from 'fs';

const yeoman = fs.readFileSync('backup_phase_a_templates/sections__yeoman-sweep-funnel.liquid', 'utf8');
console.log('yeoman sticky bar match:', yeoman.match(/<div[^>]*sticky[^>]*>/i)?.[0]);

const heating = fs.readFileSync('backup_phase_a_templates/sections__heating-lamp-funnel.liquid', 'utf8');
console.log('heating sticky bar match:', heating.match(/<div[^>]*sticky[^>]*>/i)?.[0]);

const thoson = fs.readFileSync('backup_phase_a_templates/sections__thoson-magtrack-funnel.liquid', 'utf8');
console.log('thoson sticky bar match:', thoson.match(/<div[^>]*sticky[^>]*>/i)?.[0]);
