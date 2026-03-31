import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Petal {
  x: number; y: number; size: number; speed: number;
  drift: number; rotation: number; rotSpeed: number; opacity: number;
  blur: number; swayPhase: number; swayAmp: number;
}

// Wind state for gentle direction changes
const wind = { x: 0, target: 0, timer: 0 };

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

    // Limit to 40 petals for performance
    const PETAL_COUNT = 40;
    const petals: Petal[] = Array.from({ length: PETAL_COUNT }, () => spawnPetal(canvas));

    function spawnPetal(c: HTMLCanvasElement, fromTop = false): Petal {
      const size = 3 + Math.random() * 7;
      const depth = Math.random(); // 0 = far, 1 = close
      return {
        x: Math.random() * c.width,
        y: fromTop ? -20 - Math.random() * 60 : Math.random() * c.height,
        size: size * (0.5 + depth * 0.5),
        speed: 0.3 + depth * 0.6 + Math.random() * 0.3,
        drift: (Math.random() - 0.5) * 0.3,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 3, // random rotation while falling
        opacity: 0.2 + depth * 0.5,
        blur: (1 - depth) * 2, // distant = more blur
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: 0.3 + Math.random() * 0.5,
      };
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update wind slowly
      wind.timer -= 0.016;
      if (wind.timer <= 0) {
        wind.target = (Math.random() - 0.5) * 0.8;
        wind.timer = 3 + Math.random() * 5;
      }
      wind.x += (wind.target - wind.x) * 0.005;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speed;
        p.x += p.drift + wind.x + Math.sin(p.swayPhase) * p.swayAmp;
        p.swayPhase += 0.015 + Math.random() * 0.005;
        p.rotation += p.rotSpeed;

        // Reset when off screen
        if (p.y > canvas.height + 30 || p.x > canvas.width + 40 || p.x < -40) {
          Object.assign(p, spawnPetal(canvas, true));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        // Apply blur for distant petals
        if (p.blur > 0.5) {
          ctx.filter = `blur(${p.blur}px)`;
        }

        // Padauk petal: golden yellow with subtle variation
        const hue = 42 + (i % 5);
        const lightness = 55 + (i % 3) * 4;

        // Main petal ellipse
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue}, 90%, ${lightness}%)`;
        ctx.fill();

        // Cross petal
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.45, p.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue - 2}, 85%, ${lightness + 3}%)`;
        ctx.fill();

        // Tiny center dot
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue + 5}, 80%, ${lightness + 15}%)`;
        ctx.fill();

        ctx.filter = "none";
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

      {/* Glassmorphism frame border */}
      <div className="fixed inset-0 z-[98] pointer-events-none"
        style={{
          border: "1px solid rgba(255, 220, 100, 0.15)",
          boxShadow: "inset 0 0 80px rgba(250, 204, 21, 0.05)",
        }}
      />
    </>
  );
}
