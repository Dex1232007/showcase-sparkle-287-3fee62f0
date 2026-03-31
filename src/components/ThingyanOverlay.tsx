import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Petal {
  x: number; y: number; size: number; speed: number;
  drift: number; rotation: number; rotSpeed: number; opacity: number;
}

function FallingPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const petals: Petal[] = Array.from({ length: 35 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      size: 4 + Math.random() * 8,
      speed: 0.4 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 0.6,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      opacity: 0.3 + Math.random() * 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of petals) {
        p.y += p.speed;
        p.x += p.drift + Math.sin(p.y * 0.01) * 0.3;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas.width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        // Draw petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${42 + Math.random() * 5}, 90%, ${55 + Math.random() * 10}%)`;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${40 + Math.random() * 5}, 85%, ${58 + Math.random() * 10}%)`;
        ctx.fill();

        ctx.restore();
      }
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[99] pointer-events-none" />;
}

const floatAnimation = (delay: number, x: number, y: number) => ({
  animate: {
    y: [0, y, 0],
    x: [0, x, 0],
    rotate: [0, 3, -2, 0],
  },
  transition: {
    duration: 6 + delay,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: delay * 0.5,
  },
});

export default function ThingyanOverlay() {
  return (
    <>
      {/* Sky blue gradient background */}
      <div className="fixed inset-0 z-[90] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, hsl(204 90% 85%) 0%, hsl(204 80% 92%) 50%, hsl(200 70% 95%) 100%)",
          opacity: 0.4,
        }}
      />

      {/* Falling petals canvas */}
      <FallingPetals />

      {/* Corner flower decorations */}
      {/* Top-left */}
      <motion.div
        className="fixed top-0 left-0 z-[101] pointer-events-none"
        {...floatAnimation(0, 5, -8)}
      >
        <img
          src="/images/padauk-corner.png"
          alt=""
          className="w-28 sm:w-40 md:w-52 opacity-80"
          style={{ transform: "rotate(180deg) scaleX(-1)" }}
        />
      </motion.div>

      {/* Top-right */}
      <motion.div
        className="fixed top-0 right-0 z-[101] pointer-events-none"
        {...floatAnimation(1, -5, -6)}
      >
        <img
          src="/images/padauk-corner.png"
          alt=""
          className="w-28 sm:w-40 md:w-52 opacity-80"
          style={{ transform: "rotate(180deg)" }}
        />
      </motion.div>

      {/* Bottom-right */}
      <motion.div
        className="fixed bottom-0 right-0 z-[101] pointer-events-none"
        {...floatAnimation(2, -4, 7)}
      >
        <img
          src="/images/padauk-corner.png"
          alt=""
          className="w-32 sm:w-44 md:w-56 opacity-85"
        />
      </motion.div>

      {/* Bottom-left */}
      <motion.div
        className="fixed bottom-0 left-0 z-[101] pointer-events-none"
        {...floatAnimation(3, 6, 5)}
      >
        <img
          src="/images/padauk-corner.png"
          alt=""
          className="w-32 sm:w-44 md:w-56 opacity-85"
          style={{ transform: "scaleX(-1)" }}
        />
      </motion.div>

      {/* Glassmorphism frame border effect */}
      <div className="fixed inset-0 z-[98] pointer-events-none"
        style={{
          border: "1px solid rgba(255, 220, 100, 0.15)",
          boxShadow: "inset 0 0 80px rgba(250, 204, 21, 0.05)",
          borderRadius: "0",
        }}
      />
    </>
  );
}
