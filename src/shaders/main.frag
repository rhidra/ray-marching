#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

uniform vec3 cameraPosition;
uniform vec3 cameraDirection;

@include "./functions.frag"
@include "./ray-marching.frag"
@include "./light.frag"

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= .5;
  uv.x *= resolution.x/resolution.y;
  
  // Center of screen = cameraPosition
  // ro = Eye
  vec3 ro = cameraPosition - cameraDirection * 1.;
  vec3 e1 = normalize(cross(cameraDirection, vec3(0., 0., 1.)));
  vec3 e2 = cross(cameraDirection, e1);
  vec3 rd = uv.x * e1 - uv.y * e2 - ro + cameraPosition;
  
  // Initial raymarching
  float d = rayMarching(ro, rd);
  vec3 p = ro + rd * d;
  
  // Lighting + shadow
  // float l = lighting(p, vec3(40.*abs(cos(time*.5)), 0., 1.));
  vec3 col = lighting(p, vec3(1., 0., 1.), vec3(1., 1., 1.) * 1.);

  // Fog
  col *= exp(-d*.01);
  
	gl_FragColor = vec4(col, 1.);
}