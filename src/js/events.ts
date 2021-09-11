import {Vector2} from '../utils/type';

export class MouseListener {
  prevDir: Vector2 | null = null;
  isLocked = false;
  canvas;

  mouseDragCb: (point: Vector2, force: Vector2) => void;
  mouseMoveCb: (point: Vector2, force: Vector2) => void;
  dragStopCb: () => void;

  constructor() {
    this.canvas = document.querySelector<HTMLCanvasElement>("#c");

    this.canvas.requestPointerLock = this.canvas.requestPointerLock || (this.canvas as any).mozRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock || (document as any).mozExitPointerLock;

    this.canvas.onclick = () => {
      this.canvas.requestPointerLock();
    };
    
    // Event listener for lock cursor
    document.addEventListener('pointerlockchange', () => this.handleLockChange(), false);
    document.addEventListener('mozpointerlockchange', () => this.handleLockChange(), false);

    // Configure event listeners for mouse movements
    document.addEventListener("mousemove", e => this.handleMouseMove(e), false);
    document.addEventListener("touchmove", e => this.handleMouseMove(e as any), false);
  }

  handleLockChange() {
    if (document.pointerLockElement === this.canvas || (document as any).mozPointerLockElement === this.canvas) {
      this.isLocked = true;
    } else {
      this.isLocked = false;
    }
  }

  handleMouseMove(e: MouseEvent) {
    if (!this.mouseMoveCb || !this.isLocked) {
      return;
    }

    const k = 500;
    const dx = e.movementX / k;
    const dy = e.movementY / k;

    this.mouseMoveCb(undefined, [dx, dy]);
  }

  onMouseMove(fn: (point: Vector2, force: Vector2) => void) {
    this.mouseMoveCb = fn;
  }
}

export function initMouseListener() {
  return new MouseListener();
}