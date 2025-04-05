/**
 * Calculates the radius based on volume, scaling factor, and minimum radius.
 * @param volume - The volume to derive the radius from.
 * @param radiusScale - The scaling factor for the radius.
 * @param radiusMin - The minimum radius value.
 * @returns The calculated radius.
 */
export function findRadiusFromVolume(volume: number, invRadiusScale: number, radiusMin: number): number {
    const radius = Math.sqrt(volume / Math.PI);
    return (radius * invRadiusScale) + radiusMin;
}


/**
 * Calculates the Euclidean distance between two points.
 * @param x1 - X-coordinate of the first point.
 * @param y1 - Y-coordinate of the first point.
 * @param x2 - X-coordinate of the second point.
 * @param y2 - Y-coordinate of the second point.
 * @returns The distance between the two points.
 */
export function findDistanceBetweenTwoPoints(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

//find distance between 2 objects
export function findDistanceBetweenTwoObjects(obj1: { x: number, y: number }, obj2: { x: number, y: number }): number {
    return findDistanceBetweenTwoPoints(obj1.x, obj1.y, obj2.x, obj2.y);
}



/**
 * Finds the colliding point between two circles.
 * @param x1 - X-coordinate of the first circle's center.
 * @param y1 - Y-coordinate of the first circle's center.
 * @param r1 - Radius of the first circle.
 * @param x2 - X-coordinate of the second circle's center.
 * @param y2 - Y-coordinate of the second circle's center.
 * @param r2 - Radius of the second circle.
 * @returns The coordinates of the colliding point as an object with x and y properties.
 */
export function findCollidingPointBetweenTwoCircles(
    x1: number, y1: number, r1: number,
    x2: number, y2: number, r2: number
): { x: number, y: number } {
    const d = r1 + r2;
    if (d === 0) {
        throw new Error('Sum of radii cannot be zero.');
    }
    const midX = (r1 * x2 + r2 * x1) / d;
    const midY = (r1 * y2 + r2 * y1) / d;
    return { x: midX, y: midY };
}


/**
 * Converts a temperature from Celsius to Kelvin and Fahrenheit.
 * @param celsius - The temperature in Celsius.
 * @returns An object containing the temperature in Kelvin and Fahrenheit.
 */
export function celsiusToKelvinFahrenheit(celsius: number): { kelvin: number, fahrenheit: number } {
    const kelvin = celsius + 273.15;
    const fahrenheit = (celsius * 9 / 5) + 32;
    return { kelvin, fahrenheit };
}
