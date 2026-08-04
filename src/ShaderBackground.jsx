import { useEffect, useRef } from "react";
import { initShaderBackground } from "../background.js";
import { initStarfieldBackground } from "../background2.jsx";

export default function ShaderBackground() {
  const primaryCanvasRef = useRef(null);
  const starfieldCanvasRef = useRef(null);

  useEffect(() => {
    let cleanupPrimary = null;
    let cleanupStarfield = null;

    if (starfieldCanvasRef.current) {
      cleanupStarfield = initStarfieldBackground(starfieldCanvasRef.current);
    }
    if (primaryCanvasRef.current) {
      cleanupPrimary = initShaderBackground(primaryCanvasRef.current);
    }

    return () => {
      if (cleanupPrimary) cleanupPrimary();
      if (cleanupStarfield) cleanupStarfield();
    };
  }, []);

  return (
    <>
      <canvas id="shader4-canvas" ref={starfieldCanvasRef} />
      <canvas id="shader6-canvas" ref={primaryCanvasRef} />
    </>
  );
}
