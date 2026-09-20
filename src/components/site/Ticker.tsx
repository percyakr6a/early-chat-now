const ITEMS = ["Student-led", "Research-oriented", "Politics-free", "Open to all MBBS batches"];

export function Ticker() {
  const row = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-navy bg-lime py-3">
      <div className="ticker-track flex w-max items-center gap-10 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-10">
            {row.map((item, i) => (
              <span key={`${copy}-${i}`} className="label-mono flex items-center gap-4 text-navy">
                <span aria-hidden>+</span>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
