import { useState, useEffect } from "react";
import { ChevronLeft, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrewLogCard, { type BrewLogEntry } from "@/components/BrewLogCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

const filterSections = [
  {
    title: "評価",
    key: "rating",
    options: ["★1以上", "★2以上", "★3以上", "★4以上", "★5のみ"],
  },
  {
    title: "TPS",
    key: "tps",
    options: ["80以上", "70〜79", "70未満"],
  },
  {
    title: "豆の種類",
    key: "bean",
    options: ["エチオピア", "グアテマラ", "ブラジル", "コロンビア", "ケニア"],
  },
  {
    title: "湯温",
    key: "temp",
    options: ["90℃以上", "85〜89℃", "85℃未満"],
  },
  {
    title: "味の傾向",
    key: "taste",
    options: ["苦味", "甘味", "酸味", "濃さ"],
  },
];

const BrewHistory = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const wasDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.add("dark");
    return () => {
      if (!wasDark) document.documentElement.classList.remove("dark");
    };
  }, []);

  const toggleFilter = (key: string, option: string) => {
    setActiveFilters((prev) => {
      const current = prev[key] || [];
      const next = current.includes(option)
        ? current.filter((x) => x !== option)
        : [...current, option];
      return { ...prev, [key]: next };
    });
  };

  const activeCount = Object.values(activeFilters).flat().length;

  const clearFilters = () => setActiveFilters({});

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
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground/40 hover:text-muted-foreground transition-colors">
            <ArrowUpDown size={15} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setFilterOpen(true)}
            className="relative w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          >
            <SlidersHorizontal size={15} strokeWidth={1.5} />
            {activeCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] flex items-center justify-center font-medium">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Log list */}
      <div className="px-6 pt-3 pb-10 space-y-4">
        {mockData.map((entry) => (
          <BrewLogCard
            key={entry.id}
            entry={entry}
            onClick={() => navigate(`/history/${entry.id}`)}
          />
        ))}
      </div>

      {/* Filter Modal */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-[calc(100%-3rem)] rounded-2xl border-border/40 bg-card p-0 gap-0">
          <DialogHeader className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <DialogTitle
                className="text-[14px] font-semibold text-primary"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                フィルター
              </DialogTitle>
              {activeCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  すべてクリア
                </button>
              )}
            </div>
            <DialogDescription className="sr-only">抽出ログのフィルター設定</DialogDescription>
          </DialogHeader>

          <div className="px-5 pb-5 space-y-5 max-h-[60vh] overflow-y-auto">
            {filterSections.map((section) => (
              <div key={section.key}>
                <p
                  className="text-[11px] text-muted-foreground mb-2"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {section.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {section.options.map((option) => {
                    const active = (activeFilters[section.key] || []).includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => toggleFilter(section.key, option)}
                        className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${
                          active
                            ? "border-accent text-primary"
                            : "border-border/40 text-muted-foreground bg-transparent"
                        }`}
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 pb-5">
            <button
              onClick={() => setFilterOpen(false)}
              className="w-full py-2.5 rounded-xl border border-border/40 text-[13px] text-primary font-medium transition-colors hover:bg-secondary"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              適用する
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrewHistory;
