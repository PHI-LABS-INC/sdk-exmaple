import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GlobalFonts, createCanvas } from '@napi-rs/canvas';
import GIFEncoder from 'gif-encoder';
import path from 'path';
import crypto from 'crypto';

function createPseudoRandom(seed: string) {
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  let index = 0;
  return () => {
    const value = parseInt(hash.substr(index, 8), 16) / 0xffffffff;
    index = (index + 8) % (hash.length - 8);
    return value;
  };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { address = '0xa' } = req.query;
  const width = 512;
  const height = 512;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const fontPath = path.join(process.cwd(), 'public/assets/fonts', 'Roboto-Bold.ttf');
  GlobalFonts.registerFromPath(fontPath, 'CustomFont');

  const random = createPseudoRandom(address.toString());

  const encoder = new GIFEncoder(width, height);

  res.setHeader('Content-Type', 'image/gif');

  encoder.on('data', (buffer) => {
    res.write(buffer);
  });

  encoder.on('end', () => {
    res.end();
  });

  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.setQuality(10);
  encoder.writeHeader();

  const frameCount = Math.floor(random() * 5) + 5; // 5 to 10 frames

  for (let i = 0; i < frameCount; i++) {
    ctx.fillStyle = `hsl(${random() * 360}, 50%, 25%)`;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'white';
    ctx.font = `${Math.floor(random() * 30) + 40}px CustomFont`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(`Address: ${address}`, width / 2, height / 2 - 50);

    // Random shapes
    for (let j = 0; j < 5; j++) {
      ctx.strokeStyle = `hsl(${random() * 360}, 100%, 50%)`;
      ctx.lineWidth = random() * 10 + 5;
      const x = random() * width;
      const y = random() * height;
      const size = random() * 100 + 50;
      if (random() < 0.5) {
        ctx.strokeRect(x, y, size, size);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const imageData = ctx.getImageData(0, 0, width, height);
    encoder.addFrame(imageData.data);
  }

  encoder.finish();
}
