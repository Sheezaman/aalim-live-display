import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Maximize2, Minimize2, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import logo from "@/assets/aalim-logo.png.asset.json";

export const Route = createFileRoute("/tv")({
  head: () => ({
    meta: [
      { title: "Aalim — Live Khutbah Translation" },
      {
        name: "description",
        content:
          "Live multilingual Khutbah translation display for mosques, powered by Aalim.",
      },
      { property: "og:title", content: "Aalim — Live Khutbah Translation" },
      {
        property: "og:description",
        content:
          "Live multilingual Khutbah translation display for mosques, powered by Aalim.",
      },
    ],
  }),
  component: TvPage,
});

type Segment = { id: number; ar: string; en: string };

const SCRIPT: Segment[] = [
  {
    id: 1,
    ar: "أيها الإخوة الكرام، إن من نعم الله علينا أن نعيش في بلد آمن ومستقر",
    en: "Dear brothers, one of the blessings of Allah upon us is that we live in a safe and stable country.",
  },
  {
    id: 2,
    ar: "نسأل الله أن يحفظ عُمان وأهلها وأن يديم علينا الأمن والسلام",
    en: "We ask Allah to protect Oman and its people and continue blessing us with safety and peace.",
  },
  {
    id: 3,
    ar: "وعلينا أن نحافظ على الأخلاق الحسنة والتعاون والمحبة بين الناس",
    en: "We should maintain good manners, cooperation, and kindness between people.",
  },
  {
    id: 4,
    ar: "فالخير ينتشر عندما يساعد الإنسان أخاه ويعمل لما فيه منفعة المجتمع",
    en: "Goodness spreads when people help one another and work for the benefit of society.",
  },
  {
    id: 5,
    ar: "اللهم اجعلنا من عبادك الصالحين، واهدنا سواء السبيل",
    en: "O Allah, make us among Your righteous servants and guide us to the straight path.",
  },
];

const MAX_VISIBLE = 3;
const INTERVAL_MS = 5500;

function TvPage() {
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SCRIPT.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const increaseSize = () => setScale((s) => Math.min(s + 0.15, 2));
  const decreaseSize = () => setScale((s) => Math.max(s - 0.15, 0.5));

  // Derived sizes from scale (base = current default)
  const currentSize = 2.25 * scale;   // rem: text-4xl ≈ 36px at default
  const prevSize = 1.5 * scale;       // rem: text-2xl ≈ 24px at default
  const lineGap = 1.5 * scale;        // rem: gap-6 ≈ 24px at default
  const currentLeading = Math.max(1.15, 1.2 - (scale - 1) * 0.05);
  const prevLeading = Math.max(1.25, 1.375 - (scale - 1) * 0.05);

  // Build the visible stack: oldest first, current last.
  const visible: Segment[] = [];
  for (let offset = MAX_VISIBLE - 1; offset >= 0; offset--) {
    const i = index - offset;
    if (i >= 0) visible.push(SCRIPT[i % SCRIPT.length]);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1200px 600px at 15% -10%, oklch(0.95 0.05 150 / 0.7), transparent 60%), radial-gradient(900px 500px at 110% 110%, oklch(0.93 0.06 155 / 0.6), transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 grid grid-cols-3 items-center px-16 pt-12">
        <div className="flex items-center gap-4 justify-self-start">
          <img
            src={logo.url}
            alt="Aalim"
            className="h-16 w-16 object-contain"
          />
          <span className="text-3xl font-semibold tracking-tight text-primary">
            Aalim
          </span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
          <span className="text-lg font-semibold uppercase tracking-[0.28em] text-primary">
            Live
          </span>
        </div>
        <div className="flex items-center gap-3 justify-self-end">
          <div className="flex items-center gap-1 rounded-full border border-border bg-card/80 px-1 py-1 shadow-sm backdrop-blur">
            <button
              type="button"
              onClick={decreaseSize}
              aria-label="Decrease text size"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-foreground transition hover:bg-primary/10 hover:text-primary"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums text-foreground">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={increaseSize}
              aria-label="Increase text size"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-foreground transition hover:bg-primary/10 hover:text-primary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-5 py-2.5 text-base font-medium text-foreground shadow-sm backdrop-blur transition hover:border-primary/40 hover:text-primary"
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
            <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </button>
        </div>
      </header>

      {/* Translation stack */}
      <section className="relative z-10 mx-auto flex min-h-[78vh] max-w-[1400px] flex-col items-center justify-center gap-6 px-20 pb-48 text-center">
        <AnimatePresence initial={false}>
          {visible.map((seg, i) => {
            const isCurrent = i === visible.length - 1;
            const depth = visible.length - 1 - i; // 0 current, 1 prev, 2 oldest
            return (
              <motion.p
                key={seg.id}
                layout
                initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                animate={{
                  opacity: isCurrent ? 1 : depth === 1 ? 0.42 : 0.2,
                  y: 0,
                  filter: "blur(0px)",
                }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={
                  isCurrent
                    ? "max-w-[1200px] text-balance text-4xl font-bold leading-[1.2] tracking-tight text-foreground"
                    : "max-w-[1000px] text-balance text-2xl font-medium leading-snug text-muted-foreground"
                }
              >
                {seg.en}
              </motion.p>
            );
          })}
        </AnimatePresence>
      </section>

      {/* QR section */}
      <aside className="fixed bottom-8 right-8 z-20 flex items-center gap-4 rounded-2xl bg-primary p-3 pr-5 text-primary-foreground shadow-[0_20px_60px_-25px_oklch(0.38_0.11_155/0.55)]">
        <div className="rounded-lg bg-white p-2">
          <QRCodeSVG
            value="https://aalim.app/live"
            size={104}
            fgColor="#0a0a0a"
            bgColor="#ffffff"
            level="M"
          />
        </div>
        <div className="max-w-[140px]">
          <div className="text-xs font-semibold uppercase leading-tight tracking-[0.14em] opacity-95">
            Translate to My Language
          </div>
        </div>
      </aside>
    </main>
  );
}
