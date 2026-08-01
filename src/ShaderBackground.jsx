import { useEffect, useRef } from "react";
import { initShaderBackground } from "../background.js";

export default function ShaderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = initShaderBackground(canvasRef.current);
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return <canvas id="shader6-canvas" ref={canvasRef} />;
}
