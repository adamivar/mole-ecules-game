// 🔹 1. Import Dependencies
import { useRef, useState, useEffect } from 'react';
import AtomSelector from './AtomSelector';
import TemperatureSlider from './TemperatureSlider';
import { useSimulation } from '../hooks/useSimulation';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
// 🔹 2. Component Definition
const SimulationCanvas = () => {

  // 🔸 2.1. Refs and State Hooks
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    particles,
    temperature, setTemperature,
    selectedIndex, setSelectedIndex,
    selectedAtomType, atomTypes,
    addParticle
  } = useSimulation();

  const setIsMouseDown = useState(false)[1];

  // 🔸 2.2. Canvas Renderer Hook
  useCanvasRenderer(
    canvasRef as React.RefObject<HTMLCanvasElement>,
    particles,
    temperature,
    selectedAtomType.name
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
      addParticle(x, y);
    };
    const handleMouseUp = () => setIsMouseDown(false);

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [addParticle, setIsMouseDown]);

  // 🔸 2.4. Render UI
  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl p-4">
      <AtomSelector
        atomTypes={atomTypes}
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
        min={-273}
        max={4000}
        onChange={setTemperature}
      />
    </div>
  );
};

// 🔹 3. Export Component
export default SimulationCanvas;
