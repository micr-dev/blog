import {
  DEFAULT_SCYTHE_ROTATION,
  DEFAULT_SCYTHE_SCALE,
  DEFAULT_TITLE_SCALE,
  ogLayout,
  type OgPreviewTheme,
} from "@/lib/og";
import { PreviewCard } from "@/app/og-preview/preview-card";

const GALLERY_SCALE = 0.28;

interface PreviewCardData {
  id: string;
  label: string;
  title: string;
  note?: string;
  theme: OgPreviewTheme;
  assets: {
    logo: string;
    scythe: string;
  };
}

export function PreviewControls({
  cards,
}: {
  cards: PreviewCardData[];
}) {
  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Locked preview values
          </p>
          <p className="text-sm text-zinc-300">
            Title scale: <span className="font-semibold text-zinc-100">{DEFAULT_TITLE_SCALE.toFixed(2)}x</span>
          </p>
          <p className="text-sm text-zinc-300">
            Scythe scale: <span className="font-semibold text-zinc-100">{DEFAULT_SCYTHE_SCALE.toFixed(2)}x</span>
          </p>
          <p className="text-sm text-zinc-300">
            Scythe rotation: <span className="font-semibold text-zinc-100">{DEFAULT_SCYTHE_ROTATION}deg</span>
          </p>
          <p className="text-sm text-zinc-300">
            Title line separation: <span className="font-semibold text-zinc-100">3px</span>
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <section key={card.id} className="space-y-3 rounded-xl border border-zinc-800 bg-black/20 p-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-zinc-200">
                {card.label}
              </div>
              {card.note ? (
                <p className="text-xs text-zinc-500">
                  {card.note}
                </p>
              ) : null}
            </div>

            <div
              className="overflow-visible rounded-lg border border-zinc-800 bg-black/40"
              style={{
                width: ogLayout.width * GALLERY_SCALE,
                height: ogLayout.height * GALLERY_SCALE,
              }}
            >
              <div
                style={{
                  transform: `scale(${GALLERY_SCALE})`,
                  transformOrigin: "top left",
                  width: ogLayout.width,
                  height: ogLayout.height,
                }}
              >
                <PreviewCard
                  title={card.title}
                  theme={card.theme}
                  logoSrc={card.assets.logo}
                  scytheSrc={card.assets.scythe}
                />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
