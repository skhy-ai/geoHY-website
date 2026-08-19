const fs = require('fs');
const target = 'c:/Projects/geoHY-website/docs/outreach_email_template.md';
let content = fs.readFileSync(target, 'utf8');

const sig = "**Babu Priyavrat** — Co-Founder & Commercial Lead\n**Alan Filipov** — Co-Founder & Technical Lead";

content = content.replace(/^\[Your Full Name\]\r?\nFounder & CEO, GeoHY/gm, sig);
content = content.replace(/^\[Your Full Name\]\r?\nGeoHY \| \[Email\]/gm, sig + "\nGeoHY | [Email]");

fs.writeFileSync(target, content, 'utf8');
console.log('Replaced successfully');
