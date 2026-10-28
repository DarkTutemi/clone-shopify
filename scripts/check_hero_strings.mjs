import fs from 'fs';

const yeoman = fs.readFileSync('backup_phase_a_templates/sections__yeoman-sweep-funnel.liquid', 'utf8');
const yeomanHeroStart = yeoman.indexOf('<section class="wf-section wf-hero-section">');
console.log('yeomanHeroStart index:', yeomanHeroStart);

const heating = fs.readFileSync('backup_phase_a_templates/sections__heating-lamp-funnel.liquid', 'utf8');
const heatingHeroStart = heating.indexOf('<section class="wf-section wf-hero-buybox">');
console.log('heatingHeroStart index:', heatingHeroStart);

const thoson = fs.readFileSync('backup_phase_a_templates/sections__thoson-magtrack-funnel.liquid', 'utf8');
const thosonHeroStart = thoson.indexOf('<section class="wf-section wf-hero-buybox">');
console.log('thosonHeroStart index:', thosonHeroStart);
