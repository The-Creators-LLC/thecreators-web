import { useEffect, useRef } from "react";

const Stars = ({
  numStars = 200,
  onboardingFlowFinished = false,
  starRadius = 1.5,
  minStarRadius = 0.5,
  hyperspaceActive = false,
}: {
  onboardingFlowFinished?: boolean;
  numStars?: number;
  starRadius?: number;
  minStarRadius?: number;
  hyperspaceActive?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawStar = (x: number, y: number, radius: number) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
    };

    const drawStars = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.max(Math.random() * starRadius, minStarRadius);
        drawStar(x, y, radius);
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawStars();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [numStars, starRadius, minStarRadius]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        transform: onboardingFlowFinished ? "scale(1.5)" : "scale(1)",
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: hyperspaceActive ? 0 : 1,
        transitionProperty: "opacity, transform",
        transition: "opacity 1.5s, transform 1.5s",
        transitionDelay: "0.5s",
      }}
    />
  );
};

export default Stars;
