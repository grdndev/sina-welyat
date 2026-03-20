export function maxDecimals(value: number, d: number): number {
    return Math.floor(value * (10**d)) / (10**d);
}