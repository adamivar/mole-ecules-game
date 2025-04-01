// 🔹 1. Imports
import { Particle } from '../physics/Particle';

// 🔹 2. Chemical Reaction Calculations

// 🔸 2.1. Limiting Reagent & Product Yield Calculator
export const calculateLeftovers = (
  r1c: number,              // Coefficient of Reactant 1
  r2c: number,              // Coefficient of Reactant 2
  r1name: string,           // Name of Reactant 1
  r2name: string,           // Name of Reactant 2
  products: [number, string][], // Product coefficients and names
  mols1: number,            // Moles of Reactant 1
  mols2: number             // Moles of Reactant 2
): [[number, string][], [number, string][]] => {
  const ratioCoeff = r1c / r2c;
  const ratioMols = mols1 / (mols2 || 1e-14); // Avoid divide-by-zero

  let molsLimiting = 0;
  let limitingCoeff = 0;
  let excess1 = 0;
  let excess2 = 0;

  // 🔸 Determine limiting reagent and calculate excess
  if (ratioMols < ratioCoeff) {
    molsLimiting = mols1;
    limitingCoeff = r1c;
    excess2 = Math.abs(mols2 - (mols1 / limitingCoeff));
  } else if (ratioMols > ratioCoeff) {
    molsLimiting = mols2;
    limitingCoeff = r2c;
    excess1 = Math.abs(mols1 - (mols2 / limitingCoeff));
  } else {
    molsLimiting = mols1;
    limitingCoeff = r1c;
  }

  // 🔸 Calculate products based on limiting reagent
  const yieldList: [number, string][] = products.map(([coef, name]) => [
    molsLimiting * (coef / limitingCoeff), name
  ]);

  // 🔸 Return excess reactants
  const excess: [number, string][] = [];
  if (excess1 > 0) excess.push([excess1, r1name]);
  if (excess2 > 0) excess.push([excess2, r2name]);

  return [excess, yieldList];
};

// 🔹 3. Particle Combination Utility

// 🔸 3.1. Get All Unique Pairs of Particles
export const getCombinations = (arr: Particle[]) => {
  const combs: [Particle, Particle][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      combs.push([arr[i], arr[j]]);
    }
  }
  return combs;
};
