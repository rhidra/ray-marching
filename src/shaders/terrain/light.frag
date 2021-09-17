
// Soft shadows function for the terrain generation
// float softShadowsMarching(vec3 ro, vec3 rd, float k) {
//   float dt = 2., t = .01, res = 1.;

//   if (ro.z > MAX_HEIGHT) return 1.; 

//   for (int i = 0; i < MAX_STEPS*5; ++i) {
//     vec3 p = ro + rd * t;
//     if (p.z > MAX_HEIGHT) return res;

//     float h = getHeightmap(p).x;
//     res = min(res, k*(p.z - h)/t);

//     if (h >= p.z) return 0.;
//     if (t > MAX_DIST) break;

//     t += dt;
//     dt += .0005 * t;
//   }

//   return res;
// }



vec3 mountainsShading(vec3 p, vec3 normal) {
  float t = dot(normal, vec3(0., 0., 1.));
  t = pow(t, 15.);
  t = smoothstep(.2, .7, t);

  vec3 objectColor = mix(ROCK, GRASS, t);
  vec3 diffuseColor = vec3(1.) * 1.;
  vec3 specColor = vec3(1.) * 1.;

  // Ambient light
  vec3 ambient = vec3(1., 1., 1.) * .2;

  // Diffuse light
  vec3 diffuse = diffuseColor * max(dot(sunLight, normal), 0.);

  // Specular light
  vec3 viewDir = normalize(cameraPosition - p);
  vec3 reflectedDir = reflect(-sunLight, normal);
  float spec = pow(max(dot(viewDir, reflectedDir), 0.), 1024.);
  vec3 specular = spec * specColor * .1;
  
  // Shadows
#if 0
  float shadows = softShadowsMarching(p + sunLight*1., lightVec, 2.);
  shadows = clamp(shadows, 0.9, 1.);
#else
  float shadows = 1.;
#endif

  vec3 oldShading = objectColor * shadows * (diffuse + ambient + specular);

  vec3 grass = grassShading(p, normal);
  vec3 rock = rockShading(p, normal);
  return mix(rock, grass, t);
}
