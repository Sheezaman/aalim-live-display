import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
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
      <header className="relative z-10 grid grid-cols-3 items-center px-4 pt-4 sm:px-8 sm:pt-6 lg:px-12 lg:pt-10">
        <div className="flex items-center gap-3 justify-self-start">
          <img
            src={logo.url}
            alt="Aalim"
            className="h-8 w-8 object-contain sm:h-10 sm:w-10 lg:h-14 lg:w-14"
          />
          <span className="text-base font-semibold tracking-tight text-primary sm:text-lg lg:text-2xl">
            Aalim
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary lg:h-3 lg:w-3" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary sm:text-xs lg:text-base">
            Live
          </span>
        </div>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          className="justify-self-end inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur transition hover:border-primary/40 hover:text-primary sm:px-4 sm:py-2 sm:text-sm lg:px-5 lg:py-2.5 lg:text-base"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4 lg:h-5 lg:w-5" />
          ) : (
            <Maximize2 className="h-4 w-4 lg:h-5 lg:w-5" />
          )}
          <span className="hidden sm:inline">
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </span>
        </button>
      </header>

      {/* Translation stack */}
      <section className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center gap-4 px-6 pb-44 text-center sm:gap-5 sm:px-10 sm:pb-32 lg:gap-8 lg:pb-16">
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
                    ? "max-w-5xl text-balance text-3xl font-bold leading-[1.2] tracking-tight text-foreground sm:text-5xl lg:text-7xl xl:text-8xl"
                    : "max-w-4xl text-balance text-lg font-medium leading-snug text-muted-foreground sm:text-2xl lg:text-4xl"
                }
              >
                {seg.en}
              </motion.p>
            );
          })}
        </AnimatePresence>
      </section>

      {/* QR section */}
      <aside className="fixed bottom-4 right-4 z-20 flex items-center gap-3 rounded-2xl bg-primary p-3 pr-4 text-primary-foreground shadow-[0_20px_60px_-25px_oklch(0.38_0.11_155/0.55)] sm:bottom-6 sm:right-6 sm:gap-4 sm:p-4 sm:pr-6 lg:bottom-10 lg:right-10 lg:gap-5 lg:p-5 lg:pr-7">
        <div className="rounded-lg bg-white p-1.5 sm:p-2 lg:p-2.5">
          <QRCodeSVG
            value="https://aalim.app/live"
            size={72}
            fgColor="#0a0a0a"
            bgColor="#ffffff"
            level="M"
            className="h-[72px] w-[72px] sm:h-[110px] sm:w-[110px] lg:h-[160px] lg:w-[160px]"
          />
        </div>
        <div className="max-w-[110px] sm:max-w-[140px] lg:max-w-[200px]">
          <div className="text-[11px] font-semibold uppercase leading-tight tracking-[0.14em] opacity-95 sm:text-[12px] lg:text-base">
            Translate to My Language
          </div>
        </div>
      </aside>
    </main>
  );
}
