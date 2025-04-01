import { useEffect, useRef } from 'react';
import { simulateParticles } from '../chemistry/reactionSimulator';
import { Particle } from '../physics/Particle';
import { renderFrame } from '../rendering/renderFrame';

export function useCanvasRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  dots: Particle[],
  temperature: number,
  selectedAtomName: string
) {
  const dotsRef = useRef<Particle[]>(dots);

  // Sync dotsRef whenever dots change from outside (e.g. on click)
  useEffect(() => {
    dotsRef.current = dots;
  }, [dots]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let frameCount = 0;

    const render = () => {
      frameCount++;

      const updatedDots = renderFrame(
        ctx,
        canvas,
        dotsRef.current,
        temperature,
        selectedAtomName
      );

      // Simulate every 2nd frame for performance
      if (frameCount % 2 === 0) {
        dotsRef.current = simulateParticles(updatedDots, temperature);
      } else {
        dotsRef.current = updatedDots;
      }

      requestAnimationFrame(render);
    };

    render();
  }, [canvasRef, temperature, selectedAtomName]);
}
