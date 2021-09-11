import * as twgl from 'twgl.js';
import { crossProduct, norm, normalize } from '../utils/math';
import { Vector3 } from '../utils/type';
import { Controller, Quality, RenderType } from './controls';
import { MouseListener } from './events';
import { createTexture, createSolidTexture } from './texture';

// Load shaders
const vert = require('../shaders/shader.vert');
const frag = require('../shaders/ray-marching.frag');

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
  let cameraPos: Vector3 = [0, 0, 0];
  let cameraDir: Vector3 = [1, 0, 0];
  
  // Update the camera direction when moving the cursor
  listener.onMouseMove((point, dir) => {
    const [vx, vy] = [dir[0], dir[1]];
    // vector = 0*Rd + vx*e1 + vy*e2
    const e1 = normalize(crossProduct(cameraDir, [0, 0, 1]));
    const e2 = crossProduct(cameraDir, e1);

    // cameraDir = cameraDir + k * (vx * e1 + vy * e2)
    const k = 1; // Camera sensibility
    cameraDir = normalize([
      cameraDir[0] + k * (vx * e1[0] + vy * e2[0]),
      cameraDir[1] + k * (vx * e1[1] + vy * e2[1]),
      cameraDir[2] + k * (vx * e1[2] + vy * e2[2]),
    ]);
  });

  let lastTime = Date.now() / 1000;
  let i = 0;

  function render(time: number) {
    const now = time / 1000;
    const dt = (now - lastTime) * 1;
    lastTime = now;

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