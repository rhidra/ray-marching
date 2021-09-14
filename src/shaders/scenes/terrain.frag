
vec4 getDist(vec3 p) {
  float d1 = planeSDF(p, -1.);
  float d2 = sphereSDF(p, vec3(0.), 1.);

  return d1 < d2 ? vec4(vec3(1.), d1) : vec4(.3, .4, .8, d2);
}
