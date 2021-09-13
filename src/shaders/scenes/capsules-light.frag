
vec3 lighting(vec3 p, vec3 diffCol) {
  vec3 objCol = vec3(52., 52., 173.) / 220.;

  vec3 col = getLight(p, objCol, vec3(-4., -4., 0.), vec3(1.) * .2, vec3(1.));
  col += getLight(p, objCol, vec3(-4., -4., 4.), vec3(1.) * .5, vec3(1.));
  col += getLight(p, objCol, vec3(0.), vec3(1.) * .25, vec3(1.));

  return col;
}