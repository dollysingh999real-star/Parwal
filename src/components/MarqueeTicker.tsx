import { SERVICES_LIST } from '../data/firmData';

export default function MarqueeTicker() {
  const tickerText = SERVICES_LIST.map((s) => s.name).join(' \u2726 ') + ' \u2726 ';

  return (
    <div
      data-testid="gold-marquee-ticker"
      aria-label="Practice areas"
      className="relative z-10 w-full h-[64px] bg-[#C9A227] text-[#0F2A43] overflow-hidden flex items-center select-none"
    >
      <div className="flex whitespace-nowrap animate-marquee-30s will-change-transform">
        <span className="font-extrabold uppercase text-[20px] md:text-[28px] tracking-[0.04em] pr-4">
          {tickerText}
        </span>
        <span
          aria-hidden="true"
          className="font-extrabold uppercase text-[20px] md:text-[28px] tracking-[0.04em] pr-4"
        >
          {tickerText}
        </span>
        <span
          aria-hidden="true"
          className="font-extrabold uppercase text-[20px] md:text-[28px] tracking-[0.04em] pr-4"
        >
          {tickerText}
        </span>
        <span
          aria-hidden="true"
          className="font-extrabold uppercase text-[20px] md:text-[28px] tracking-[0.04em] pr-4"
        >
          {tickerText}
        </span>
      </div>
    </div>
  );
}
