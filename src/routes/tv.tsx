import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SCRIPT.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

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
      <header className="relative z-10 flex items-center justify-between px-10 pt-8">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Live · Khutbah Translation
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-border bg-card/80 px-4 py-2 shadow-sm backdrop-blur">
          <img src={logo.url} alt="Aalim" className="h-9 w-9 object-contain" />
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-tight text-primary">
              Aalim
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Live Translate
            </div>
          </div>
        </div>
      </header>

      {/* Translation stack */}
      {/* Translation stack */}
      <section className="relative z-10 mx-auto flex min-h-[78vh] max-w-5xl flex-col items-center justify-center gap-5 px-10 text-center">
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
                    ? "max-w-4xl text-balance text-6xl font-bold leading-[1.15] tracking-tight text-foreground"
                    : "max-w-3xl text-balance text-3xl font-medium leading-snug text-muted-foreground"
                }
              >
                {seg.en}
              </motion.p>
            );
          })}
        </AnimatePresence>
      </section>

      {/* QR section */}
      <aside className="fixed bottom-8 right-8 z-20 flex items-center gap-4 rounded-2xl bg-primary p-4 pr-6 text-primary-foreground shadow-[0_20px_60px_-25px_oklch(0.38_0.11_155/0.55)]">
        <div className="rounded-lg bg-white p-2">
          <QRCodeSVG
            value="https://aalim.app/live"
            size={110}
            fgColor="#0a0a0a"
            bgColor="#ffffff"
            level="M"
          />
        </div>
        <div className="max-w-[120px]">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] opacity-95">
            <span aria-hidden>🎧</span>
            <span>Listen on</span>
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-95">
            Your Phone
          </div>
        </div>
      </aside>
    </main>
  );
}
