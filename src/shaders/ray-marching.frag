#define MAX_STEPS 800
#define SURFACE_DIST .005
#define MAX_DIST 120.

vec4 rayMarching(vec3 ro, vec3 rd) {
  float d0 = 0.;
  vec4 ds = vec4(0.);

  vec3 skyColor = vec3(0.30, 0.36, 0.60)*1.7;

  for (int i = 0; i < MAX_STEPS; ++i) {
      vec3 p = ro + d0 * rd;
      ds = getDist(p);
      d0 += ds.w;
      if (ds.w < SURFACE_DIST) break;
      if (d0 > MAX_DIST) {
        return vec4(skyColor, d0);
      }
  }
  
  return vec4(ds.r, ds.g, ds.b, d0);
}
