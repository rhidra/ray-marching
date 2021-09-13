// Math functions and SDF


float smin(float a, float b, float k) {
  float h = max( k-abs(a-b), 0.0 )/k;
  return min( a, b ) - h*h*h*k*(1.0/6.0);
}

float smax(float a, float b, float k) {
  return smin(a, b, -k);
}

float smoothDifferenceSDF(float distA, float distB, float k) {
  float h = clamp(0.5 - 0.5*(distB+distA)/k, 0., 1.);
  return mix(distA, -distB, h ) + k*h*(1.-h); 
}

float maxcomp(vec3 a) {
  return max(a.x, max(a.y, a.z));
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

float rectSDF(vec3 p, vec3 r) {
  vec3 q = abs(p) - r;
  return length(max(q, 0.)) + min(maxcomp(q), 0.);
}

float rect2DSDF(vec2 p, vec2 r) {
  vec2 q = abs(p) - r;
  return length(max(q, 0.)) + min(max(q.x, q.y), 0.);
}

float crossSDF( in vec3 p ) {
  float da = rect2DSDF(p.xy,vec2(1.0));
  float db = rect2DSDF(p.yz,vec2(1.0));
  float dc = rect2DSDF(p.zx,vec2(1.0));
  return min(da,min(db,dc));
}
