import { Vector3 } from "./type";

export function crossProduct(a: Vector3, b: Vector3): Vector3 {
  return [
    a[1] * b[2] - a[2] * b[1], 
    a[2] * b[0] - a[0] * b[2], 
    a[0] * b[1] - a[1] * b[0]
  ];
}

export function normalize(a: Vector3): Vector3 {
  const n = norm(a);
  return [
    a[0] / n,
    a[1] / n,
    a[2] / n
  ];
}

export function norm(a: Vector3): number {
  return Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
}