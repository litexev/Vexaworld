export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
export function mod(n, m) {
    return ((n % m) + m) % m;
}
export function rndInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }