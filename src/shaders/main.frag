#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

uniform vec3 cameraPosition;
uniform vec3 cameraDirection;

@include "./utils/math.frag"
@include "./utils/sdf.frag"
@include "./scenes/mandelbulb.frag"
@include "./ray-marching.frag"
@include "./light.frag"
@include "./scenes/mandelbulb-light.frag"

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
  vec4 hit = rayMarching(ro, rd);
  float d = hit.w;
  vec3 diffCol = hit.rgb;
  vec3 p = ro + rd * d;
  
  // Lighting + shadow
  vec3 col = lighting(p, diffCol);

  // Fog
  col = applyFog(col, d);

  // Gamma correction
  // col = pow(col, vec3(0.4545));
  
  // col = vec3(d/100.);
	gl_FragColor = vec4(col, 1.);
}