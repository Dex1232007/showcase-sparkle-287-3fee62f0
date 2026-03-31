import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";

interface Petal {
  x: number; y: number; size: number; speed: number;
  drift: number; rotation: number; rotSpeed: number; opacity: number;
  swayPhase: number; swayAmp: number;
}

function FallingPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let windX = 0, windTarget = 0, windTimer = 0;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const PETAL_COUNT = 25; // reduced for performance

    function spawnPetal(fromTop = false): Petal {
      const depth = Math.random();
      return {
        x: Math.random() * canvas.width,
        y: fromTop ? -15 - Math.random() * 40 : Math.random() * canvas.height,
        size: (2 + Math.random() * 5) * (0.6 + depth * 0.4),
        speed: 0.3 + depth * 0.5 + Math.random() * 0.2,
        drift: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
        opacity: 0.15 + depth * 0.4,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: 0.2 + Math.random() * 0.3,
      };
    }

    const petals: Petal[] = Array.from({ length: PETAL_COUNT }, () => spawnPetal());

    // Pre-compute stable hue/lightness per petal index
    const hues = petals.map((_, i) => 42 + (i % 5));
    const lights = petals.map((_, i) => 55 + (i % 3) * 4);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      windTimer -= 0.016;
      if (windTimer <= 0) {
        windTarget = (Math.random() - 0.5) * 0.6;
        windTimer = 4 + Math.random() * 4;
      }
      windX += (windTarget - windX) * 0.003;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speed;
        p.x += p.drift + windX + Math.sin(p.swayPhase) * p.swayAmp;
        p.swayPhase += 0.012;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 20 || p.x > canvas.width + 30 || p.x < -30) {
          Object.assign(p, spawnPetal(true));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        // No ctx.filter — just use opacity for depth instead (much faster)
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hues[i]}, 90%, ${lights[i]}%)`;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.45, p.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hues[i] - 2}, 85%, ${lights[i] + 3}%)`;
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
  animate: { y: [0, y, 0], x: [0, x, 0] },
  transition: {
    duration: 8 + delay,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: delay * 0.5,
  },
});

export default memo(function ThingyanOverlay() {
  return (
    <>
      <div className="fixed inset-0 z-[90] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, hsl(204 90% 85%) 0%, hsl(204 80% 92%) 50%, hsl(200 70% 95%) 100%)",
          opacity: 0.25,
        }}
      />

      <FallingPetals />

      {/* Smaller corner flowers */}
      <motion.div className="fixed top-0 left-0 z-[101] pointer-events-none" {...floatAnimation(0, 3, -5)}>
        <img src="/images/padauk-corner.png" alt="" className="w-16 sm:w-24 md:w-32 opacity-70" style={{ transform: "rotate(180deg) scaleX(-1)" }} />
      </motion.div>
      <motion.div className="fixed top-0 right-0 z-[101] pointer-events-none" {...floatAnimation(1, -3, -4)}>
        <img src="/images/padauk-corner.png" alt="" className="w-16 sm:w-24 md:w-32 opacity-70" style={{ transform: "rotate(180deg)" }} />
      </motion.div>
      <motion.div className="fixed bottom-0 right-0 z-[101] pointer-events-none" {...floatAnimation(2, -3, 4)}>
        <img src="/images/padauk-corner.png" alt="" className="w-20 sm:w-28 md:w-36 opacity-75" />
      </motion.div>
      <motion.div className="fixed bottom-0 left-0 z-[101] pointer-events-none" {...floatAnimation(3, 4, 3)}>
        <img src="/images/padauk-corner.png" alt="" className="w-20 sm:w-28 md:w-36 opacity-75" style={{ transform: "scaleX(-1)" }} />
      </motion.div>

      <div className="fixed inset-0 z-[98] pointer-events-none"
        style={{ border: "1px solid rgba(255, 220, 100, 0.1)", boxShadow: "inset 0 0 40px rgba(250, 204, 21, 0.03)" }}
      />
    </>
  );
});
