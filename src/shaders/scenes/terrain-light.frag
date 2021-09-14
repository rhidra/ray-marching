

vec3 lighting(vec3 p, vec3 diffCol) {
  diffCol *= fbm(p.xy * .1);

  vec3 col = getLight(p, diffCol, vec3(-4., -4., 4.), vec3(1.) * .4, vec3(1.));
  // col += getLight(p, objCol, vec3(-4., 4., 4.), vec3(1.) * .3, vec3(1.));
  // col += getLight(p, objCol, vec3(0.), vec3(1.) * .25, vec3(1.));

  return col;
}
