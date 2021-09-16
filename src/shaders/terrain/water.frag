float waterNormalNoise(vec2 uv) {
  float n = noise(uv * .5 + time*2.*vec2(noise(uv*.2), noise(uv*.2+10.)));
  n += .25 * noise(uv * 2. + time*vec2(noise(uv*.3+50.), noise(uv*.2+20.)));
  return n * .01 / (1. + .25);
}

vec3 waterShading(vec3 p, vec3 originalColor, float depth) {
  vec3 viewDir = normalize(cameraPosition - p);
  float dist = length(cameraPosition - p);

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

  float alpha = (1. - exp(-depth * .3) + .1) * step(0.1, depth);
  // alpha = step(.05, depth);
  return mix(originalColor, waterColor, alpha);
}