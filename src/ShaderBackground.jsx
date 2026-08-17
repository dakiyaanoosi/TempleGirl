import { useEffect, useRef } from "react";
import { initShaderBackground } from "../background.js";
import { initMobileShaderBackground } from "../mobileBackground.js";

export default function ShaderBackground() {
  const primaryCanvasRef = useRef(null);

  useEffect(() => {
    let cleanup = null;

    const setupBackground = () => {
      if (cleanup) {
        cleanup();
        cleanup = null;
      }

      if (!primaryCanvasRef.current) return;

      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        cleanup = initMobileShaderBackground(primaryCanvasRef.current);
      } else {
        cleanup = initShaderBackground(primaryCanvasRef.current);
      }
    };

    setupBackground();

    let wasMobile = window.innerWidth < 768;
    const handleResize = () => {
      const isMobileNow = window.innerWidth < 768;
      if (isMobileNow !== wasMobile) {
        wasMobile = isMobileNow;
        setupBackground();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (cleanup) cleanup();
    };
  }, []);

  return <canvas id="shader6-canvas" ref={primaryCanvasRef} />;
}
