// Starfield Shader Background 4 - Raw WebGL Implementation

export function initStarfieldBackground(canvas) {
  if (!canvas) return () => {};

  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("WebGL not supported");
    return () => {};
  }

  let animationFrameId;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  };
  resize();
  window.addEventListener("resize", resize);

  // Vertex shader
  const vertexShaderSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  // Fragment shader
  const fragmentShaderSource = `
    precision mediump float;

    uniform vec2 iResolution;
    uniform float iTime;

    vec3 hash( vec3 p )
    {
      p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
                dot(p,vec3(269.5,183.3,246.1)),
                dot(p,vec3(113.5,271.9,124.6)));

      return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }

    float noise( in vec3 p )
    {
        vec3 i = floor( p );
        vec3 f = fract( p );
      
        vec3 u = f*f*(3.0-2.0*f);

        return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                              dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                         mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                              dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                    mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                              dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                         mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                              dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 uv = fragCoord/iResolution.xy;
        
        vec3 stars_direction = normalize(vec3(uv * 2.0 - 1.0, 1.0));
        float stars_threshold = 8.0;
        float stars_exposure = 200.0;
        float stars = pow(clamp(noise(stars_direction * 200.0), 0.0, 1.0), stars_threshold) * stars_exposure;
        stars *= mix(0.4, 1.4, noise(stars_direction * 100.0 + vec3(iTime)));
        
        fragColor = vec4(vec3(stars),1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) return () => {};

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return () => {};
  }
  gl.useProgram(program);

  // Fullscreen quad
  const vertices = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const iResolution = gl.getUniformLocation(program, "iResolution");
  const iTime = gl.getUniformLocation(program, "iTime");

  let startTime = performance.now();

  function render() {
    const time = (performance.now() - startTime) / 1000;

    gl.uniform2f(iResolution, canvas.width, canvas.height);
    gl.uniform1f(iTime, time);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animationFrameId = requestAnimationFrame(render);
  }

  render();

  return () => {
    window.removeEventListener("resize", resize);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("shader4-canvas");
    if (canvas) {
      initStarfieldBackground(canvas);
    }
  });
}
