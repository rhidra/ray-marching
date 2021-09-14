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

// From the Book of shaders
float random (in vec2 uv) {
    return fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// From the Book of shaders
float noise (in vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float snoise(vec2 p){
  const float K1 = 0.366025404; // (sqrt(3)-1)/2;
  const float K2 = 0.211324865; // (3-sqrt(3))/6;
	vec2  i = floor( p + (p.x+p.y)*K1 );
  vec2  a = p - i + (i.x+i.y)*K2;
  float m = step(a.y,a.x); 
  vec2  o = vec2(m,1.0-m);
  vec2  b = a - o + K2;
	vec2  c = a - 1.0 + 2.0*K2;
  vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec3  n = h*h*h*h*vec3( dot(a,vec2(random(i+0.0))), dot(b,vec2(random(i+o))), dot(c,vec2(random(i+1.))));
  return dot( n, vec3(70.0) );
}