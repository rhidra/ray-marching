#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;

uniform vec3 cameraPosition;
uniform vec3 cameraDirection;

@include "../utils/math.frag"
@include "../utils/random.frag"
@include "./light.frag"
@include "./terrain.frag"

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
  vec3 col;
  float hit = rayMarching(ro, rd, d, normal, col);
  vec3 p = ro + rd * d;

  vec3 skyColor = vec3(0.30, 0.36, 0.60)*1.7;
  
  if (hit < 0.) {
    gl_FragColor = vec4(skyColor, 1.);
    return;
  }
  

  // Fog
  col = applyFog(col, d);
  // col *= 1. - step(MAX_DIST, d);

  // Gamma correction
  // col = pow(col, vec3(0.4545));
  
	gl_FragColor = vec4(col, 1.);

  // vec3 n = getHeightmap(vec3(uv.xy*400., 0.));
  // // col = mix(vec3(abs(n.yz), 0.), vec3(n.x/100.), abs(cos(time*.8)));
  // n.x/=MAX_HEIGHT;
  // col = vec3(n.x);
  // gl_FragColor = vec4(col, 1.);
}