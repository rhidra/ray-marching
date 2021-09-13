
vec4 getDist(vec3 p) {
  p -= 5.;
  p = fract(-abs(p)/10.)*10.;

  // float d = rectSDF(p, vec3(1.));

  p *= .5;
  float d = rectSDF(p,vec3(1.0));

  float s = 5.0*abs(cos(time*.08));
  for (int m=0; m < 2; ++m) {
    vec3 a = mod(p*s, 2.) - 1.;
    s *= 3.0;
    vec3 r = 1.0 - 3.0*abs(a);

    float c = crossSDF(r) / s;
    d = max(d, c);
  }

  float dPlane = 1000000.;//planeSDF(p/.5, -2.1);

  return dPlane < d ? vec4(1., 1., 1., dPlane) : vec4(.24, .24, .79, d);
}
