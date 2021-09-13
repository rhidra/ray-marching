// Math functions and SDF


float smin(float a, float b, float k) {
  float h = max( k-abs(a-b), 0.0 )/k;
  return min( a, b ) - h*h*h*k*(1.0/6.0);
}

float sphereSDF(vec3 p, vec3 origin, float radius) {
  return length(origin - p) - radius;
}

float planeSDF(vec3 p, float z) {
  return abs(p.z - z);
}

float capsuleSDF(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
  vec3 aq = h * (b - a);
  return length(pa - ba * h) - r;
}
