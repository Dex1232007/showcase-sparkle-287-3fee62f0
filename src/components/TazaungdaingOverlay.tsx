import { useEffect, useRef } from "react";

interface Lantern {
  x: number; y: number; size: number; speed: number;
  drift: number; glow: number; glowDir: number; opacity: number;
  hue: number; swayPhase: number;
}

export default function TazaungdaingOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const LANTERN_COUNT = 25;
    const lanterns: Lantern[] = Array.from({ length: LANTERN_COUNT }, () => spawnLantern(canvas));

    function spawnLantern(c: HTMLCanvasElement, fromBottom = false): Lantern {
      return {
        x: Math.random() * c.width,
        y: fromBottom ? c.height + 30 + Math.random() * 60 : Math.random() * c.height,
        size: 8 + Math.random() * 12,
        speed: -(0.2 + Math.random() * 0.5), // float upward
        drift: (Math.random() - 0.5) * 0.2,
        glow: 0.5 + Math.random() * 0.5,
        glowDir: Math.random() > 0.5 ? 1 : -1,
        opacity: 0.4 + Math.random() * 0.4,
        hue: 20 + Math.random() * 30, // warm orange-yellow
        swayPhase: Math.random() * Math.PI * 2,
      };
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const l of lanterns) {
        l.y += l.speed;
        l.x += l.drift + Math.sin(l.swayPhase) * 0.15;
        l.swayPhase += 0.008;

        // Glow pulse
        l.glow += l.glowDir * 0.008;
        if (l.glow > 1) { l.glow = 1; l.glowDir = -1; }
        if (l.glow < 0.4) { l.glow = 0.4; l.glowDir = 1; }

        // Reset when off top
        if (l.y < -50) {
          Object.assign(l, spawnLantern(canvas, true));
        }

        ctx.save();
        ctx.globalAlpha = l.opacity;

        // Outer glow
        const outerGlow = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.size * 3 * l.glow);
        outerGlow.addColorStop(0, `hsla(${l.hue}, 90%, 60%, ${0.3 * l.glow})`);
        outerGlow.addColorStop(0.5, `hsla(${l.hue}, 80%, 50%, ${0.1 * l.glow})`);
        outerGlow.addColorStop(1, `hsla(${l.hue}, 70%, 40%, 0)`);
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.size * 3 * l.glow, 0, Math.PI * 2);
        ctx.fill();

        // Lantern body (rounded rectangle shape)
        const w = l.size * 0.8;
        const h = l.size * 1.2;
        ctx.beginPath();
        ctx.moveTo(l.x - w, l.y - h * 0.3);
        ctx.quadraticCurveTo(l.x - w * 1.1, l.y + h * 0.5, l.x, l.y + h * 0.7);
        ctx.quadraticCurveTo(l.x + w * 1.1, l.y + h * 0.5, l.x + w, l.y - h * 0.3);
        ctx.quadraticCurveTo(l.x + w * 0.5, l.y - h * 0.5, l.x, l.y - h * 0.4);
        ctx.quadraticCurveTo(l.x - w * 0.5, l.y - h * 0.5, l.x - w, l.y - h * 0.3);
        ctx.closePath();

        const bodyGrad = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.size);
        bodyGrad.addColorStop(0, `hsla(${l.hue}, 95%, 70%, 0.9)`);
        bodyGrad.addColorStop(1, `hsla(${l.hue + 10}, 80%, 45%, 0.7)`);
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // Inner flame
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.size * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(50, 100%, 90%, ${0.6 + l.glow * 0.4})`;
        ctx.fill();

        // Top string
        ctx.beginPath();
        ctx.moveTo(l.x, l.y - h * 0.4);
        ctx.lineTo(l.x, l.y - h * 0.7);
        ctx.strokeStyle = `hsla(${l.hue}, 40%, 50%, 0.3)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <>
      {/* Dark night sky tint */}
      <div className="fixed inset-0 z-[90] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(10,10,30,0.3) 0%, rgba(20,15,40,0.2) 50%, rgba(10,10,25,0.15) 100%)",
        }}
      />
      <canvas ref={canvasRef} className="fixed inset-0 z-[100] pointer-events-none" />
    </>
  );
}
