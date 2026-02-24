import { useState, useEffect } from "react";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrewLogCard, { type BrewLogEntry } from "@/components/BrewLogCard";

const mockData: BrewLogEntry[] = [
  {
    id: "1",
    date: "2/24",
    time: "08:30",
    beanName: "エチオピア イルガチェフェ",
    roast: "浅煎",
    rating: 4,
    tps: 85,
    tpsDiff: 7,
    brewTime: "2:30",
    temp: 92,
    grind: 8,
    status: "improved",
    changes: [{ label: "抽出時間", diff: "+6秒" }],
  },
  {
    id: "2",
    date: "2/23",
    time: "07:45",
    beanName: "グアテマラ アンティグア",
    roast: "中煎",
    rating: 3,
    tps: 78,
    tpsDiff: 0,
    brewTime: "3:10",
    temp: 90,
    grind: 7,
    status: "stable",
    changes: [],
  },
  {
    id: "3",
    date: "2/22",
    time: "09:00",
    beanName: "ブラジル サントス",
    roast: "深煎",
    rating: 2,
    tps: 72,
    tpsDiff: -5,
    brewTime: "3:40",
    temp: 88,
    grind: 6,
    status: "declined",
    changes: [{ label: "湯温", diff: "-1℃" }, { label: "抽出時間", diff: "+15秒" }],
  },
  {
    id: "4",
    date: "2/21",
    time: "08:15",
    beanName: "コロンビア ウイラ",
    roast: "中煎",
    rating: 5,
    tps: 91,
    tpsDiff: 4,
    brewTime: "2:45",
    temp: 91,
    grind: 8,
    status: "improved",
    changes: [{ label: "挽き目", diff: "+1" }],
  },
  {
    id: "5",
    date: "2/20",
    time: "07:30",
    beanName: "ケニア AA",
    roast: "浅煎",
    rating: null,
    tps: 68,
    tpsDiff: 0,
    brewTime: "3:00",
    temp: 93,
    grind: 9,
    status: "unrated",
    changes: [],
  },
];

const filterChips = ["期間", "★4以上", "★5のみ", "豆", "器具", "湯温", "挽き目"];

const BrewHistory = () => {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    const wasDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.add("dark");
    return () => {
      if (!wasDark) document.documentElement.classList.remove("dark");
    };
  }, []);

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-14 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <span
          className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          抽出ログ
        </span>
        <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground/40 hover:text-muted-foreground transition-colors">
          <SlidersHorizontal size={15} strokeWidth={1.5} />
        </button>
      </header>

      {/* Filter chips */}
      <div className="px-6 pt-3 pb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filterChips.map((chip) => {
            const active = activeFilters.includes(chip);
            return (
              <button
                key={chip}
                onClick={() => toggleFilter(chip)}
                className={`flex-shrink-0 text-[12px] px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "border-accent text-primary"
                    : "border-border/40 text-muted-foreground bg-transparent"
                }`}
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Log list */}
      <div className="px-6 pb-10 space-y-4">
        {mockData.map((entry) => (
          <BrewLogCard
            key={entry.id}
            entry={entry}
            onClick={() => navigate(`/history/${entry.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default BrewHistory;
