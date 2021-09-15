vec3 applyFog(vec3 col, float d) {
  vec3 fogColor = vec3(0.30, 0.36, 0.60)*1.7;
  float fogAmount = 1. - clamp(exp(-(d-300.) * (1.0/10.)) * 2., 0., 1.);
  return mix(col, fogColor, fogAmount);
}

// Soft shadows function for the terrain generation
// float softShadowsMarching(vec3 ro, vec3 rd, float k) {
//   float dt = .01, t = .01, res = 1.;

//   if (ro.z > MAX_HEIGHT) return 1.; 

//   for (int i = 0; i < MAX_STEPS*5; ++i) {
//     vec3 p = ro + rd * t;
//     if (p.z > MAX_HEIGHT) return res;

//     float h = getDist(p).x;
//     res = min(res, k*(p.z - h)/t);

//     if (h >= p.z) return 0.;
//     if (t > MAX_DIST) break;

//     t += dt;
//     dt += .0005 * t;
//   }

//   return res;
// }

vec3 getLight(vec3 p, vec3 normal, vec3 objectColor, vec3 lightPos, vec3 diffColor, vec3 specColor) {
  vec3 lightVec = normalize(lightPos - p);

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
  // float shadows = softShadowsMarching(p + lightVec*1., lightVec, 2.);
  // shadows = clamp(shadows, 0.9, 1.);
  float shadows = 1.;

  return objectColor * shadows * (diffuse + ambient + specular);
}

vec3 lighting(vec3 p, vec3 normal) {
  float t = dot(normal, vec3(0., 0., 1.));
  vec3 diffCol = mix(vec3(184, 167, 154)/255., vec3(61, 156, 73)/255., pow(t, 10.));

  vec3 col = getLight(p, normal, diffCol, vec3(-4., -4., 100.), vec3(1.) * 1., vec3(1.));

  return col;
}

