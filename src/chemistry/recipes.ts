export type RawRecipe = {
  temp: number;
};

export type ParsedChemical = [number, string]; // [coefficient, name]
export type ParsedSide = Map<string, number>; // chemical => coefficient
export type ParsedEquation = [ParsedSide, ParsedSide];

export const CHEM_REGEX = /^([0-9]*)([A-Za-z0-9()]+)$/;

export const recipesUnformatted: Record<string, RawRecipe> = {
  "2H2 + O2 = 2H2O": { temp: 570 },
  "Li + H2 = LiH": { temp: 200 },
  "4Li + O2 = 2Li2O": { temp: 100 },
  "Li + H2O = LiOH": { temp: 0 },
  "Li2O + CO2 = Li2CO3": { temp: 0 },
  "2Be + O2 = 2BeO": { temp: 700 },
  "BeO + H2O = Be(OH)2": { temp: 0 },
  "4B + 3O2 = 2B2O3": { temp: 700 },
  "12C + 11O2 = 10CO2 + 2CO": { temp: 500 },
  "1O2 + 2CO = 2CO2": { temp: 500 },
  "Li + 4C = Li2C2": { temp: 1000 },
  "10Li + 2CO2 = Li2C2 + 4Li2O": { temp: 1000 },
  "Li2C2 + 2H2O = 2LiOH + C2H2": { temp: 0 },
  "2LiH + 4C = Li2C2 + C2H2": { temp: 400 },
  "2LiH + C2H2 = Li2C2 + 2H2": { temp: 0 },
  "LiH + LiOH = Li2O + H2": { temp: 300 },
  "LiH + H2O = LiOH + H2": { temp: 0 },
  "6Li + N2 = 2Li3N": { temp: 50 },
  "Li3N + 3H2O = 3LiOH + NH3": { temp: 0 },
  "2Li + 2NH3 = 2LiNH2 + H2": { temp: 400 },
  "3Be + N2 = Be3N2": { temp: 1100 },
  "Be3N2 + 6H2O = 3Be(OH)2 + 2NH3": { temp: 1100 },
  "N2 + O2 = 2NO": { temp: 2000 },
};
