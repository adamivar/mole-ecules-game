import { Chemical } from '../physics/Particle';
export const sampleChemicals: Chemical[] = [
  {
    name: "H2",
    molarVolume: 0.086,
    color: [200, 200, 200],
    tempLimits: [-259, -253],
    state_STP: "gas",
  },
  {
    name: "He",
    molarVolume: 31.25,
    color: [217, 255, 255],
    tempLimits: [-100000, -268],
    state_STP: "noble",
  },
  {
    name: "Li",
    molarVolume: 13.02,
    color: [204, 128, 255],
    tempLimits: [180, 1342],
    state_STP: "solid",
  },
  {
    name: "Be",
    molarVolume: 4.85,
    color: [194, 255, 0],
    tempLimits: [1287, 2471],
    state_STP: "solid",
  },
  {
    name: "B",
    molarVolume: 4.39,
    color: [255, 181, 181],
    tempLimits: [2075, 3727],
    state_STP: "solid",
  },
  {
    name: "C",
    molarVolume: 5.29,
    color: [144, 144, 144],
    tempLimits: [3642, 3642],
    state_STP: "solid",
  },
  {
    name: "N2",
    molarVolume: 34,
    color: [40, 80, 248],
    tempLimits: [-210, -196],
    state_STP: "gas",
  },
  {
    name: "O2",
    molarVolume: 11,
    color: [200, 0, 0],
    tempLimits: [-218, -183],
    state_STP: "gas",
  },
];
