// src/rendering/renderFrame.ts
import { drawParticle, updateParticle } from '../physics/particleBehavior';
import { Particle } from '../physics/Particle';
import { celsiusToKelvinFahrenheit } from '../physics/maths';

let lastTime = performance.now();
let fps = 0;

export function renderFrame(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    particles: Particle[],
    temperature: number,
    selectedAtomType: string
): Particle[] {
    const now = performance.now();
    fps = Math.round(1000 / (now - lastTime));
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background color based on temp
    ctx.fillStyle =
        temperature < 0
            ? `rgb(0, 0, ${Math.abs(temperature / 3)})`
            : `rgb(${temperature / 32}, ${temperature / 200}, 0)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Display temperature info
    const { kelvin, fahrenheit } = celsiusToKelvinFahrenheit(temperature);
    ctx.fillStyle = '#fff';
    ctx.font = '16px sans-serif';
    ctx.fillText(`${Math.round(kelvin)} °K | ${Math.round(temperature)} °C | ${Math.round(fahrenheit)} °F`, 20, 30);
    ctx.fillText(selectedAtomType, 20, 50);

    // Update and draw particles
    const updateParticles: Particle[] = [];
    for (const particle of particles) {
        
        // [Optional] extract temperature-to-state logic
        // Update dot state based on temp
        if (particle.type.tempLimits && temperature < particle.type.tempLimits[0]) {
            particle.state = 'solid';
        } else if (particle.type.tempLimits && temperature > particle.type.tempLimits[1]) {
            particle.state = 'gas';
        } else {
            particle.state = 'liquid';
        }

        updateParticle(particle, canvas.width, canvas.height, temperature);
        updateParticles.push(particle);
        drawParticle(ctx, particle);
    }
    ctx.fillText(`FPS: ${fps}`, 20, 70);

    return updateParticles;
    
}
