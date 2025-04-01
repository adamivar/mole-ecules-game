import GameCanvas from './components/SimulationCanvas';


function App() {
  return (
    
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white font-sans">
      <div className="max-w-screen-xl mx-auto p-4">
        <h1 className="text-center text-5xl font-extrabold tracking-tight mb-6">
          Mole-ecules
        </h1>
        <GameCanvas />
      </div>
    </div>
  );
}




export default App;
