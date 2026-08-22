// Shader Background - Production-Ready WebGL Desktop Implementation
// (Sanatani Pink & Sandalwood Brown Theme)

export function initShaderBackground(canvas) {
  if (!canvas) return () => {};

  const glOptions = {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    powerPreference: "default",
    preserveDrawingBuffer: false,
  };

  const gl =
    canvas.getContext("webgl", glOptions) ||
    canvas.getContext("experimental-webgl", glOptions);

  if (!gl) {
    console.error("Desktop Shader: WebGL not supported");
    return () => {};
  }

  // State Variables
  let animationFrameId = null;
  let isContextLost = false;
  let isCleanedUp = false;
  let isIntersecting = true;
  let observer = null;
  let currentWidth = 0;
  let currentHeight = 0;

  // GPU Resource Handles
  let program = null;
  let vertShader = null;
  let fragShader = null;
  let positionBuffer = null;

  // Attribute & Uniform Locations
  let positionLocation = -1;
  let iResolutionLocation = null;
  let iTimeLocation = null;

  // Timing State
  let accumulatedTime = 0;
  let lastFrameTime = performance.now();

  const vertexShaderSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    uniform vec2 iResolution;
    uniform float iTime;

    #define filmGrainIntensity 0.08

    mat2 Rot(float a){
      float s = sin(a);
      float c = cos(a);
      return mat2(c,-s,s,c);
    }

    vec2 hash(vec2 p){
      p = vec2(dot(p, vec2(2127.1,81.17)), dot(p, vec2(1269.5,283.37)));
      return fract(sin(p)*43758.5453);
    }

    float noise(in vec2 p){
      vec2 i=floor(p);
      vec2 f=fract(p);
      vec2 u=f*f*(3.0-2.0*f);

      float n=mix(
        mix(dot(-1.+2.*hash(i+vec2(0,0)),f-vec2(0,0)),
            dot(-1.+2.*hash(i+vec2(1,0)),f-vec2(1,0)),u.x),
        mix(dot(-1.+2.*hash(i+vec2(0,1)),f-vec2(0,1)),
            dot(-1.+2.*hash(i+vec2(1,1)),f-vec2(1,1)),u.x),
        u.y);
      return .5+.5*n;
    }

    float filmGrainNoise(in vec2 uv){
      return length(hash(vec2(uv.x,uv.y)));
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord){
      vec2 uv=fragCoord/iResolution.xy;
      float aspectRatio=iResolution.x/iResolution.y;

      vec2 tuv=uv-.5;

      float degree=noise(vec2(iTime*.04,tuv.x*tuv.y));

      tuv.y*=1./aspectRatio;
      tuv*=Rot(radians((degree-.5)*720.+180.));
      tuv.y*=aspectRatio;

      float frequency=6.;
      float amplitude=25.;
      float speed=iTime*1.8;
      tuv.x+=sin(tuv.y*frequency+speed)/amplitude;
      tuv.y+=sin(tuv.x*frequency*1.5+speed)/(amplitude*.5);

      // Sanatani Lotus, Sandalwood & Terracotta color palette (Pink & Brown Theme)
      vec3 lotusPink=vec3(236.0,102.0,148.0)/255.;     // Radiant Lotus / Gulal Pink
      vec3 sandalwoodBrown=vec3(54.0,28.0,24.0)/255.;   // Deep Sandalwood & Earth Brown
      vec3 terracotta=vec3(188.0,88.0,54.0)/255.;       // Warm Clay Terracotta
      vec3 saffronGold=vec3(238.0,152.0,48.0)/255.;     // Sacred Saffron Gold Glow

      vec3 gulalPink=vec3(225.0,65.0,125.0)/255.;      // Rich Kumkum / Gulal Pink
      vec3 darkMahogany=vec3(36.0,16.0,14.0)/255.;      // Deep Temple Mahogany
      vec3 copperBronze=vec3(158.0,72.0,42.0)/255.;     // Copper Bronze Earth
      vec3 deepRose=vec3(169.0,81.0,115.0)/255.;      // Deep Rose / Wine Pink  

      float cycle=sin(iTime*.4);
      float t=(sign(cycle)*pow(abs(cycle),.6)+1.)/2.;

      vec3 color1=mix(lotusPink,gulalPink,t);
      vec3 color2=mix(sandalwoodBrown,darkMahogany,t);
      vec3 color3=mix(terracotta,copperBronze,t);
      vec3 color4=mix(saffronGold,deepRose,t);

      vec3 layer1=mix(color3,color2,smoothstep(-.3,.2,(tuv*Rot(radians(-5.))).x));
      vec3 layer2=mix(color4,color1,smoothstep(-.3,.2,(tuv*Rot(radians(-5.))).x));

      vec3 color=mix(layer1,layer2,smoothstep(.5,-.3,tuv.y));

      color=color-filmGrainNoise(uv)*filmGrainIntensity;

      fragColor=vec4(color,1.0);
    }

    void main(){
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;

  // Safely cleanup GPU objects without throwing errors
  function cleanupGPUResources() {
    if (!gl) return;

    try {
      const contextIsLost = gl.isContextLost();

      if (positionBuffer && !contextIsLost) {
        gl.deleteBuffer(positionBuffer);
      }
      positionBuffer = null;

      if (program && !contextIsLost) {
        if (vertShader) {
          gl.detachShader(program, vertShader);
          gl.deleteShader(vertShader);
        }
        if (fragShader) {
          gl.detachShader(program, fragShader);
          gl.deleteShader(fragShader);
        }
        gl.deleteProgram(program);
      } else {
        if (vertShader && !contextIsLost) gl.deleteShader(vertShader);
        if (fragShader && !contextIsLost) gl.deleteShader(fragShader);
      }

      program = null;
      vertShader = null;
      fragShader = null;
      positionLocation = -1;
      iResolutionLocation = null;
      iTimeLocation = null;
    } catch (err) {
      console.warn("Desktop Shader: Error during GPU resource cleanup", err);
    }
  }

  // Shader Compiler Helper
  function compileShader(type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Desktop Shader Compile Error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  // Complete WebGL Resource Creation (used on initial setup and context restoration)
  function setupWebGLResources() {
    cleanupGPUResources();

    if (gl.isContextLost()) return false;

    vertShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    fragShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertShader || !fragShader) {
      cleanupGPUResources();
      return false;
    }

    program = gl.createProgram();
    if (!program) {
      cleanupGPUResources();
      return false;
    }

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Desktop Shader Link Error:", gl.getProgramInfoLog(program));
      cleanupGPUResources();
      return false;
    }

    gl.useProgram(program);

    positionBuffer = gl.createBuffer();
    if (!positionBuffer) {
      cleanupGPUResources();
      return false;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    positionLocation = gl.getAttribLocation(program, "position");
    if (positionLocation < 0) {
      console.error("Desktop Shader: Failed to get position attribute location");
      cleanupGPUResources();
      return false;
    }

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    iTimeLocation = gl.getUniformLocation(program, "iTime");

    if (!iResolutionLocation || !iTimeLocation) {
      console.error("Desktop Shader: Failed to get uniform locations");
      cleanupGPUResources();
      return false;
    }

    // Reset dimensions to force viewport calculation for the new context
    currentWidth = 0;
    currentHeight = 0;
    resize();

    return true;
  }

  // Resize Handler matching exact desktop window resolution
  const resize = () => {
    if (isContextLost || isCleanedUp || !gl) return;

    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    if (newWidth !== currentWidth || newHeight !== currentHeight || currentWidth === 0) {
      currentWidth = newWidth;
      currentHeight = newHeight;
      canvas.width = newWidth;
      canvas.height = newHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
  };

  // Render Loop with 60 FPS throttling for high-refresh desktop monitors
  const TARGET_FPS = 60;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;
  let lastRenderTimestamp = performance.now();

  function render(timestamp) {
    if (isCleanedUp || isContextLost || !isIntersecting) return;

    animationFrameId = requestAnimationFrame(render);

    if (document.hidden) return;

    const elapsed = (timestamp || performance.now()) - lastRenderTimestamp;
    if (elapsed < FRAME_INTERVAL - 1.0) return;

    lastRenderTimestamp = (timestamp || performance.now()) - (elapsed % FRAME_INTERVAL);

    const now = performance.now();
    const rawDelta = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    // Cap delta at 0.1s to prevent jumps if tab/frame was stalled
    const cappedDelta = Math.max(0, Math.min(rawDelta, 0.1));
    accumulatedTime += cappedDelta;

    const MAX_ACCUMULATED_TIME = Math.PI * 200;
    if (accumulatedTime >= MAX_ACCUMULATED_TIME) {
      accumulatedTime %= MAX_ACCUMULATED_TIME;
    }

    if (gl && program) {
      gl.useProgram(program);
      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(iTimeLocation, accumulatedTime);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  function stopAnimationLoop() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function startAnimationLoop() {
    stopAnimationLoop();
    if (!isIntersecting) return;
    lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(render);
  }

  // Event Handlers
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // Re-anchor lastFrameTime so returning from hidden tab doesn't produce time delta spike
      lastFrameTime = performance.now();
      if (isIntersecting && !isContextLost && !isCleanedUp && animationFrameId === null) {
        startAnimationLoop();
      }
    } else {
      stopAnimationLoop();
    }
  };

  const handleContextLost = (e) => {
    e.preventDefault();
    isContextLost = true;
    stopAnimationLoop();
  };

  const handleContextRestored = () => {
    isContextLost = false;
    if (setupWebGLResources()) {
      startAnimationLoop();
    } else {
      console.error("Desktop Shader: Failed to restore WebGL resources.");
    }
  };

  // Initial Setup
  if (!setupWebGLResources()) {
    return () => {};
  }

  if (typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = entry ? entry.isIntersecting : true;
        if (visible !== isIntersecting) {
          isIntersecting = visible;
          if (isIntersecting) {
            startAnimationLoop();
          } else {
            stopAnimationLoop();
          }
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);
  }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  canvas.addEventListener("webglcontextlost", handleContextLost, false);
  canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

  startAnimationLoop();

  // Robust, Safe Cleanup Function
  return () => {
    if (isCleanedUp) return;
    isCleanedUp = true;

    stopAnimationLoop();

    if (observer) {
      observer.disconnect();
      observer = null;
    }

    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    canvas.removeEventListener("webglcontextlost", handleContextLost);
    canvas.removeEventListener("webglcontextrestored", handleContextRestored);

    cleanupGPUResources();
  };
}
