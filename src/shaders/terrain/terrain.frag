#define MAX_STEPS 2000
#define SURFACE_DIST .01
#define MAX_DIST 500.

#define MIN_HEIGHT 0.
#define MAX_HEIGHT 100.
#define OCTAVES 4

// Heightmap in the x channel, and the derivatives in the yzw channels
vec4 getHeightmap(vec3 p) {
  vec2 st = p.xy * .1 + 100.;
  vec3 value = vec3(0.);

  value += 6. * noised(st * .1);
  value += 2.5 * noised(st * .15 + 5.);
  value += .75 * noised(st * .2 - 10.);
  value += .375 * noised(st * .4 + 30.);
  value += .1875 * noised(st * .8);
  value += .09375 * noised(st * 1.6);

  value /= 6. + 2.5 + .75 + .375 + .1875 + .09375;

  // value = pow(value, 1.4);

  value.x *= MAX_HEIGHT;

  // value = max(value, 10.);
  
  return vec4(value, 0.);
}


float rayMarching(vec3 ro, vec3 rd, out float dist, out vec3 normal) {
  float dt = .01, t = .01;
  float lastH = 0., lastZ = 0.;

  if (ro.z > MAX_HEIGHT && rd.z >= 0.) {
    return -1.;
  } else if (ro.z > MAX_HEIGHT) {
    float c = dot(rd, normalize(vec3(rd.x, rd.y, ro.z)));
    t = (ro.z - MAX_HEIGHT) / sqrt(1. - c*c);
  }

  for (int i = 0; i < MAX_STEPS; ++i) {
    vec3 p = ro + rd * t;

    if (p.z > MAX_HEIGHT && rd.z >= 0.) {
      return -1.;
    }

    vec4 height = getHeightmap(p);

    if (height.x >= p.z) {
      // Linear interpolation of the error
      dist = t - dt + dt * (lastH - lastZ) / (p.z - lastZ - height.x + lastH);
      normal = height.yzw;
      return 1.;
    }

    if (t > MAX_DIST) {
      return -1.;
    }

    lastH = height.x;
    lastZ = p.z;
    t += dt;

    // Increase the error as we are far away
    dt += .0005 * t;
  }

  return -1.;
}