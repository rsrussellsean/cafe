const words = [
  "Coffee",
  "Cakes",
  "Donuts",
  "Handcrafted",
  "Brewed Fresh",
  "Baked with Love",
];

export default function Marquee({
  reverse = false,
  className = "",
}: {
  reverse?: boolean;
  className?: string;
}) {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-6 font-display text-3xl italic md:text-5xl">
            {w}
          </span>
          <span className="text-caramel">✺</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`overflow-hidden border-y border-ink/15 py-5 ${className}`}
      aria-hidden
    >
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
