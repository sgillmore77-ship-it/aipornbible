/** Text-based wordmark: red "AI" tile + condensed "PORN BIBLE". */
export function Logo({ size = "md", inverted = false }: { size?: "sm" | "md"; inverted?: boolean }) {
  const sm = size === "sm";
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span
        className={`grid place-items-center bg-red font-black text-white ${sm ? "size-[30px] rounded-[6px] text-[13px]" : "size-[34px] rounded-[7px] text-[15px]"}`}
        style={{ fontStretch: "90%" }}
      >
        AI
      </span>
      <span
        className={`font-black uppercase tracking-[-0.01em] ${sm ? "text-[19px]" : "text-[22px]"} ${inverted ? "text-[#F3F3F5]" : "text-ink"}`}
        style={{ fontStretch: "78%" }}
      >
        Porn Bible
      </span>
    </span>
  );
}
