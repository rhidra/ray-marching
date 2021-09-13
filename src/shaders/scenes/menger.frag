
vec4 getDist(vec3 p) {
  // p -= 10.;
  // p = fract(-abs(p)/10.)*10.;
  p /= 10.;
  p = mod(abs(p), 1.);

  float d = rectSDF(p,vec3(1.0));

  // Outer color
  vec3 color = vec3(214., 191., 130.)/214.;

  // float s = 5.0*abs(cos(time*.08));
  float s = 1.;
  for (int m=0; m < 3; ++m) {
    vec3 a = mod(p*s, 2.) - 1.;
    s *= 3.0;
    vec3 r = 1.0 - 3.0*abs(a);

    float c = crossSDF(r) / s;

    if (c > d) {
      color = float(m == 0) * vec3(201, 168, 103)/255.
        + float(m == 1) * vec3(201, 150, 87)/255.
        + float(m == 2) * vec3(209, 157, 56)/255.
        + float(m == 3) * vec3(209, 157, 56)/255.;
    }
    d = max(d, c);
    // p -= .1;
    // p = rotateX(p, float(m==1)*2.*DEG2RAD*cos(time*.5));
    // p = rotateY(p, float(m==0)*10.*DEG2RAD*cos(time*.1));
    // p = rotateZ(p, 4.*DEG2RAD);
  }

  // return dPlane < d ? vec4(1., 1., 1., dPlane) : vec4(.24, .24, .79, d);
  return vec4(color, d);
}
