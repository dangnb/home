const fs = require('fs');

async function scrape() {
  const res = await fetch('https://duthuyensonghan.vn/');
  const text = await res.text();
  fs.writeFileSync('original.html', text);
  
  // Extract all image URLs
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  const images = [];
  while ((match = imgRegex.exec(text)) !== null) {
    images.push(match[1]);
  }
  
  // Extract CSS variables or primary colors from inline styles if any
  fs.writeFileSync('images.json', JSON.stringify([...new Set(images)], null, 2));
  console.log('Done parsing HTML.');
}

scrape();
