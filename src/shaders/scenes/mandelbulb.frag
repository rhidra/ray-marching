#define ITERATIONS 5
#define BAILOUT 10.

vec4 getDist(vec3 p) {
  p *= .08;
	vec3 z = p;
	float dr = 1.0;
	float r = 0.0;

  float power = 8.;
  power = 2. + cos(time*.03)*8.;

	for (int i = 0; i < ITERATIONS; ++i) {
		r = length(z);
		if (r > BAILOUT) break;
		
		// convert to polar coordinates
		float theta = acos(z.z / r);
		float phi = atan(z.y, z.x);
		dr = pow(r, power - 1.) * power * dr + 1.;
		
		// scale and rotate the point
		float zr = pow(r, power);
		theta = theta * power;
		phi = phi * power;
		
		// convert back to cartesian coordinates
		z = zr * vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
		z += p;
	}

	float d = 0.5 * log(r) * r / dr;

  return vec4(1., 1., 1., d);
}