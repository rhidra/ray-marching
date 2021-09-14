vec3 getNormal(vec3 p) {
  float d = getDist(p).w;
  vec2 e = vec2(.0001, 0.);
  
  vec3 n = d - vec3(getDist(p-e.xyy).w, getDist(p-e.yxy).w, getDist(p-e.yyx).w);
  return normalize(n);
}

vec3 getNormalTerrain(vec3 p) {
  float d = getDist(p).w;
  vec2 e = vec2(.0001, 0.);
  
  vec3 n = vec3(getDist(p-e.xyy).w - getDist(p+e.xyy).w, getDist(p-e.yxy).w - getDist(p+e.yxy).w, 2.*e.x);

  return normalize(n);
}

vec3 applyFog(vec3 col, float d) {
  vec3 fogColor = vec3(0.30, 0.36, 0.60)*1.7;
  // float fogAmount = 1. - clamp(exp(-(d-40.) * (1.0/10.)) * 2., 0., 1.);
  float fogAmount = 1. - clamp(exp(-(d-280.) * (1.0/10.)) * 2., 0., 1.);
  return mix(col, fogColor, fogAmount);
}

// Soft shadow function in general
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

// Soft shadows function for the terrain generation
float softShadowsMarchingTerrain(vec3 ro, vec3 rd, float k) {
  float dt = .01, t = .01, res = 1.;

  if (ro.z > MAX_HEIGHT) return 1.; 

  for (int i = 0; i < MAX_STEPS*5; ++i) {
    vec3 p = ro + rd * t;
    if (p.z > MAX_HEIGHT) return res;

    float h = getDist(p).w;
    res = min(res, k*(p.z - h)/t);

    if (h >= p.z) return 0.;
    if (t > MAX_DIST) break;

    t += dt;
    dt += .0005 * t;
  }

  return res;
}

vec3 getLight(vec3 p, vec3 objectColor, vec3 lightPos, vec3 diffColor, vec3 specColor) {
  vec3 lightVec = normalize(lightPos - p);
  vec3 normal = getNormalTerrain(p);

  // Ambient light
  vec3 ambient = vec3(1., 1., 1.) * .2;

  // Diffuse light
  vec3 diffuse = diffColor * max(dot(lightVec, normal), 0.);

  // Specular light
  vec3 viewDir = normalize(cameraPosition - p);
  vec3 reflectedDir = reflect(-lightVec, normal);
  float spec = pow(max(dot(viewDir, reflectedDir), 0.), 1024.);
  vec3 specular = spec * specColor * .1;
  
  // Shadows
  // float shadows = softShadowsMarchingTerrain(p + lightVec*1., lightVec, 2.);
  // shadows = clamp(shadows, 0.9, 1.);
  float shadows = 1.;

  return objectColor * shadows * (diffuse + ambient + specular);
}