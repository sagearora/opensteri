export function generateRandomPin(): number {
    const min: number = 1000;
    const max: number = 9999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
