// 🔹 1. Imports
import { Particle } from './Particle';
import { findRadiusFromVolume } from './maths';

// 🔹 2. Particle Physics Logic: Update Position, Speed, Radius, and Collision
export function updateParticle(
  particle: Particle,
  screenWidth: number,
  screenHeight: number,
  temperature: number
) {
  const multiplier = temperature > 0 ? temperature / 1000 : 0;

  // 🔸 2.1. Update Based on Particle State
  switch (particle.state) {
    case 'gas': {
      particle.speedX += (Math.random() * 2 - 1); // jitter
      particle.speedY += (Math.random() * 2 - 1);

      // Damping
      particle.speedX *= 0.98;
      particle.speedY *= 0.98;

      // Clamp speed
      const maxSpeed = 15;
      particle.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, particle.speedX));
      particle.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, particle.speedY));

      particle.x += particle.speedX;
      particle.y += particle.speedY;


      particle.radius = findRadiusFromVolume(particle.mols * 22400, 4, 10);
      break;
    }


    case 'noble':
      particle.speedX *= 0.99;
      particle.speedY *= 0.99;
      particle.x += particle.speedX * 5;
      particle.y += particle.speedY * 5;
      break;


    case 'liquid':
      particle.x += (Math.random() * 2 - 1) * multiplier + particle.speedX * 0.02;
      particle.y += (Math.random() * 2 - 1) * multiplier + particle.speedY * 0.02;
      particle.radius = findRadiusFromVolume(particle.mols * particle.type.molarVolume, 4, 10);
      break;

    case 'solid':
      particle.speedX = 0;
      particle.speedY = 0;
      particle.radius = findRadiusFromVolume(particle.mols * particle.type.molarVolume, 4, 10);
      break;

  }

  // 🔸 2.2. Screen Edge Collision Handling (except for noble gases)
  if (particle.state !== 'noble') {
    // Bounce off walls
    if (particle.x - particle.radius <= 0) {
      particle.x = particle.radius;
      particle.speedX *= -1;
    }
    if (particle.x + particle.radius >= screenWidth) {
      particle.x = screenWidth - particle.radius;
      particle.speedX *= -1;
    }
    if (particle.y - particle.radius <= 0) {
      particle.y = particle.radius;
      particle.speedY *= -1;
    }
    if (particle.y + particle.radius >= screenHeight) {
      particle.y = screenHeight - particle.radius;
      particle.speedY *= -1;
    }

    // Special case: if particle is somehow stretched across both edges
    if (particle.x - particle.radius <= 0 && particle.x + particle.radius >= screenWidth) {
      particle.x = screenWidth / 2;
    }
    if (particle.y - particle.radius <= 0 && particle.y + particle.radius >= screenHeight) {
      particle.y = screenHeight / 2;
    }
  }
}

// 🔹 3. Drawing Particles to Canvas
export function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  const [r, g, b] = p.type.color;
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
  const outlineRadius = findRadiusFromVolume(p.type.molarVolume, 4, 10);
  ctx.arc(p.x, p.y, outlineRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = (r + g + b) / 3 < 128 ? 'white' : 'black';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(p.name, p.x, p.y);
}
