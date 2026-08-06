import { useEffect, useRef } from "react";
import { initShaderBackground } from "../background.js";

export default function ShaderBackground() {
  const primaryCanvasRef = useRef(null);

  useEffect(() => {
    let cleanupPrimary = null;

    if (primaryCanvasRef.current) {
      cleanupPrimary = initShaderBackground(primaryCanvasRef.current);
    }

    return () => {
      if (cleanupPrimary) cleanupPrimary();
    };
  }, []);

  return <canvas id="shader6-canvas" ref={primaryCanvasRef} />;
}
