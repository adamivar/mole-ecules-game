import { memo, useCallback } from 'react';

type TemperatureSliderProps = {
  value: number;
  min: number;
  max: number;
  onChange: (newValue: number) => void;
};

const TemperatureSlider = ({ value, min, max, onChange }: TemperatureSliderProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange]
  );

  return (
    <div className="mt-6 text-center text-white">
      <label className="block mb-2 font-medium text-lg">
        Temperature: {value}°K
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full max-w-md mx-auto accent-yellow-400"
      />
    </div>
  );
  
};

export default memo(TemperatureSlider);
