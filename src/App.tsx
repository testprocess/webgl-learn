import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const canvasRef: any = useRef();
  const [gl, setGl] = useState<any>();

  function createShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ) {
    let shader: WebGLShader | any = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  function createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    let program: WebGLProgram | any = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  function main() {
    const canvas = canvasRef.current;
    let gl: WebGLRenderingContext = canvas.getContext("webgl");
    if (!gl) {
      return;
    }

    let vertexShaderSource = `
    attribute vec4 a_position;
      void main() {
  
      gl_Position = a_position;
    }`;

    let fragmentShaderSource = `
    precision mediump float;
  
    void main() {

      gl_FragColor = vec4(1, 0.6, 0.2, 1); // return redish-purple
    }`;

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    let program = createProgram(gl, vertexShader, fragmentShader);
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let positions = [-0.5, -0.5, -0.5, 0.5, 0.9, -0.5];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.clearColor(0, 0.3, 0.5, 0);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let size = 2;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;

    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    let primitiveType = gl.TRIANGLES;
    let count = 3;
    gl.drawArrays(primitiveType, offset, count);
  }

  useEffect(() => {
    main();
  }, []);
  return (
    <div className="App">
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
}

export default App;
