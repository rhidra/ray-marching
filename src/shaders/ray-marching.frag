#define MAX_STEPS 100
#define SURFACE_DIST .01
#define MAX_DIST 1000.

vec4 rayMarching(vec3 ro, vec3 rd) {
  float d0 = 0.;
  vec4 ds = vec4(0.);

  for (int i = 0; i < MAX_STEPS; ++i) {
      vec3 p = ro + d0 * rd;
      ds = getDist(p);
      d0 += ds.w;
      if (ds.w < SURFACE_DIST || d0 > MAX_DIST) break;
  }
  
  return vec4(ds.r, ds.g, ds.b, d0);
}
