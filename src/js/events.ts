import {Vector2, Vector3} from '../utils/type';

export class MouseListener {
  prevDir: Vector2 | null = null;
  isLocked = false;
  moveDirection: Vector3 = [0, 0, 0];
  canvas;

  mouseMoveCb: (point: Vector2, force: Vector2) => void;
  cameraMoveCb: (direction: Vector3) => void;
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

    // Keyboard event listener
    document.addEventListener("keydown", e => this.handleKeyboardDown(e), false);
    document.addEventListener("keyup", e => this.handleKeyboardUp(e), false);
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
    let dx = e.movementX / k;
    let dy = e.movementY / k;

    if (e.movementX === -1 && e.movementY === -1) {
      dx = 0;
      dy = 0;
    }

    this.mouseMoveCb(undefined, [dx, dy]);
  }

  handleKeyboardDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'z':
        this.moveDirection[0] = 1;
        break;
      case 's':
        this.moveDirection[0] = -1;
        break;
      case 'q':
        this.moveDirection[1] = 1;
        break;
      case 'd':
        this.moveDirection[1] = -1;
        break;
      case 'a':
        this.moveDirection[2] = 1;
        break;
      case 'e':
        this.moveDirection[2] = -1;
        break;
    }
  }

  handleKeyboardUp(e: KeyboardEvent) {
    switch (e.key) {
      case 'z':
      case 's':
        this.moveDirection[0] = 0;
        break;
      case 'q':
      case 'd':
        this.moveDirection[1] = 0;
        break;
      case 'a':
      case 'e':
        this.moveDirection[2] = 0;
        break;
    }
  }

  onMouseMove(fn: (point: Vector2, force: Vector2) => void) {
    this.mouseMoveCb = fn;
  }

  onCameraMove(fn: (direction: Vector3) => void) {
    this.cameraMoveCb = fn;
  }
}

export function initMouseListener() {
  return new MouseListener();
}