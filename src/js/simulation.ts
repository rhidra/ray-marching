import * as twgl from 'twgl.js';
import { vec3 } from '../utils/vec3';
import { Vector2, Vector3 } from '../utils/type';
import { Controller, Quality } from './controls';
import { MouseListener } from './events';

// Load shaders
const vert = require('../shaders/shader.vert');
const frag = require('../shaders/main.frag');

const RESOLUTION_FACTOR_HIGH = 1;
const RESOLUTION_FACTOR_MEDIUM = 1.4;
const RESOLUTION_FACTOR_LOW = 3;

function resolutionFactor(controller: Controller) {
  return {
    [Quality.LOW]: RESOLUTION_FACTOR_LOW,
    [Quality.MEDIUM]: RESOLUTION_FACTOR_MEDIUM,
    [Quality.HIGH]: RESOLUTION_FACTOR_HIGH,
  }[controller.quality];
}

export function initSimulation(listener: MouseListener, controller: Controller) {
  // WebGL init
  const gl = document.querySelector<HTMLCanvasElement>("#c").getContext("webgl");
  twgl.resizeCanvasToDisplaySize(gl.canvas as any);

  if (!gl.getExtension('OES_texture_float')) {
      console.error('no floating point texture support');
      return;
  }
  gl.getExtension('OES_texture_float_linear');

  // Programs init
  const prog = twgl.createProgramInfo(gl, [vert.sourceCode, frag.sourceCode])
  
  // Vertex shader stuff
  const arrays = {position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]};
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

  // Init camera position and direction
  let cameraPos: Vector3 = [-10, 0, 0];
  let cameraDir: Vector3 = [1, 0, 0];

  let velMouse: Vector2 = [0, 0];
  
  // Update the camera direction when moving the cursor
  listener.onMouseMove((point, dir) => {
    velMouse = dir;
  });

  let lastTime = Date.now() / 1000;
  let i = 0;

  function render(time: number) {
    const now = time / 1000;
    const dt = (now - lastTime) * 1;
    lastTime = now;

    // Camera position computation
    const camSpeed = .4;
    const camSensitivity = 1;
    const e1 = vec3.normalize(vec3.cross(cameraDir, [0, 0, 1]));
    const e2 = vec3.cross(cameraDir, e1);
    
    // Direction
    const [vx, vy] = velMouse;
    // cameraDir = normalize(cameraDir + camSensivity * (vx * e1 + vy * e2))
    cameraDir = vec3.normalize(vec3.add(vec3.add(cameraDir, vec3.scale(vx * camSensitivity, e1)), vec3.scale(vy * camSensitivity, e2)));
    
    // Position
    // cameraPos = cameraPos + camSpeed * (camVel[0] * cameraDir - camVel[1] * e1 + camVel * e2)
    const camVel = vec3.normalize(listener.moveDirection);
    const v = vec3.add(vec3.add(
      vec3.scale(camVel[0], cameraDir),
      vec3.scale(- camVel[1], e1)),
      vec3.scale(camVel[2], e2)
    );
    cameraPos = vec3.add(cameraPos, vec3.scale(camSpeed, v));

    // Resize canvas and textures
    if (twgl.resizeCanvasToDisplaySize(gl.canvas as any)) {
      console.log('resizing');
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    const uniforms = {
      [frag.uniforms.time.variableName]: now,
      [frag.uniforms.resolution.variableName]: [gl.canvas.width, gl.canvas.height],
      [frag.uniforms.cameraPosition.variableName]: [cameraPos[0], cameraPos[1], cameraPos[2]],
      [frag.uniforms.cameraDirection.variableName]: [cameraDir[0], cameraDir[1], cameraDir[2]],

    };
    
    renderToTexture(gl, prog, null, bufferInfo, uniforms);

    i++;
    requestAnimationFrame(render);
  }
  
  requestAnimationFrame(render);
}

/**
 * Runs a WebGL program with a GLSL shader to generate a texture.
 * 
 * @param gl Current WebGL context
 * @param programInfo The program linked to the shaders to use
 * @param framebuffer The framebuffer linked to the texture on which to render. If null, renders to the canvas.
 * @param bufferInfo The buffer info used with the vertex shader
 * @param uniforms The uniforms used in the fragment shader
 */
function renderToTexture(gl: WebGLRenderingContext, programInfo: twgl.ProgramInfo, framebuffer: twgl.FramebufferInfo|null, bufferInfo: twgl.BufferInfo, uniforms: any) {
  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

  twgl.bindFramebufferInfo(gl, framebuffer);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo);
}