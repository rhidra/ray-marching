vec3 lighting(vec3 p, vec3 diffCol) {
  vec3 objCol = diffCol;//vec3(52., 52., 173.) / 220.;

  vec3 col = getLight(p, objCol, vec3(-15., -15., 10.), vec3(1., .9, .9) * .6, vec3(1.));
  // col += getLight(p, objCol, vec3(-4., -4., 4.), vec3(1.) * .5, vec3(1.));
  // col += getLight(p, objCol, vec3(0.), vec3(1.) * .25, vec3(1.));

  return col;
}
