#define GRASS vec3(79, 163, 44)/255.

float grassHeight(vec2 uv) {
  float dots = noise(uv*200.);
  dots = smoothstep(0.720, 0.924, dots);
  
  float n = noise(uv*20.);
  n = dots * pow(n, 2.020);

  return noise(uv);  
}

vec4 grassNormal(vec2 uv, vec3 normal, float dist) {
  if (dist > 500.) {
    return vec4(normal, 0.);
  }
  float h = grassHeight(uv);
  vec2 eps = vec2(.1, 0.);
  vec2 dxy = h - vec2(grassHeight(uv + eps.xy), grassHeight(uv + eps.yx));
  return vec4(mix(normal, normalize(vec3(dxy * 1./eps.x, 1.)), clamp(exp(-(dist-50.)*5./500.), 0., 1.)), h);
}

vec3 grassShading(vec3 p, vec3 normal) {
  vec3 viewDir = normalize(cameraPosition - p);
  float dist = length(cameraPosition - p);

  // Normal map
  vec4 bump = grassNormal(p.xy*1., normal, dist);
  return vec3(bump.w);
  normal = mix(normal, bump.rgb, 1.);

  // Ambient light
  vec3 ambient = vec3(1.) * .2;

  // Diffuse light
  vec3 diffuse = vec3(1.) * max(dot(sunLight, normal), 0.);

  // Specular light
  vec3 reflectedDir = reflect(-sunLight, normal);
  float spec = pow(max(dot(viewDir, reflectedDir), 0.), 32.);
  vec3 specular = spec * vec3(1.) * .4;

  return GRASS * (diffuse + ambient + specular);
}