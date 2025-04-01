import {
    ParsedChemical,
    ParsedEquation,
    ParsedSide,
    CHEM_REGEX,
  } from "./recipes";
  
  const memoizedEquations = new Map<string, ParsedEquation>();
  
  export function convertStringChemical(str: string): ParsedChemical {
    const match = str.trim().match(CHEM_REGEX);
    if (!match) throw new Error(`Invalid chemical format: ${str}`);
    const coefficient = match[1] ? Number(match[1]) : 1;
    return [coefficient, match[2]];
  }
  
  export function convertEquation(equation: string): ParsedEquation {
    if (memoizedEquations.has(equation)) {
      return memoizedEquations.get(equation)!;
    }
  
    const [lhs, rhs] = equation.split("=").map((side) =>
      side.trim().split("+").map(convertStringChemical)
    );
  
    const toParsedSide = (chemicals: ParsedChemical[]): ParsedSide => {
      const map = new Map<string, number>();
      chemicals.forEach(([coeff, name]) => {
        map.set(name, (map.get(name) ?? 0) + coeff);
      });
      return map;
    };
  
    const parsed: ParsedEquation = [toParsedSide(lhs), toParsedSide(rhs)];
    memoizedEquations.set(equation, parsed);
    return parsed;
  }
  
  export function flattenParsedEquation(equation: ParsedEquation): ParsedChemical[] {
    const result: ParsedChemical[] = [];
    equation[0].forEach((coeff, chem) => result.push([coeff, chem]));
    equation[1].forEach((coeff, chem) => result.push([coeff, chem]));
    return result;
  }
  
  export function normalizeEquation(equation: ParsedEquation): ParsedEquation {
    let maxCoeff = 0;
    for (const coeff of equation[0].values()) maxCoeff = Math.max(maxCoeff, coeff);
    for (const coeff of equation[1].values()) maxCoeff = Math.max(maxCoeff, coeff);
  
    const normalize = (side: ParsedSide): ParsedSide => {
      const result = new Map<string, number>();
      side.forEach((coeff, chem) => {
        result.set(chem, coeff / maxCoeff);
      });
      return result;
    };
  
    return [normalize(equation[0]), normalize(equation[1])] as ParsedEquation;
  }
  