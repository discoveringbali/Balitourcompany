const sharp = require('sharp');
const fs = require('fs');

async function fixFavicon() {
  try {
    // Read the original icon
    const inputPath = 'src/app/icon.png';
    
    // Add a black background
    await sharp(inputPath)
      .flatten({ background: '#1c1c1c' })
      .toFile('src/app/icon_new.png');
      
    // Replace the old icon
    fs.renameSync('src/app/icon_new.png', inputPath);
    console.log('Favicon background added successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixFavicon();
