#define MAX_STEPS 500
#define SURFACE_DIST .01
#define MAX_DIST 500.

#define MIN_HEIGHT 0.
#define MAX_HEIGHT 200.
#define OCTAVES 4

// Heightmap in the x channel, and the derivatives in the yzw channels
vec3 getHeightmap(vec3 p) {
  vec2 st = p.xy * .1 + 100.;
  vec3 value = vec3(0.);

  value += 6. * noised(st * .1);
  value += 4.5 * noised(st * .15 + 5.);
  value += .75 * noised(st * .2 - 10.);
  value += .375 * noised(st * .4 + 30.);
  value += .1875 * noised(st * .8 - 15.);
  value += .09375 * noised(st * 1.6 + 6.);

  value /= 6. + 4.5 + .75 + .375 + .1875 + .09375;

  // value = pow(value, vec3(1.4));

  value.x *= MAX_HEIGHT;

  value.x = max(value.x, 10.);
  
  return value;
}

vec3 getNormal(vec3 p, float d) {
  // float d = getHeightmap(p);
  vec2 e = vec2(.001, 0.);
  
  vec3 n = vec3(getHeightmap(p-e.xyy).x - getHeightmap(p+e.xyy).x, getHeightmap(p-e.yxy).x - getHeightmap(p+e.yxy).x, 2.*e.x);

  return normalize(n);
}

float rayMarching(vec3 ro, vec3 rd, out float dist, out vec3 normal) {
  float dt = 2.5, t = .01;
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

    vec3 height = getHeightmap(p);
    float h = height.x;

    if (h >= p.z) {
      // Linear interpolation of the error
      dist = t - dt + dt * (lastH - lastZ) / (p.z - lastZ - h + lastH);
      // normal = getNormal(p, h);
      normal = normalize(cross(normalize(vec3(1., 0., height.y)), normalize(vec3(0., 1., height.z))));
      return 1.;
    }

    if (t > MAX_DIST) {
      return -1.;
    }

    lastH = h;
    lastZ = p.z;
    t += dt;

    // Increase the error as we are far away
    dt += .00001 * t;
  }

  return -1.;
}