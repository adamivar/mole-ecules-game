import { useState, useCallback } from 'react';
import { Particle } from '../physics/Particle';
import { atomTypes } from '../chemistry/atomTypes';


export function useSimulation() {
    const [temperature, setTemperature] = useState(20);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [id, setId] = useState(0);

    const selectedAtomType = atomTypes[selectedIndex];

    const addParticle = useCallback((x: number, y: number) => {
        const newParticle = new Particle(x, y, id, 1, selectedAtomType, temperature);

        // Update both state and rendering reference
        setParticles(prev => {
            const updated = [...prev, newParticle];
            return updated;
        });

        setId(prev => prev + 1);
    }, [id, selectedAtomType, temperature]);


    return {
        particles,
        setParticles,
        temperature,
        setTemperature,
        selectedIndex,
        setSelectedIndex,
        selectedAtomType,
        atomTypes,
        addParticle,
    };
}
