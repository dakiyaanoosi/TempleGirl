// Shader Background - Raw WebGL Implementation (Sanatani Pink & Sandalwood Brown Theme) with Codrops Gooey Cursor Mask Texture

export function initShaderBackground(canvas) {
  if (!canvas) return () => {};

  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true });
  if (!gl) {
    console.error("WebGL not supported");
    return () => {};
  }

  let animationFrameId;

  // Offscreen 2D canvas for Codrops cell grid
  const maskCanvas = document.createElement("canvas");
  const maskCtx = maskCanvas.getContext("2d");

  // WebGL texture for mask
  const maskTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, maskTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const columns = 28;
  let cellSize = 0;
  let rows = 0;
  let totalCells = 0;
  let cellOpacities = new Float32Array(0);

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    cellSize = window.innerWidth / columns;
    rows = Math.ceil(window.innerHeight / cellSize);
    totalCells = rows * columns;

    maskCanvas.width = columns * 10;
    maskCanvas.height = rows * 10;

    cellOpacities = new Float32Array(totalCells);
  };
  resize();
  window.addEventListener("resize", resize);

  let cachedCol = -1;
  let cachedRow = -1;

  const onMove = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    if (x === undefined && e.touches && e.touches[0]) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    if (x === undefined) return;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (col >= 0 && col < columns && row >= 0 && row < rows) {
      if (col !== cachedCol || row !== cachedRow) {
        cachedCol = col;
        cachedRow = row;
        const idx = row * columns + col;
        cellOpacities[idx] = 1.0;
      }
    }
  };

  window.addEventListener("mousemove", onMove);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });

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
    uniform sampler2D uMaskTex;

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
      vec3 softBlushPink=vec3(245.0,160.0,188.0)/255.;  // Soft Illuminated Petal Pink

      float cycle=sin(iTime*.4);
      float t=(sign(cycle)*pow(abs(cycle),.6)+1.)/2.;

      vec3 color1=mix(lotusPink,gulalPink,t);
      vec3 color2=mix(sandalwoodBrown,darkMahogany,t);
      vec3 color3=mix(terracotta,copperBronze,t);
      vec3 color4=mix(saffronGold,softBlushPink,t);

      vec3 layer1=mix(color3,color2,smoothstep(-.3,.2,(tuv*Rot(radians(-5.))).x));
      vec3 layer2=mix(color4,color1,smoothstep(-.3,.2,(tuv*Rot(radians(-5.))).x));

      vec3 color=mix(layer1,layer2,smoothstep(.5,-.3,tuv.y));

      color=color-filmGrainNoise(uv)*filmGrainIntensity;

      // Codrops Gooey Filter on mask texture
      vec2 maskUV = vec2(uv.x, 1.0 - uv.y);

      float blur = 0.0;
      vec2 texel = vec2(1.0 / iResolution.x, 1.0 / iResolution.y) * 6.0;
      for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
          vec2 offset = vec2(float(x), float(y)) * texel;
          blur += texture2D(uMaskTex, maskUV + offset).r;
        }
      }
      blur /= 25.0;

      // Codrops feColorMatrix thresholding: (blur * 22.0 - 7.5)
      float gooey = clamp(blur * 22.0 - 7.5, 0.0, 1.0);

      // Subtle warm rim glow along gooey edge
      float rim = smoothstep(0.1, 0.5, gooey) * (1.0 - smoothstep(0.5, 0.9, gooey));
      color += vec3(0.95, 0.65, 0.35) * rim * 0.4;

      float alpha = clamp(1.0 - gooey, 0.0, 1.0);

      fragColor = vec4(color * alpha, alpha);
    }

    void main(){
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;

  function compile(type, source) {
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

  const program = gl.createProgram();
  const vertShader = compile(gl.VERTEX_SHADER, vertexShaderSource);
  const fragShader = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertShader || !fragShader) return () => {};

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
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
  const uMaskTexLoc = gl.getUniformLocation(program, "uMaskTex");

  let startTime = performance.now();
  let lastTime = performance.now();

  function render() {
    const now = performance.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    // Decay cell opacities (Codrops TTL & fade)
    for (let i = 0; i < totalCells; i++) {
      if (cellOpacities[i] > 0) {
        cellOpacities[i] = Math.max(0, cellOpacities[i] - dt * 2.2);
      }
    }

    // Draw active cells onto offscreen 2D maskCanvas
    maskCtx.fillStyle = "#000000";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const op = cellOpacities[r * columns + c];
        if (op > 0) {
          maskCtx.fillStyle = `rgba(255, 255, 255, ${op})`;
          maskCtx.fillRect(c * 10, r * 10, 10, 10);
        }
      }
    }

    // Upload mask canvas to WebGL texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, maskTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskCanvas);

    gl.uniform2f(iResolution, canvas.width, canvas.height);
    gl.uniform1f(iTime, (now - startTime) / 1000);
    gl.uniform1i(uMaskTexLoc, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animationFrameId = requestAnimationFrame(render);
  }

  render();

  return () => {
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("touchmove", onMove);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}

// Fallback DOMContentLoaded execution if loaded directly via script tag
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("shader6-canvas");
    if (canvas) {
      initShaderBackground(canvas);
    }
  });
}
