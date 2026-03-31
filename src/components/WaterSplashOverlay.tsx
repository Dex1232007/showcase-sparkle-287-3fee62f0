import { useEffect, useRef } from "react";

interface Drop {
  x: number; y: number; vy: number; size: number; opacity: number; splashed: boolean;
  splashRadius: number; splashOpacity: number; ripples: number;
}

export default function WaterSplashOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const MAX_DROPS = 30;
    const drops: Drop[] = [];

    function spawnDrop(): Drop {
      return {
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        vy: 4 + Math.random() * 6,
        size: 2 + Math.random() * 3,
        opacity: 0.4 + Math.random() * 0.4,
        splashed: false,
        splashRadius: 0,
        splashOpacity: 0.6,
        ripples: 2 + Math.floor(Math.random() * 2),
      };
    }

    for (let i = 0; i < MAX_DROPS; i++) {
      const d = spawnDrop();
      d.y = Math.random() * canvas.height; // scatter initially
      drops.push(d);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const d of drops) {
        if (!d.splashed) {
          // Falling drop
          d.y += d.vy;
          ctx.globalAlpha = d.opacity;

          // Elongated water drop
          ctx.beginPath();
          ctx.ellipse(d.x, d.y, d.size * 0.6, d.size * 2, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(120, 200, 255, 0.7)";
          ctx.fill();

          // Highlight
          ctx.beginPath();
          ctx.ellipse(d.x - d.size * 0.15, d.y - d.size * 0.5, d.size * 0.2, d.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
          ctx.fill();

          // Hit ground area (bottom 30%)
          if (d.y > canvas.height * 0.7 + Math.random() * canvas.height * 0.3) {
            d.splashed = true;
            d.splashRadius = 0;
            d.splashOpacity = 0.5;
          }
        } else {
          // Splash ripple animation
          d.splashRadius += 1.5;
          d.splashOpacity *= 0.97;

          for (let r = 0; r < d.ripples; r++) {
            const radius = d.splashRadius + r * 8;
            ctx.globalAlpha = d.splashOpacity * (1 - r * 0.3);
            ctx.beginPath();
            ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(120, 200, 255, 0.5)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Small splash droplets
          if (d.splashRadius < 15) {
            for (let s = 0; s < 4; s++) {
              const angle = (s / 4) * Math.PI * 2 + d.x;
              const dist = d.splashRadius * 0.8;
              ctx.globalAlpha = d.splashOpacity;
              ctx.beginPath();
              ctx.arc(
                d.x + Math.cos(angle) * dist,
                d.y - Math.abs(Math.sin(angle)) * dist * 0.5,
                1.5, 0, Math.PI * 2
              );
              ctx.fillStyle = "rgba(180, 220, 255, 0.7)";
              ctx.fill();
            }
          }

          // Reset when splash fades
          if (d.splashOpacity < 0.02) {
            Object.assign(d, spawnDrop());
          }
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <>
      {/* Water-themed tint */}
      <div className="fixed inset-0 z-[90] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(120,200,255,0.08) 0%, rgba(60,150,220,0.12) 100%)",
        }}
      />
      <canvas ref={canvasRef} className="fixed inset-0 z-[100] pointer-events-none" style={{ mixBlendMode: "screen" }} />
    </>
  );
}
