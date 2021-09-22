Ray marching simulation
=======================

## [Checkout the live demo](https://rhidra.github.io/ray-marching)

**The live demo does not work with touch screens and mobile devices.**

A fun project to try building a procedurally generated 3D environment, using as few libraries as possible.
Using WebGL, I built a small ray marching renderer. After experimenting with various scenes and 2D fractals,
I used a 2D fractional brownian motion noise texture to generate a 3D environment. I had to optimize the basic
ray marching algorithm, to support displaying a larger world, while shading it in real-time.
I also experimented with multiple basic shading methods. The entire environment is generated from mathematical
functions, and does not use any external texture or resources.

To run the project in development:

```shell script
npm install
npm start
```