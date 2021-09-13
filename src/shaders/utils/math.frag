// Math utility functions 

#define DEG2RAD .0174528
#define RAD2DEG 57.29747

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

vec3 rotateX(vec3 v, float a) {
  mat3 R = mat3(1,      0,       0,
                0, cos(a), -sin(a),
                0, sin(a), cos(a));
  
  return R * v;
}

vec3 rotateY(vec3 v, float a) {
  mat3 R = mat3(cos(a), 0,  sin(a),
                      0, 1,      0,
                -sin(a), 0, cos(a));
  
  return R * v;
}

vec3 rotateZ(vec3 v, float a) {
  mat3 R = mat3(cos(a), -sin(a), 0,
                sin(a), cos(a), 0,
                0, 0, 1);
  
  return R * v;
}