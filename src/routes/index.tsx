import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aalim — Live Khutbah Translation" },
      { name: "description", content: "Premium live multilingual translation for mosques. Open the TV display for live khutbah." },
      { property: "og:title", content: "Aalim — Live Khutbah Translation" },
      { property: "og:description", content: "Premium live multilingual translation for mosques." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-primary">Aalim</h1>
        <p className="mt-3 text-muted-foreground">
          Live multilingual Khutbah translation for mosques.
        </p>
        <a
          href="/tv"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Open TV Display
        </a>
      </div>
    </div>
  );
}

