#ifdef GL_ES
precision mediump float;
#endif

#define MAX_STEPS 100
#define SURFACE_DIST .01
#define MAX_DIST 1000.

uniform vec2 resolution;
uniform float time;

uniform vec3 cameraPosition;
uniform vec3 cameraDirection;

float smin(float a, float b, float k) {
  float h = max( k-abs(a-b), 0.0 )/k;
  return min( a, b ) - h*h*h*k*(1.0/6.0);
}

float distSphere(vec3 p, vec3 origin, float radius) {
  return length(origin - p) - radius;
}

float distPlane(vec3 p, float z) {
  return abs(p.z - z);
}

float distCapsule(vec3 p, vec3 a, vec3 b, float r) {
  float h = clamp(dot(p-a, b-a) / dot(b-a, b-a), 0., 1.);
  vec3 aq = h * (b - a);
  return length(p - a - h * (b - a)) - r;
}

float getDist(vec3 p) {
  // float a = distSphere(sqrt(p*p + .1*cos(u_time)*cos(u_time)), vec3(3., .5, 1.), .5);
  p.y += .5;
  p.z += .5;
  p = mod(p, 3.);
  float a = distSphere(p, vec3(2., .5, 1.), .2);
  return a;
}

float rayMarching(vec3 ro, vec3 rd) {
  float d0 = 0.;
  for (int i = 0; i < MAX_STEPS; ++i) {
      vec3 p = ro + d0 * rd;
      float dS = getDist(p);
      d0 += dS;
      if (dS < SURFACE_DIST || d0 > MAX_DIST) break;
  }
  
  return d0;
}

vec3 getNormal(vec3 p) {
  float d = getDist(p);
  vec2 e = vec2(.001, 0.);
  
  vec3 n = d - vec3(getDist(p-e.xyy), getDist(p-e.yxy), getDist(p-e.yyx));
  return normalize(n);
}

float lighting(vec3 p, vec3 light) {
  vec3 lightVec = normalize(light - p);
  vec3 normal = getNormal(p);
  
  float d = rayMarching(p + lightVec*SURFACE_DIST*2., lightVec);
  float shadows = 1.;// + 0. * min(1., .1 + step(length(p - light), d));
  return clamp(dot(lightVec, normal) * exp(-d*.001) * shadows, 0., 1.);
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= .5;
  uv.x *= resolution.x/resolution.y;
  
  // vec3 ro = vec3(-1., 0., 0.);
  // vec3 rd = vec3(0., uv.x, uv.y) - ro;
  // Center of screen = cameraPosition
  // ro = Eye
  vec3 ro = cameraPosition - cameraDirection * 1.;
  vec3 e1 = normalize(cross(cameraDirection, vec3(0., 0., 1.)));
  vec3 e2 = cross(cameraDirection, e1);
  vec3 rd = uv.x * e1 - uv.y * e2 - ro + cameraPosition;
  
  // Initial raymarching
  float d = rayMarching(ro, rd);
  vec3 p = ro + rd * d;
  
  // Lighting + shadow
  float l = lighting(p, vec3(40.*abs(cos(time*.5)), 0., 1.));

  // Fog
  l *= exp(-d*.04);
  
  vec3 col = vec3(l);
	gl_FragColor = vec4(col, 1.);
}