vec3 getNormal(vec3 p) {
  float d = getDist(p).w;
  vec2 e = vec2(.000001, 0.);
  
  vec3 n = d - vec3(getDist(p-e.xyy).w, getDist(p-e.yxy).w, getDist(p-e.yyx).w);
  return normalize(n);
}

vec3 applyFog(vec3 col, float d) {
  vec3 fogColor = vec3(0.30, 0.36, 0.60)*1.7;
  float fogAmount = 1. - clamp(exp(-(d-40.) * (1.0/10.)) * 2., 0., 1.);
  return mix(col, fogColor, fogAmount);
}


float softShadowsMarching(vec3 ro, vec3 rd, float k) {
  float d0 = SURFACE_DIST/2.;
  float res = 1.;

  for (int i = 0; i < MAX_STEPS; ++i) {
      vec3 p = ro + d0 * rd;
      float ds = getDist(p).w;
      res = min(res, k*ds/d0);
      d0 += ds;
      if (ds < SURFACE_DIST && i > MAX_STEPS/10) return 0.;
      if (d0 > MAX_DIST) break;
  }
  
  return res;
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
  float shadows = softShadowsMarching(p + lightVec*SURFACE_DIST*8., lightVec, 8.);
  shadows = clamp(.2 + shadows, 0., 1.);
  // float shadows = 1.;

  return objectColor * shadows * (diffuse + ambient + specular);
}