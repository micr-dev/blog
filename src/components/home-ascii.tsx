const HOME_ASCII: {
  blockWidth: number;
  gutterToStrip: number;
  fontSizeRem: number;
  lineHeight: number;
  scaleX: number;
  offsetX: number;
} = {
  blockWidth: 1200,
  gutterToStrip: 0,
  fontSizeRem: 0.6,
  lineHeight: 0.8,
  scaleX: 1,
  offsetX: 0,
};

function normalizeAscii(ascii: string, gutterToStrip: number) {
  return ascii
    .split(/\r?\n/)
    .map((line) => {
      const visibleStart = line.search(/\S|$/);
      return line.slice(Math.min(visibleStart, gutterToStrip));
    })
    .join("\n");
}

export function HomeAscii({ ascii }: { ascii: string }) {
  const normalizedAscii = normalizeAscii(ascii, HOME_ASCII.gutterToStrip);

  return (
    <div className="mb-6 flex justify-center overflow-visible">
      <div
        className="flex w-full justify-center overflow-hidden"
        style={{ maxWidth: `${HOME_ASCII.blockWidth}px` }}
      >
        <pre
          className="ascii-art"
          style={{
            width: `${HOME_ASCII.blockWidth}px`,
            maxWidth: "none",
            fontSize: `clamp(0.18rem, 0.62vw, ${HOME_ASCII.fontSizeRem}rem)`,
            lineHeight: String(HOME_ASCII.lineHeight),
            transform: `translateX(${HOME_ASCII.offsetX}%) scaleX(${HOME_ASCII.scaleX})`,
          }}
        >
          {normalizedAscii}
        </pre>
      </div>
    </div>
  );
}
