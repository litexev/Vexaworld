export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
export function mod(n, m) {
    return ((n % m) + m) % m;
}