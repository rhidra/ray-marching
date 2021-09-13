vec3 getNormal(vec3 p) {
  float d = getDist(p).w;
  vec2 e = vec2(.001, 0.);
  
  vec3 n = d - vec3(getDist(p-e.xyy).w, getDist(p-e.yxy).w, getDist(p-e.yyx).w);
  return normalize(n);
}

vec3 applyFog(vec3 col, float d) {
  vec3 fogColor = vec3(0.30, 0.36, 0.60)*1.7;
  float fogAmount = 1. - clamp(exp(-(d-40.) * (1.0/10.)) * 2., 0., 1.);
  return mix(col, fogColor, fogAmount);
}

vec3 getLight(vec3 p, vec3 objectColor, vec3 lightPos, vec3 diffColor, vec3 specColor) {
  vec3 lightVec = normalize(lightPos - p);
  vec3 normal = getNormal(p);

  // Ambient light
  vec3 ambient = vec3(1., 1., 1.) * .5;

  // Diffuse light
  vec3 diffuse = diffColor * max(dot(lightVec, normal), 0.);

  // Specular light
  vec3 viewDir = normalize(cameraPosition - p);
  vec3 reflectedDir = reflect(-lightVec, normal);
  float spec = pow(max(dot(viewDir, reflectedDir), 0.), 32.);
  vec3 specular = spec * specColor * .8;
  
  // Shadows
  vec4 ds = rayMarching(p + lightVec*SURFACE_DIST*2., lightVec);
  float d = ds.w;
  // float shadows = min(1., .5 + step(length(p - lightPos), d));
  float shadows = 1.;

  return objectColor * shadows * (diffuse + ambient + specular);
}