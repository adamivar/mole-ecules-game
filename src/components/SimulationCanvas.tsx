// 🔹 1. Import Dependencies
import { useRef, useState, useEffect } from 'react';
import AtomSelector from './AtomSelector';
import TemperatureSlider from './TemperatureSlider';
import { useSimulation } from '../hooks/useSimulation';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';

// 🔹 2. Component Definition
const GameCanvas = () => {

  // 🔸 2.1. Refs and State Hooks
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    dots,
    temperature, setTemperature,
    selectedIndex, setSelectedIndex,
    selectedAtom, atomClasses,
    addDot
  } = useSimulation();
  const setIsMouseDown = useState(false)[1];

  // 🔸 2.2. Canvas Renderer Hook
  useCanvasRenderer(
    canvasRef as React.RefObject<HTMLCanvasElement>,
    dots,
    temperature,
    selectedAtom.name
  );

  // 🔸 2.3. Mouse Event Handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsMouseDown(true);
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addDot(x, y);
    };
    const handleMouseUp = () => setIsMouseDown(false);

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [addDot, setIsMouseDown]);

  // 🔸 2.4. Render UI
  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl p-4">
      <AtomSelector
        atoms={atomClasses}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className="w-full border border-white rounded-lg"
      />
      <TemperatureSlider
        value={temperature}
        min={-300}
        max={10000}
        onChange={setTemperature}
      />
    </div>
  );
};

// 🔹 3. Export Component
export default GameCanvas;
