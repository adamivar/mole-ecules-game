import { findRadiusFromVolume } from './maths';

export type ParticleType = {
    name: string;
    color: [number, number, number]; // RGB
    molarVolume: number;
    state_STP: 'solid' | 'liquid' | 'gas' | 'noble';
    tempLimits?: [number, number];
    decomposition_temperature?: number;
    decomposition_products?: Record<string, number>;
};

export class Particle {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
    id: number;
    mols: number;
    type: ParticleType;
    radius: number;
    state: string;
    temperature: number;
    name: string;

    constructor(
        x: number,
        y: number,
        id: number,
        mols: number,
        type: ParticleType,
        temperature: number
    ) {
        this.x = x;
        this.y = y;
        this.speedX = (Math.random() * 10 - 5) * (temperature / 1000);
        this.speedY = (Math.random() * 10 - 5) * (temperature / 1000);

        this.id = id;
        this.mols = mols;
        this.type = type;
        this.radius = findRadiusFromVolume(mols * type.molarVolume, 4, 10);
        this.state = type.state_STP;
        this.temperature = temperature;
        this.name = type.name;
    }
}
