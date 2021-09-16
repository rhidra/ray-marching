#define SKY_COLOR vec3(135, 206, 235)/255.

vec3 applyFog(vec3 col, float d) {
  float fogAmount = 1. - clamp(exp(-(d-1000.) * (1.0/100.)) * 2., 0., 1.);
  return mix(col, SKY_COLOR, fogAmount);
}

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

const vec3 sunLight = normalize(vec3(1., 1., .6));

#define GRASS vec3(79, 163, 44)/255.
#define ROCK vec3(125, 90, 62)/255.

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

  return objectColor * shadows * (diffuse + ambient + specular);
}

float waterNormalNoise(vec2 uv) {
  float n = noise(uv * .5 + time*2.*vec2(noise(uv*.2), noise(uv*.2+10.)));
  n += .25 * noise(uv * 2. + time*vec2(noise(uv*.3+50.), noise(uv*.2+20.)));
  return n * .01 / (1. + .25);
}

vec3 waterShading(vec3 p, vec3 originalColor, float depth) {
  vec3 viewDir = normalize(cameraPosition - p);
  float dist = length(cameraPosition - p);

  // float normalAngle = n;// + 5. * DEG2RAD * cos(time*2. + p.x*.8 + sin(p.y)*.1);
  // vec3 normal = vec3(sin(normalAngle), 0., cos(normalAngle));
  vec3 normal = vec3(0., 0., 1.);
  vec2 eps = vec2(.1, 0.);
  vec2 dxy = waterNormalNoise(p.xy) - vec2(waterNormalNoise(p.xy + eps.xy), waterNormalNoise(p.xy + eps.yx));
  normal = mix(normal, normalize(vec3(dxy * 1./eps.x, 1.)), clamp(exp(-(dist-50.)*5./500.), 0., 1.));

  vec3 surfaceColor = vec3(9, 87, 171)/180.;
  vec3 depthColor = vec3(20, 43, 74)/230.;

  float opticalDepth = 1. - exp(-depth * .03);
  vec3 waterColor = mix(surfaceColor, depthColor, opticalDepth);

  vec3 reflectedDir = reflect(-sunLight, normal);
  float specHighlight = 2.2 * pow(max(dot(viewDir, reflectedDir), 0.), 128.);

  float diffuseLighting = max(dot(sunLight, vec3(0., 0., 1.)), 0.);

  waterColor *= diffuseLighting + specHighlight;

  float alpha = 1. - exp(-depth * .2);
  // alpha = step(.05, depth);
  return mix(originalColor, waterColor, alpha);
}
