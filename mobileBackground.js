// Mobile Shader Background - Production-Ready WebGL Implementation (<768px)
// Renders the smooth animated Sanatani Pink & Sandalwood Brown fluid gradient without film grain distortion.

export function initMobileShaderBackground(canvas) {
  if (!canvas) return () => {};

  // 1. Rendering Configuration Constants
  const TARGET_FPS = 30;
  const FRAME_INTERVAL = 1000 / TARGET_FPS; // ~33.33ms per frame
  const MAX_DPR = 1.25;
  const RENDER_SCALE = 0.8;
  const MAX_ACCUMULATED_TIME = Math.PI * 20000; // Safe upper bound for accumulated animation time

  // 2. WebGL Context Initialization Options
  const glOptions = {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  };

  const gl =
    canvas.getContext("webgl", glOptions) ||
    canvas.getContext("experimental-webgl", glOptions);

  if (!gl) {
    console.error("Mobile Shader: WebGL not supported");
    return () => {};
  }

  // 3. State Variables
  let animationFrameId = null;
  let isContextLost = false;
  let isCleanedUp = false;
  let currentWidth = 0;
  let currentHeight = 0;

  // GPU Resource State Handles
  let program = null;
  let vertShader = null;
  let fragShader = null;
  let positionBuffer = null;

  // Uniform & Attribute Locations
  let positionLocation = -1;
  let iResolutionLocation = null;
  let iTimeLocation = null;

  // Timing State
  let accumulatedTime = 0;
  let lastFrameTime = performance.now();
  let lastRenderTimestamp = 0;

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

    mat2 Rot(float a){
      float s = sin(a);
      float c = cos(a);
      return mat2(c, -s, s, c);
    }

    // Sine-less, bounded 2D hash for improved numerical stability on mobile GPUs with limited floating-point precision
    vec2 hash(vec2 p){
      p = mod(p, 100.0);
      vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.xx + p3.yz) * p3.zy);
    }

    float noise(in vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);

      float n = mix(
        mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y);
      return 0.5 + 0.5 * n;
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord){
      // Isotropic coordinate normalization tailored for mobile screen aspect ratios
      vec2 tuv = (fragCoord - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);

      float TWO_PI = 6.28318530718;

      // Rotation noise angle over bounded time
      float degree = noise(vec2(mod(iTime * 0.04, 100.0), tuv.x * tuv.y));

      tuv *= Rot(radians((degree - 0.5) * 720.0 + 180.0));

      float frequency = 4.5;
      float amplitude = 25.0;
      
      // Bounded wave speed input with calm, elegant fluid movement (~0.7)
      float speed = mod(iTime * 0.7, TWO_PI);

      tuv.x += sin(tuv.y * frequency + speed) / amplitude;
      tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * 0.5);

      // Sanatani Lotus, Sandalwood & Terracotta color palette (Pink & Brown Theme)
      vec3 lotusPink = vec3(236.0, 102.0, 148.0) / 255.0;     // Radiant Lotus / Gulal Pink
      vec3 sandalwoodBrown = vec3(54.0, 28.0, 24.0) / 255.0;   // Deep Sandalwood & Earth Brown
      vec3 terracotta = vec3(188.0, 88.0, 54.0) / 255.0;       // Warm Clay Terracotta
      vec3 saffronGold = vec3(238.0, 152.0, 48.0) / 255.0;     // Sacred Saffron Gold Glow

      vec3 gulalPink = vec3(225.0, 65.0, 125.0) / 255.0;      // Rich Kumkum / Gulal Pink
      vec3 darkMahogany = vec3(36.0, 16.0, 14.0) / 255.0;      // Deep Temple Mahogany
      vec3 copperBronze = vec3(158.0, 72.0, 42.0) / 255.0;     // Copper Bronze Earth
      vec3 deepRose = vec3(169.0,81.0,115.0)/255.;      // Deep Rose / Wine Pink 

      float cycle = sin(mod(iTime * 0.4, TWO_PI));
      float t = (sign(cycle) * pow(abs(cycle), 0.6) + 1.0) / 2.0;

      vec3 color1 = mix(lotusPink, gulalPink, t);
      vec3 color2 = mix(sandalwoodBrown, darkMahogany, t);
      vec3 color3 = mix(terracotta, copperBronze, t);
      vec3 color4 = mix(saffronGold, deepRose, t);

      // Cached rotated layer coordinates to avoid redundant matrix-vector multiplication
      vec2 layerUV = tuv * Rot(radians(-5.0));
      float layerX = layerUV.x;

      vec3 layer1 = mix(color3, color2, smoothstep(-0.4, 0.4, layerX));
      vec3 layer2 = mix(color4, color1, smoothstep(-0.4, 0.4, layerX));

      vec3 color = mix(layer1, layer2, smoothstep(0.6, -0.4, tuv.y));

      fragColor = vec4(color, 1.0);
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
      console.warn("Mobile Shader: Error during GPU resource cleanup", err);
    }
  }

  // Shader Compiler Helper
  function compileShader(type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Mobile Shader Compile Error:", gl.getShaderInfoLog(shader));
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
      console.error("Mobile Shader Link Error:", gl.getProgramInfoLog(program));
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
      console.error("Mobile Shader: Failed to get position attribute location");
      cleanupGPUResources();
      return false;
    }

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    iTimeLocation = gl.getUniformLocation(program, "iTime");

    if (!iResolutionLocation || !iTimeLocation) {
      console.error("Mobile Shader: Failed to get uniform locations");
      cleanupGPUResources();
      return false;
    }

    // Reset dimensions to force viewport calculation for the new context
    currentWidth = 0;
    currentHeight = 0;
    resize();

    return true;
  }

  // Resize Handler with DPR and Render Scaling
  const resize = () => {
    if (isContextLost || isCleanedUp || !gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const newWidth = Math.max(1, Math.floor(window.innerWidth * dpr * RENDER_SCALE));
    const newHeight = Math.max(1, Math.floor(window.innerHeight * dpr * RENDER_SCALE));

    // Threshold check (4px render difference) to prevent micro-jitter from mobile scrollbar/address bar changes
    if (
      Math.abs(newWidth - currentWidth) >= 4 ||
      Math.abs(newHeight - currentHeight) >= 4 ||
      currentWidth === 0
    ) {
      currentWidth = newWidth;
      currentHeight = newHeight;
      canvas.width = newWidth;
      canvas.height = newHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
  };

  // Render Loop with ~30 FPS Throttle and Bounded Delta Control
  function render(timestamp) {
    if (isCleanedUp || isContextLost) return;

    animationFrameId = requestAnimationFrame(render);

    if (document.hidden) return;

    const elapsedSinceLastRender = timestamp - lastRenderTimestamp;

    // 30 FPS throttle check (~33.3ms)
    if (elapsedSinceLastRender < FRAME_INTERVAL - 1.0) {
      return;
    }

    // Adjust timestamp to maintain stable interval pacing
    lastRenderTimestamp = timestamp - (elapsedSinceLastRender % FRAME_INTERVAL);

    // Compute smooth time delta
    const now = performance.now();
    const rawDelta = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    // Cap delta at 0.1s to prevent visual time jumps after app suspension
    const cappedDelta = Math.max(0, Math.min(rawDelta, 0.1));
    accumulatedTime += cappedDelta;

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
    lastFrameTime = performance.now();
    lastRenderTimestamp = performance.now();
    animationFrameId = requestAnimationFrame(render);
  }

  // Event Handlers
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // Reset timestamps on tab focus to avoid time delta spikes
      lastFrameTime = performance.now();
      lastRenderTimestamp = performance.now();
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
      console.error("Mobile Shader: Failed to restore WebGL resources.");
    }
  };

  // Initial WebGL Setup
  if (!setupWebGLResources()) {
    return () => {};
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

    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    canvas.removeEventListener("webglcontextlost", handleContextLost);
    canvas.removeEventListener("webglcontextrestored", handleContextRestored);

    cleanupGPUResources();
  };
}
