import { Particle, Chemical } from '../physics/Particle';
import { findDistanceBetweenTwoPoints } from '../physics/maths';
import { recipesUnformatted, } from './recipes';
import { convertEquation, flattenParsedEquation, normalizeEquation } from './equationParsing';
import { sampleChemicals } from './atoms';
import { calculateLeftovers, getCombinations } from '../utils/chemistryUtils';
import { sampleMolecules } from './molecules';

const allChemicals: Chemical[] = [...sampleChemicals, ...sampleMolecules];

export function simulateParticles(
    particles: Particle[],
    temperature: number): Particle[] {
    let updated = [...particles];

    const pairs = getCombinations(updated);
    for (const [a, b] of pairs) {
        const dist = findDistanceBetweenTwoPoints(a.x, a.y, b.x, b.y);

        if (dist <= (a.radius + b.radius) && (a.state !== 'solid' || b.state !== 'solid')) {
            const formulaMatch: string | undefined = Object.keys(recipesUnformatted).find(key => {
                const [reactantsSet] = convertEquation(key);
                const reactants = Array.from(reactantsSet);
                return reactants.some(([name]) => name === a.name) && reactants.some(([name]) => name === b.name);
            });

            if (formulaMatch) {
                const recipe = recipesUnformatted[formulaMatch];
                if (temperature >= recipe.temp) {
                    const normalized = normalizeEquation(convertEquation(formulaMatch));
                    const [reactants, products] = normalized;
                    const [r1, r2] = reactants;
                    const reordered = a.name === String(r2[1]) ? [r2, r1] : [r1, r2];

                    const [[...excess], yields] = calculateLeftovers(
                        Number(reordered[0][0]),
                        Number(reordered[1][0]),
                        String(reordered[0][1]),
                        String(reordered[1][1]),
                        Array.from(products).map(([name, amt]) => [amt, name]),
                        a.mols,
                        b.mols
                    );

                    const leftovers = flattenParsedEquation([
                        new Map(excess.map(([amt, name]) => [String(name), Number(amt)])),
                        new Map(yields.map(([amt, name]) => [String(name), Number(amt)]))
                    ]);

                    const newParticles: Particle[] = leftovers.map(([amt, name]) => {
                        const chem = allChemicals.find(c => c.name === name);
                        return chem
                            ? new Particle((a.x + b.x) / 2, (a.y + b.y) / 2, Math.random(), amt, chem, temperature)
                            : null;
                    }).filter((p): p is Particle => p !== null);


                    updated = updated.filter(d => d !== a && d !== b).concat(newParticles);
                    break;
                }
            } else if (a.name === b.name) {
                const merged = new Particle(
                    (a.x + b.x) / 2,
                    (a.y + b.y) / 2,
                    Math.random(),
                    a.mols + b.mols,
                    a.chemical,
                    temperature
                );
                merged.speedX = (a.speedX + b.speedX) / 2;
                merged.speedY = (a.speedY + b.speedY) / 2;
                updated = updated.filter(d => d !== a && d !== b).concat(merged);
                break;
            }
        }
    }

    return updated;
}
