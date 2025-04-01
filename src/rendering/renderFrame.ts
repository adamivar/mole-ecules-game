// src/rendering/renderFrame.ts
import { drawParticle, updateParticle } from '../physics/particleBehavior';
import { Particle } from '../physics/Particle';
import { celsiusToKelvinFahrenheit } from '../physics/maths';

let lastTime = performance.now();
let fps = 0;

export function renderFrame(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    dots: Particle[],
    temperature: number,
    selectedAtomName: string
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
    ctx.fillText(selectedAtomName, 20, 50);

    // Update and draw particles
    const updatedDots: Particle[] = [];
    for (const dot of dots) {
        
        // [Optional] extract temperature-to-state logic
        // Update dot state based on temp
        if (dot.chemical.tempLimits && temperature < dot.chemical.tempLimits[0]) {
            dot.state = 'solid';
        } else if (dot.chemical.tempLimits && temperature > dot.chemical.tempLimits[1]) {
            dot.state = 'gas';
        } else {
            dot.state = 'liquid';
        }

        updateParticle(dot, canvas.width, canvas.height, temperature);
        updatedDots.push(dot);
        drawParticle(ctx, dot);
    }
    ctx.fillText(`FPS: ${fps}`, 20, 70);

    return updatedDots;
    
}
