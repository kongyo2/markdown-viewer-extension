const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const svgPath = path.join(__dirname, 'public', 'icons', 'icon.svg');
const outputDir = path.join(__dirname, 'public', 'icons');

const sizes = [16, 32, 48, 128];

const svgContent = fs.readFileSync(svgPath, 'utf-8');

sizes.forEach(size => {
  const scaledSvg = svgContent
    .replace(/width="128"/, `width="${size}"`)
    .replace(/height="128"/, `height="${size}"`)
    .replace(/font-size="48"/, `font-size="${Math.floor(size * 48 / 128)}"`)
    .replace(/y="75"/, `y="${Math.floor(size * 75 / 128)}"`);

  const resvg = new Resvg(scaledSvg, {
    fitTo: {
      mode: 'width',
      value: size,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const outputPath = path.join(outputDir, `icon${size}.png`);
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`Generated ${outputPath}`);
});

console.log('All icons generated successfully!');
