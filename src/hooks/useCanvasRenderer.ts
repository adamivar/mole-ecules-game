import { useEffect, useRef } from 'react';
import { simulateParticles } from '../chemistry/reactionSimulator';
import { Particle } from '../physics/Particle';
import { renderFrame } from '../rendering/renderFrame';

export function useCanvasRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  particles: Particle[],
  temperature: number,
  selectedAtomName: string
) {
  const particlesRef = useRef<Particle[]>(particles);

  // Sync dotsRef whenever dots change from outside (e.g. on click)
  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let frameCount = 0;

    const render = () => {
      frameCount++;

      const updatedParticles = renderFrame(
        ctx,
        canvas,
        particlesRef.current,
        temperature,
        selectedAtomName
      );

      // Simulate every 2nd frame for performance
      if (frameCount % 2 === 0) {
        particlesRef.current = simulateParticles(updatedParticles, temperature);
      } else {
        particlesRef.current = updatedParticles;
      }

      requestAnimationFrame(render);
    };

    render();
  }, [canvasRef, temperature, selectedAtomName]);
}
