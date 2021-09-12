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
    
    return vec3.scale(1/n, a);
  }

  static norm(a: Vector3): number {
    return Math.sqrt(vec3.dot(a, a));
  }

  static add(a: Vector3, b: Vector3): Vector3 {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  static scale(s: number, a: Vector3): Vector3 {
    return [a[0] * s, a[1] * s, a[2] * s];
  }

  static dot(a: Vector3, b: Vector3): number {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  }
}