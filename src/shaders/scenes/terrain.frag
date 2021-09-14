#define MAX_STEPS 2000
#define SURFACE_DIST .01
#define MAX_DIST 1000.

#define MIN_HEIGHT 0.
#define MAX_HEIGHT 100.
#define OCTAVES 4

vec4 getDist(vec3 p) {
  vec2 st = p.xy * .1 + 100.;

  float value = 0.0;
  float amplitude = .5;
  float frequency = 0.;

  value += 6. * noise(st * .1);
  value += 2.5 * noise(st * .15 + 5.);
  value += .75 * noise(st * .2 - 10.);
  value += .375 * noise(st * .4 + 30.);
  value += .1875 * noise(st * .8);
  value += .09375 * noise(st * 1.6);

  value /= 6. + 2.5 + .75 + .375 + .1875 + .09375;// + .3 + .2 + .125;

  value = pow(value, 1.4);

  value *= MAX_HEIGHT;
  
  return vec4(vec3(1.), value);
}


vec4 rayMarchingTerrain(vec3 ro, vec3 rd) {
  float dt = .01, t = .01;
  float lastH = 0., lastZ = 0.;
  vec3 skyColor = vec3(0.30, 0.36, 0.60)*1.7;

  if (ro.z > MAX_HEIGHT && rd.z >= 0.) {
    return vec4(skyColor, MAX_DIST);
  } else if (ro.z > MAX_HEIGHT) {
    float c = dot(rd, normalize(vec3(rd.x, rd.y, ro.z)));
    t = (ro.z - MAX_HEIGHT) / sqrt(1. - c*c);
  }

  for (int i = 0; i < MAX_STEPS; ++i) {
    vec3 p = ro + rd * t;

    if (p.z > MAX_HEIGHT && rd.z >= 0.) {
      return vec4(skyColor, MAX_DIST);
    }

    float h = getDist(p).w;

    if (h >= p.z) {
      // Linear interpolation of the error
      h = t - dt + dt * (lastH - lastZ) / (p.z - lastZ - h + lastH);
      return vec4(.8, .5, .8, h);
    }

    if (t > MAX_DIST) {
      return vec4(skyColor, MAX_DIST);
    }

    lastH = h;
    lastZ = p.z;
    t += dt;

    // Increase the error as we are far away
    dt += .0005 * t;
  }

  return vec4(skyColor, MAX_DIST);
}