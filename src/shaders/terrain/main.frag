#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;

uniform vec3 cameraPosition;
uniform vec3 cameraDirection;

@include "../utils/math.frag"
@include "./terrain.frag"
@include "./light.frag"

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= .5;
  uv.x *= resolution.x/resolution.y;
  
  // Center of screen = cameraPosition
  // ro = Eye
  vec3 ro = cameraPosition - cameraDirection * .9;
  vec3 e1 = normalize(cross(cameraDirection, vec3(0., 0., 1.)));
  vec3 e2 = cross(cameraDirection, e1);
  vec3 rd = uv.x * e1 - uv.y * e2 - ro + cameraPosition;
  
  // Initial raymarching
  float d;
  vec3 normal;
  float hit = rayMarching(ro, rd, d, normal);
  // normal = cross(normal, cross(normal, vec3(0., 0., 1.)));
  // normal = abs(normal);
  normal = normalize(cross(normalize(vec3(1., 0., normal.x)), normalize(vec3(0., 1., normal.y))));
  // normal = abs(normal);
  vec3 p = ro + rd * d;

  vec3 skyColor = vec3(0.30, 0.36, 0.60)*1.7;
  
  if (hit < 0.) {
    gl_FragColor = vec4(skyColor, 1.);
    return;
  }
  
  // Lighting + shadow
  vec3 col = lighting(p, normal);

  // Fog
  col = applyFog(col, d);
  // col *= 1. - step(MAX_DIST, d);

  // Gamma correction
  // col = pow(col, vec3(0.4545));
  
  // col = vec3(diffCol);
	gl_FragColor = vec4(col, 1.);

  // float n = getHeightmap(vec3(uv.xy*400., 0.)).x / 100.;
  // gl_FragColor = vec4(vec3(n), 1.);
}