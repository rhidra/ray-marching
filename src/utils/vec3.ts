import { Vector3 } from "./type";

export class vec3 {
  static cross(a: Vector3, b: Vector3): Vector3 {
    return [
      a[1] * b[2] - a[2] * b[1], 
      a[2] * b[0] - a[0] * b[2], 
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  static normalize(a: Vector3): Vector3 {
    const n = vec3.norm(a);

    if (n === 0) {
      return [0, 0, 0];
    }
    
    return [
      a[0] / n,
      a[1] / n,
      a[2] / n
    ];
  }

  static norm(a: Vector3): number {
    return Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
  }
}