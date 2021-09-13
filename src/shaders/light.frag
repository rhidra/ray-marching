vec3 getNormal(vec3 p) {
  float d = getDist(p);
  vec2 e = vec2(.001, 0.);
  
  vec3 n = d - vec3(getDist(p-e.xyy), getDist(p-e.yxy), getDist(p-e.yyx));
  return normalize(n);
}

vec3 lighting(vec3 p, vec3 light, vec3 lightColor) {
  vec3 lightVec = normalize(light - p);
  vec3 normal = getNormal(p);

  // Ambient light
  vec3 ambient = lightColor * .3;

  // Diffuse light
  vec3 diffuse = lightColor * max(dot(lightVec, normal), 0.);

  // Specular light
  vec3 viewDir = normalize(cameraPosition - p);
  vec3 reflectedDir = reflect(-lightVec, normal);
  float spec = pow(max(dot(viewDir, reflectedDir), 0.), 128.);
  vec3 specular = spec * lightColor * .5;
  
  // Shadows
  float d = rayMarching(p + lightVec*SURFACE_DIST*2., lightVec);
  float shadows = min(1., .1 + step(length(p - light), d));
  shadows = 1.;

  vec3 color = vec3(52., 52., 173.) / 220.;
  return color * shadows * (diffuse + ambient + specular);
}