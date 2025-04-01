import { Chemical } from '../physics/Particle';

type AtomSelectorProps = {
  atoms: Chemical[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const AtomSelector = ({ atoms, selectedIndex, onSelect }: AtomSelectorProps) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {atoms.map((atom, index) => {
          const color = `rgb(${atom.color.join(',')})`;
          const textColor = (atom.color.reduce((a, b) => a + b) / 3 < 128) ? 'text-white' : 'text-black';
          return (
            <button
              key={atom.name}
              onClick={() => onSelect(index)}
              title={atom.name}
              className={`px-4 py-1 rounded-full font-semibold transition duration-200 shadow-md hover:scale-105 ${
                selectedIndex === index ? 'ring-2 ring-yellow-400' : 'ring-1 ring-white'
              }`}
              style={{ backgroundColor: color }}
            >
              <span className={textColor}>{atom.name}</span>
            </button>
          );
        })}
      </div>
    );
  };
  
export default AtomSelector;
