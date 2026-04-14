
import fs from 'fs';
import path from 'path';

const localesDir = 'c:/Projects/geoHY-website/src/locales';
const files = ['en.json', 'jp.json', 'id.json'];

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const data = {};
const allKeys = new Set();

files.forEach(file => {
  const content = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
  const keys = getKeys(content);
  data[file] = keys;
  keys.forEach(k => allKeys.add(k));
});

console.log('--- Missing Keys ---');
files.forEach(file => {
  const missing = [...allKeys].filter(k => !data[file].includes(k));
  if (missing.length > 0) {
    console.log(`${file} is missing:`, missing);
  } else {
    console.log(`${file} has all keys.`);
  }
});
