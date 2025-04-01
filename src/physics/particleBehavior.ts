// 🔹 1. Imports
import { Particle } from './Particle';
import { findRadiusFromVolume } from './maths';

// 🔹 2. Particle Physics Logic: Update Position, Speed, Radius, and Collision
export function updateParticle(
  p: Particle,
  screenWidth: number,
  screenHeight: number,
  temperature: number
) {
  const multiplier = temperature > 0 ? temperature / 1000 : 0;

  // 🔸 2.1. Update Based on Particle State
  switch (p.state) {
    case 'gas': {
      p.speedX += (Math.random() * 2 - 1); // jitter
      p.speedY += (Math.random() * 2 - 1);

      // Damping
      p.speedX *= 0.98;
      p.speedY *= 0.98;

      // Clamp speed
      const maxSpeed = 15;
      p.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, p.speedX));
      p.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, p.speedY));

      p.x += p.speedX;
      p.y += p.speedY;


      p.radius = findRadiusFromVolume(p.mols * 22400, 4, 10);
      break;
    }


    case 'noble':
      p.speedX *= 0.99;
      p.speedY *= 0.99;
      p.x += p.speedX * 5;
      p.y += p.speedY * 5;
      break;


    case 'liquid':
      p.x += (Math.random() * 2 - 1) * multiplier + p.speedX * 0.02;
      p.y += (Math.random() * 2 - 1) * multiplier + p.speedY * 0.02;
      p.radius = findRadiusFromVolume(p.mols * p.chemical.molarVolume, 4, 10);
      break;

    case 'solid':
      p.speedX = 0;
      p.speedY = 0;
      p.radius = findRadiusFromVolume(p.mols * p.chemical.molarVolume, 4, 10);
      break;

  }

  // 🔸 2.2. Screen Edge Collision Handling (except for noble gases)
  if (p.state !== 'noble') {
    // Bounce off walls
    if (p.x - p.radius <= 0) {
      p.x = p.radius;
      p.speedX *= -1;
    }
    if (p.x + p.radius >= screenWidth) {
      p.x = screenWidth - p.radius;
      p.speedX *= -1;
    }
    if (p.y - p.radius <= 0) {
      p.y = p.radius;
      p.speedY *= -1;
    }
    if (p.y + p.radius >= screenHeight) {
      p.y = screenHeight - p.radius;
      p.speedY *= -1;
    }

    // Special case: if particle is somehow stretched across both edges
    if (p.x - p.radius <= 0 && p.x + p.radius >= screenWidth) {
      p.x = screenWidth / 2;
    }
    if (p.y - p.radius <= 0 && p.y + p.radius >= screenHeight) {
      p.y = screenHeight / 2;
    }
  }
}

// 🔹 3. Drawing Particles to Canvas
export function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  const [r, g, b] = p.chemical.color;
  const drawColor = `rgb(${r}, ${g}, ${b})`;
  const darkColor = `rgb(${r / 2}, ${g / 2}, ${b / 2})`;

  ctx.beginPath();

  // 🔸 3.1. Drawing Based on State
  if (p.state === 'gas' || p.state === 'noble') {
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 2;
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.state === 'liquid') {
    ctx.fillStyle = drawColor;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = drawColor;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius + 2, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.state === 'solid') {
    ctx.fillStyle = drawColor;
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 🔸 3.2. Outline and Label
  ctx.strokeStyle = darkColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const outlineRadius = findRadiusFromVolume(p.chemical.molarVolume, 4, 10);
  ctx.arc(p.x, p.y, outlineRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = (r + g + b) / 3 < 128 ? 'white' : 'black';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(p.name, p.x, p.y);
}
