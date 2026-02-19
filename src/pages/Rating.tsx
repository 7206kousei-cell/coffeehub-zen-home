import { useState, useEffect } from "react";
import { Star, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useNavigate } from "react-router-dom";

const axes = [
  { key: "sweetness", label: "甘さ" },
  { key: "acidity", label: "酸味" },
  { key: "bitterness", label: "苦味" },
  { key: "body", label: "濃さ" },
] as const;

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [sliders, setSliders] = useState({ sweetness: 50, acidity: 50, bitterness: 50, body: 50 });
  const [tappedStar, setTappedStar] = useState<number | null>(null);
  const navigate = useNavigate();

  // Force dark mode on this screen
  useEffect(() => {
    const wasDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.add("dark");
    return () => {
      if (!wasDark) document.documentElement.classList.remove("dark");
    };
  }, []);

  const handleStarTap = (star: number) => {
    setRating(star);
    setTappedStar(star);
    setTimeout(() => setTappedStar(null), 300);
  };

  return (
    <div
      className="min-h-screen max-w-md mx-auto relative flex flex-col"
      style={{ background: "#121212" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-5 pb-2">
        <div className="flex items-center gap-1.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E07A5F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full text-white/40 hover:text-white/70 transition-colors"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </header>

      {/* Title */}
      <section className="px-6 pt-10 pb-3 text-center">
        <h1
          className="text-[22px] font-light tracking-tight text-white leading-snug"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          今回の一杯は
          <br />
          どうでしたか？
        </h1>
      </section>

      {/* Subtext */}
      <p className="text-center text-sm text-white/35 mb-12" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
        直感でOKです。
      </p>

      {/* Star Rating */}
      <section className="flex justify-center gap-4 px-6 mb-14">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hoveredStar || rating);
          const isTapped = tappedStar === star;
          return (
            <motion.button
              key={star}
              onClick={() => handleStarTap(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              animate={isTapped ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="focus:outline-none"
              aria-label={`${star} star`}
            >
              <Star
                size={36}
                strokeWidth={1.2}
                className={`transition-colors duration-200 ${
                  filled ? "fill-[#E07A5F] text-[#E07A5F]" : "fill-transparent text-white/20"
                }`}
              />
            </motion.button>
          );
        })}
      </section>

      {/* Save Button */}
      <section className="px-8 mb-12">
        <motion.button
          disabled={rating === 0}
          whileTap={rating > 0 ? { scale: 0.95 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={`w-full py-4 rounded-2xl text-[15px] font-medium tracking-wide transition-all duration-300 ${
            rating > 0
              ? "text-white shadow-lg"
              : "bg-white/8 text-white/20 cursor-not-allowed"
          }`}
          style={
            rating > 0
              ? { background: "#E07A5F", boxShadow: "0 8px 30px rgba(224,122,95,0.25)" }
              : {}
          }
        >
          保存して次へ
        </motion.button>
      </section>

      {/* Collapsible Detail Rating */}
      <section className="px-6 mt-auto pb-10">
        <Collapsible open={detailOpen} onOpenChange={setDetailOpen}>
          <CollapsibleTrigger className="flex items-center justify-center gap-2 w-full py-3 text-white/30 hover:text-white/50 transition-colors">
            <span className="text-sm" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              味を詳しく記録する（任意）
            </span>
            <motion.span
              animate={{ rotate: detailOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDown size={16} strokeWidth={1.5} />
            </motion.span>
          </CollapsibleTrigger>

          <AnimatePresence>
            {detailOpen && (
              <CollapsibleContent forceMount>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 pb-2 space-y-7">
                    {axes.map(({ key, label }) => (
                      <div key={key} className="space-y-3">
                        <span
                          className="text-sm text-white/50 block text-center"
                          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                        >
                          {label}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-white/25 w-6 text-right">低</span>
                          <div className="flex-1 rating-slider">
                            <Slider
                              value={[sliders[key]]}
                              onValueChange={(v) =>
                                setSliders((prev) => ({ ...prev, [key]: v[0] }))
                              }
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          <span className="text-xs text-white/25 w-6">高</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </CollapsibleContent>
            )}
          </AnimatePresence>
        </Collapsible>
      </section>
    </div>
  );
};

export default Rating;
