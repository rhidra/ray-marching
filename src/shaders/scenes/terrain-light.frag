

vec3 lighting(vec3 p, vec3 diffCol) {
  vec3 normal = getNormalTerrain(p);
  float t = dot(normal, vec3(0., 0., 1.));
  diffCol = mix(vec3(184, 167, 154)/255., vec3(61, 156, 73)/255., pow(t, .8));

  vec3 col = getLight(p, diffCol, vec3(-4., -4., 100.), vec3(1.) * .5, vec3(1.));

  return col;
}
