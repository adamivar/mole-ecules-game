import { useState, useCallback } from 'react';
import { Particle } from '../physics/Particle';
import { sampleChemicals } from '../chemistry/atoms';


export function useSimulation() {
    const [temperature, setTemperature] = useState(20);
    const [dots, setDots] = useState<Particle[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [id, setId] = useState(0);

    const atomClasses = sampleChemicals;
    const selectedAtom = atomClasses[selectedIndex];

    const addDot = useCallback((x: number, y: number) => {
        const newDot = new Particle(x, y, id, 1, selectedAtom, temperature);

        // Update both state and rendering reference
        setDots(prev => {
            const updated = [...prev, newDot];
            return updated;
        });

        setId(prev => prev + 1);
    }, [id, selectedAtom, temperature]);


    return {
        dots,
        setDots,
        temperature,
        setTemperature,
        selectedIndex,
        setSelectedIndex,
        selectedAtom,
        atomClasses,
        addDot,
    };
}
