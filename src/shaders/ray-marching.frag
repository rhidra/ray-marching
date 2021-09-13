#define MAX_STEPS 100
#define SURFACE_DIST .01
#define MAX_DIST 1000.

float getDist(vec3 p) {
  // float a = distSphere(p, vec3(3., 0., 0.), .5);
  // float pl = distPlane(p, -1.);
  // return min(a, pl);
  float x = p.x;
  p.y += 1.5;
  p.z += .5;
  p = mod(p, 3.);
  float t = mod(time*1.8 - x/20., 1.);
  float r = (pow(t,.4) * pow(1.-t,3.) * 3.4) * .1 + .1;
  // float a = sphereSDF(p, vec3(2., .5, 1.), r);
  float a = capsuleSDF(p, vec3(2., .5, 1.-r*4.), vec3(2., .5, 1.+r*4.), .1);
  return a*.9;
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
