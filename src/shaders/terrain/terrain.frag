#define MAX_STEPS 500
#define SURFACE_DIST .5
#define MAX_DIST 2000.

#define MIN_HEIGHT 0.
#define MAX_HEIGHT 150.
#define WATER_LEVEL 50.

// Heightmap in the x channel, and the derivatives in the yzw channels
vec3 getHeightmap(vec3 p) {
  vec2 st = p.xy * .11 + 100.;
  vec3 value = vec3(0.);

  value += 6. * noised(st * .1);
  value += 5.5 * noised(st * .15 + 5.);
  value += 2.85 * noised(st * .2 - 10.);
  value += 1.475 * noised(st * .4 + 30.);
  value += .3875 * noised(st * .8 - 15.);
  value += .1875 * noised(st * 1.6 - 15.);
  // value += .09375 * noised(st * 1.6 + 6.);

  value /= 6. + 5.5 + 2.85 + 1.475 + .3875 + .1875;

  float power = 1.2;
  value.yz = value.yz * power * pow(value.x, power - 1.);
  value.x = pow(value.x, power);

  value.x *= MAX_HEIGHT;

  return value;
}

vec3 getNormal(vec3 p, float d) {
  vec2 e = vec2(.001, 0.);
  
  vec3 n = vec3(getHeightmap(p-e.xyy).x - getHeightmap(p+e.xyy).x, getHeightmap(p-e.yxy).x - getHeightmap(p+e.yxy).x, 2.*e.x);

  return normalize(n);
}

float rayMarching(vec3 ro, vec3 rd, out float dist, out vec3 normal, out vec3 color) {
  float dt = 2.1, t = 1.01;
  // float lastH = 0., lastZ = 0.;
  float waterDensity = .02, waterReduction = 1.;
  vec3 waterColor = vec3(9, 87, 171)/255.;

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

    // Mountains
    if (p.z <= h && SURFACE_DIST > h - p.z) {
      dist = t;
      normal = normalize(cross(normalize(vec3(1., 0., height.y)), normalize(vec3(0., 1., height.z))));

      color = mountainsShading(p, normal);

      color = mix(waterColor, color, waterReduction);

      return 1.;
    } else if (p.z <= h) {
      t -= dt;
      dt /= 5.;
    }

    // Water
    if (p.z < WATER_LEVEL) {
      waterReduction -= waterDensity * dt;
    }

    if (t > MAX_DIST) {
      return -1.;
    }

    // Increase the error as we are far away
    dt += .0001 * t;

    t += dt;
  }

  return -1.;
}