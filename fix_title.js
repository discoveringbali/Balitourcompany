const fs = require('fs');
const path = 'src/app/HomeClient.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/const titleText = camp.title\.includes\(\',\'\) \? camp.title.split\(\',\', 1\)\[0\] : camp\.title;/g, 
  "const rawTitle = camp.title || camp.originalTitle || linkedTour?.title || '';\n              const titleText = rawTitle.includes(',') ? rawTitle.split(',')[0] : rawTitle;");

content = content.replace(/const titleText = camp.title\?.includes\(\',\'\) \? camp\.title\.split\(\',\', 1\)\[0\] : camp\.title;/g, 
  "const rawTitle = camp.title || camp.originalTitle || linkedTour?.title || '';\n              const titleText = rawTitle.includes(',') ? rawTitle.split(',')[0] : rawTitle;");

// I'll just use sed or string replace
