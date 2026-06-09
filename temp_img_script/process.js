const Jimp = require('jimp');
const path = require('path');

async function processImage() {
  const inputPath = path.resolve('../client/src/assets/img.jpg');
  const outputPath = path.resolve('../client/src/assets/img-evil.jpg');
  
  try {
    const image = await Jimp.read(inputPath);
    image.grayscale();
    
    // We want a spooky red filter
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      
      const intensity = r; // Since it's grayscale, r=g=b
      
      // High contrast red filter
      let newR = intensity * 1.5;
      let newG = intensity * 0.2;
      let newB = intensity * 0.2;
      
      // Contrast stretch
      newR = (newR - 128) * 1.8 + 128;
      newG = (newG - 128) * 1.8 + 128;
      newB = (newB - 128) * 1.8 + 128;
      
      this.bitmap.data[idx + 0] = Math.min(255, Math.max(0, newR));
      this.bitmap.data[idx + 1] = Math.min(255, Math.max(0, newG));
      this.bitmap.data[idx + 2] = Math.min(255, Math.max(0, newB));
    });
    
    await image.writeAsync(outputPath);
    console.log("Image saved to " + outputPath);
  } catch (err) {
    console.error(err);
  }
}
processImage();
