import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

export default function HeroSlider() {
  const { sliderSlides } = useSiteSettings();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const slides = sliderSlides.length > 0 ? sliderSlides : null;

  const next = useCallback(() => {
    if (!slides) return;
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides]);

  const prev = useCallback(() => {
    if (!slides) return;
    setDirection(-1);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides]);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides]);

  if (!slides || slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-muted">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -80 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {(slide.title || slide.description) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                <div className="text-center text-white px-6 max-w-2xl">
                  {slide.title && (
                    <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">{slide.title}</h2>
                  )}
                  {slide.description && (
                    <p className="text-sm sm:text-base text-white/85 drop-shadow-md">{slide.description}</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/60 backdrop-blur flex items-center justify-center hover:bg-background/90 transition-colors active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/60 backdrop-blur flex items-center justify-center hover:bg-background/90 transition-colors active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-white w-8" : "bg-white/50 hover:bg-white/70"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
