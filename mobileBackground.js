// Mobile Shader Background - Optimized WebGL Implementation for Mobile Screens (<768px)
// Renders the animated film-grained Sanatani Pink & Sandalwood Brown fluid gradient.

export function initMobileShaderBackground(canvas) {
  if (!canvas) return () => {};

  const gl = canvas.getContext("webgl", { alpha: false, powerPreference: "low-power" }) ||
             canvas.getContext("experimental-webgl", { alpha: false, powerPreference: "low-power" });
  if (!gl) {
    console.error("WebGL not supported on mobile");
    return () => {};
  }

  let animationFrameId = null;
  let isContextLost = false;
  let currentWidth = 0;
  let currentHeight = 0;

  const resize = () => {
    if (isContextLost) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const newWidth = Math.floor(window.innerWidth * dpr);
    const newHeight = Math.floor(window.innerHeight * dpr);

    // Ignore tiny height changes caused by mobile address bar collapse/expansion during vertical scroll
    if (Math.abs(newWidth - currentWidth) > 5 || Math.abs(newHeight - currentHeight) > 100 || currentWidth === 0) {
      currentWidth = newWidth;
      currentHeight = newHeight;
      canvas.width = newWidth;
      canvas.height = newHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
  };
  resize();
  window.addEventListener("resize", resize);

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

    // Bounded hash function preventing 16-bit half-float mantissa overflow on mobile GPUs (Adreno / Mali)
    vec2 hash(vec2 p){
      p = mod(p, 10000.0);
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453);
    }

    float noise(in vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);

      float n = mix(
        mix(dot(-1. + 2. * hash(i + vec2(0,0)), f - vec2(0,0)),
            dot(-1. + 2. * hash(i + vec2(1,0)), f - vec2(1,0)), u.x),
        mix(dot(-1. + 2. * hash(i + vec2(0,1)), f - vec2(0,1)),
            dot(-1. + 2. * hash(i + vec2(1,1)), f - vec2(1,1)), u.x),
        u.y);
      return .5 + .5 * n;
    }

    // Animated film grain seed eliminates static burn-in / "dirty screen" marks on mobile OLED screens
    float filmGrainNoise(in vec2 uv, in float time){
      return length(hash(uv * 1000.0 + vec2(mod(time * 10.0, 100.0), mod(time * 7.0, 100.0))));
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord){
      vec2 uv = fragCoord / iResolution.xy;

      // Isotropic coordinate normalization tailored for portrait mobile screens (<768px)
      vec2 tuv = (fragCoord - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);

      // Bounded animation time input
      float tTime = mod(iTime, 3600.0);

      float degree = noise(vec2(tTime * .04, tuv.x * tuv.y));

      tuv *= Rot(radians((degree - .5) * 720. + 180.));

      float frequency = 4.5;
      float amplitude = 25.;
      float speed = tTime * 1.8;
      tuv.x += sin(tuv.y * frequency + speed) / amplitude;
      tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * .5);

      // Sanatani Lotus, Sandalwood & Terracotta color palette (Pink & Brown Theme)
      vec3 lotusPink = vec3(236.0, 102.0, 148.0) / 255.;     // Radiant Lotus / Gulal Pink
      vec3 sandalwoodBrown = vec3(54.0, 28.0, 24.0) / 255.;   // Deep Sandalwood & Earth Brown
      vec3 terracotta = vec3(188.0, 88.0, 54.0) / 255.;       // Warm Clay Terracotta
      vec3 saffronGold = vec3(238.0, 152.0, 48.0) / 255.;     // Sacred Saffron Gold Glow

      vec3 gulalPink = vec3(225.0, 65.0, 125.0) / 255.;      // Rich Kumkum / Gulal Pink
      vec3 darkMahogany = vec3(36.0, 16.0, 14.0) / 255.;      // Deep Temple Mahogany
      vec3 copperBronze = vec3(158.0, 72.0, 42.0) / 255.;     // Copper Bronze Earth
      vec3 softBlushPink = vec3(245.0, 160.0, 188.0) / 255.;  // Soft Illuminated Petal Pink

      float cycle = sin(tTime * .4);
      float t = (sign(cycle) * pow(abs(cycle), .6) + 1.) / 2.;

      vec3 color1 = mix(lotusPink, gulalPink, t);
      vec3 color2 = mix(sandalwoodBrown, darkMahogany, t);
      vec3 color3 = mix(terracotta, copperBronze, t);
      vec3 color4 = mix(saffronGold, softBlushPink, t);

      vec3 layer1 = mix(color3, color2, smoothstep(-.4, .4, (tuv * Rot(radians(-5.))).x));
      vec3 layer2 = mix(color4, color1, smoothstep(-.4, .4, (tuv * Rot(radians(-5.))).x));

      vec3 color = mix(layer1, layer2, smoothstep(.6, -.4, tuv.y));

      // Apply animated film grain
      color = color - filmGrainNoise(uv, tTime) * filmGrainIntensity;

      fragColor = vec4(color, 1.0);
    }

    void main(){
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;

  function compile(type, source) {
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

  const program = gl.createProgram();
  const vertShader = compile(gl.VERTEX_SHADER, vertexShaderSource);
  const fragShader = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertShader || !fragShader) return () => {};

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Mobile Program Link Error:", gl.getProgramInfoLog(program));
    return () => {};
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1, 1,-1, -1,1, 1,1
  ]), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const iResolution = gl.getUniformLocation(program, "iResolution");
  const iTime = gl.getUniformLocation(program, "iTime");

  let startTime = performance.now();

  function render() {
    if (isContextLost) return;
    if (!document.hidden) {
      const time = (performance.now() - startTime) / 1000;
      gl.uniform2f(iResolution, canvas.width, canvas.height);
      gl.uniform1f(iTime, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    animationFrameId = requestAnimationFrame(render);
  }

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      startTime = performance.now() - ((performance.now() - startTime));
    }
  };

  const handleContextLost = (e) => {
    e.preventDefault();
    isContextLost = true;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  const handleContextRestored = () => {
    isContextLost = false;
    startTime = performance.now();
    render();
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  canvas.addEventListener("webglcontextlost", handleContextLost, false);
  canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

  render();

  return () => {
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    canvas.removeEventListener("webglcontextlost", handleContextLost);
    canvas.removeEventListener("webglcontextrestored", handleContextRestored);

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    if (gl && !gl.isContextLost()) {
      if (buffer) gl.deleteBuffer(buffer);
      if (vertShader) {
        gl.detachShader(program, vertShader);
        gl.deleteShader(vertShader);
      }
      if (fragShader) {
        gl.detachShader(program, fragShader);
        gl.deleteShader(fragShader);
      }
      if (program) gl.deleteProgram(program);
    }
  };
}
