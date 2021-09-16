#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;

uniform vec3 cameraPosition;
uniform vec3 cameraDirection;

const vec3 sunLight = normalize(vec3(1., 1., .6));

@include "../utils/math.frag"
@include "../utils/random.frag"
@include "./water.frag"
@include "./rock.frag"
@include "./light.frag"
@include "./terrain.frag"

vec3 applyFog(vec3 col, float d) {
  float fogAmount = 1. - clamp(exp(-(d-1000.) * (1.0/100.)) * 2., 0., 1.);
  return mix(col, SKY_COLOR, fogAmount);
}

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

  if (hit < 0.) {
    gl_FragColor = vec4(SKY_COLOR, 1.);
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