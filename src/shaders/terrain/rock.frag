#define ROCK vec3(212, 149, 99)/255.
#define ROCK_DARK vec3(102, 83, 67)/255.

float rockHeight(vec2 uv) {
    uv = rotate2D(uv, 0.005*noise(uv*10.*0.436));
    uv.x *= 3.;
    uv = uv + vec2(fbm(uv)-20., fbm(uv+10.)+50.);
    uv = uv + 10.*0.332*vec2(fbm(uv)-40., fbm(uv+10.)+500.);

    float n = fbm(uv);
    // n = pow(n, 2.112);
    // n = n*.6;
    // n = n*.1;

    return n;  
}

vec4 rockNormal(vec2 uv, vec3 normal, float dist) {
  float h = rockHeight(uv);
  vec2 eps = vec2(.1, 0.);
  vec2 dxy = h - vec2(rockHeight(uv + eps.xy), rockHeight(uv + eps.yx));
  return vec4(mix(normal, normalize(vec3(dxy * 1./eps.x, 1.)), clamp(exp(-(dist-50.)*5./500.), 0., 1.)), h);
}

vec3 rockShading(vec3 p, vec3 normal) {

  vec3 viewDir = normalize(cameraPosition - p);
  float dist = length(cameraPosition - p);

  // return vec3(rockNormal(p.yx*.2, normal, dist).w);
  vec4 bump = rockNormal(p.yx*.2, normal, dist);
  normal = mix(normal, bump.rgb, .05);

  // Ambient light
  vec3 ambient = vec3(1., 1., 1.) * .2;

  // Diffuse light
  vec3 diffuse = vec3(1.) * max(dot(sunLight, normal), 0.);

  // Specular light
  vec3 reflectedDir = reflect(-sunLight, normal);
  float spec = pow(max(dot(viewDir, reflectedDir), 0.), 32.);
  vec3 specular = vec3(1.) * spec * .6;

  vec3 color = mix(ROCK, ROCK_DARK, pow(bump.w, .8));
  return color * (diffuse + ambient + specular);
}