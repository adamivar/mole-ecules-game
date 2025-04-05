import { Particle, ParticleType } from '../physics/Particle';
import { findDistanceBetweenTwoObjects} from '../physics/maths';
import { recipesUnformatted, } from './recipes';
import { convertEquation, flattenParsedEquation, normalizeEquation } from './equationParsing';
import { atomTypes } from './atomTypes';
import { calculateLeftovers, getCombinations } from '../utils/chemistryUtils';
import { moleculeTypes } from './moleculeTypes';

const allChemicalTypes: ParticleType[] = [...atomTypes, ...moleculeTypes];

export function simulateParticles(
    particles: Particle[],
    temperature: number): Particle[] {
    let updated = [...particles];

    const pairs = getCombinations(updated);
    for (const [particleA, particleB] of pairs) {
        const dist = findDistanceBetweenTwoObjects(particleA, particleB);

        if (dist <= (particleA.radius + particleB.radius) && (particleA.state !== 'solid' || particleB.state !== 'solid')) {
            const formulaMatch: string | undefined = Object.keys(recipesUnformatted).find(key => {
                const [reactantsSet] = convertEquation(key);
                const reactants = Array.from(reactantsSet);
                return reactants.some(([name]) => name === particleA.name) && reactants.some(([name]) => name === particleB.name);
            });

            if (formulaMatch) {
                const recipe = recipesUnformatted[formulaMatch];
                if (temperature >= recipe.temp) {
                    const normalized = normalizeEquation(convertEquation(formulaMatch));
                    const [reactants, products] = normalized;
                    const [r1, r2] = reactants;
                    const reordered = particleA.name === String(r2[1]) ? [r2, r1] : [r1, r2];

                    const [[...excess], yields] = calculateLeftovers(
                        Number(reordered[0][0]),
                        Number(reordered[1][0]),
                        String(reordered[0][1]),
                        String(reordered[1][1]),
                        Array.from(products).map(([name, amt]) => [amt, name]),
                        particleA.mols,
                        particleB.mols
                    );

                    const leftoverParticles = flattenParsedEquation([
                        new Map(excess.map(([amt, name]) => [String(name), Number(amt)])),
                        new Map(yields.map(([amt, name]) => [String(name), Number(amt)]))
                    ]);

                    const newParticles: Particle[] = leftoverParticles.map(([amt, name]) => {
                        const chemicalType = allChemicalTypes.find(c => c.name === name);
                        return chemicalType
                            ? new Particle((particleA.x + particleB.x) / 2, (particleA.y + particleB.y) / 2, Math.random(), amt, chemicalType, temperature)
                            : null;
                    }).filter((p): p is Particle => p !== null);


                    updated = updated.filter(d => d !== particleA && d !== particleB).concat(newParticles);
                    break;
                }
            } else if (particleA.name === particleB.name) {
                const merged = new Particle(
                    (particleA.x + particleB.x) / 2,
                    (particleA.y + particleB.y) / 2,
                    Math.random(),
                    particleA.mols + particleB.mols,
                    particleA.type,
                    temperature
                );
                merged.speedX = (particleA.speedX + particleB.speedX) / 2;
                merged.speedY = (particleA.speedY + particleB.speedY) / 2;
                updated = updated.filter(d => d !== particleA && d !== particleB).concat(merged);
                break;
            }
        }
    }

    return updated;
}
