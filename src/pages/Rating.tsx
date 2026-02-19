import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const flavorAxes = [
  { key: "sweetness", label: "甘さ", emoji: "🍯" },
  { key: "acidity", label: "酸味", emoji: "🍋" },
  { key: "bitterness", label: "苦味", emoji: "🍫" },
  { key: "body", label: "濃さ", emoji: "☕" },
] as const;

const ratingLabels = ["", "うーん", "まあまあ", "いい感じ", "かなり好き", "最高の一杯"];

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [showFlavor, setShowFlavor] = useState(false);
  const [flavors, setFlavors] = useState({ sweetness: 3, acidity: 3, bitterness: 3, body: 3 });
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const wasDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.add("dark");
    return () => { if (!wasDark) document.documentElement.classList.remove("dark"); };
  }, []);

  const handleSave = useCallback(() => {
    if (rating === 0) return;
    setSaved(true);
    setTimeout(() => navigate(-1), 1600);
  }, [rating, navigate]);

  if (saved) {
    return (
      <div className="min-h-screen max-w-md mx-auto flex items-center justify-center" style={{ background: "#121212" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
            className="text-4xl"
          >
            ☕
          </motion.div>
          <p className="text-white/60 text-sm tracking-wider" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            記録しました
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col" style={{ background: "#121212" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-14 pb-2">
        <div className="w-8" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/20" style={{ fontFamily: "Inter, sans-serif" }}>
          評価
        </span>
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full text-white/25 hover:text-white/50 transition-colors">
          <X size={15} strokeWidth={1.5} />
        </button>
      </header>

      {/* Question */}
      <section className="px-8 pt-12 pb-2 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-[22px] font-light text-white/90 leading-[1.6] tracking-wide"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          この一杯、
          <br />
          どうだった？
        </motion.h1>
      </section>

      {/* Rating dots */}
      <section className="px-8 pt-16 pb-4">
        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = n <= rating;
            return (
              <motion.button
                key={n}
                onClick={() => setRating(n === rating ? 0 : n)}
                whileTap={{ scale: 0.85 }}
                className="relative w-11 h-11 rounded-full focus:outline-none"
                style={{
                  background: active
                    ? "linear-gradient(145deg, #E07A5F, #c4624a)"
                    : "rgba(255,255,255,0.04)",
                  boxShadow: active
                    ? "0 0 20px rgba(224,122,95,0.25), inset 0 1px 1px rgba(255,255,255,0.15)"
                    : "inset 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                <motion.div
                  initial={false}
                  animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-white text-[13px] font-medium">{n}</span>
                </motion.div>
                {!active && (
                  <span className="absolute inset-0 flex items-center justify-center text-white/10 text-[13px]">{n}</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Rating label */}
        <div className="h-8 flex items-center justify-center mt-4">
          <AnimatePresence mode="wait">
            {rating > 0 && (
              <motion.p
                key={rating}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-[13px] text-white/40 tracking-wider"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {ratingLabels[rating]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Flavor section */}
      <section className="px-6 mt-8 flex-1">
        <button
          onClick={() => setShowFlavor(!showFlavor)}
          className="w-full flex items-center justify-center gap-2 py-3 group"
        >
          <span className="text-[11px] text-white/20 group-hover:text-white/30 tracking-wider transition-colors" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            味の記録
          </span>
          <motion.span
            animate={{ rotate: showFlavor ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-white/15 text-[10px]"
          >
            ▼
          </motion.span>
        </button>

        <AnimatePresence>
          {showFlavor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-6 space-y-5">
                {flavorAxes.map(({ key, label, emoji }) => {
                  const val = flavors[key];
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] text-white/30 tracking-wider" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                          {emoji} {label}
                        </span>
                        <span className="text-[10px] text-white/15 tabular-nums">{val}</span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <motion.button
                            key={level}
                            onClick={() => setFlavors((p) => ({ ...p, [key]: level }))}
                            whileTap={{ scale: 0.9 }}
                            className="flex-1 h-[6px] rounded-full transition-all duration-300"
                            style={{
                              background: level <= val
                                ? `rgba(224,122,95,${0.25 + level * 0.15})`
                                : "rgba(255,255,255,0.04)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Save */}
      <section className="px-8 pb-12 pt-4">
        <motion.button
          onClick={handleSave}
          disabled={rating === 0}
          whileTap={rating > 0 ? { scale: 0.97 } : {}}
          className="w-full py-4 rounded-2xl text-[13px] tracking-wider transition-all duration-300"
          style={
            rating > 0
              ? {
                  background: "linear-gradient(145deg, #E07A5F, #b8584a)",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(224,122,95,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }
              : {
                  background: "transparent",
                  color: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }
          }
        >
          保存する
        </motion.button>
      </section>
    </div>
  );
};

export default Rating;
