import Link from "next/link";
import { Logo } from "./Logo";
import { publishedCategories } from "@/lib/data";

const COMPANY: [string, string][] = [
  ["/about/", "About us"],
  ["/how-we-review/", "How we review"],
  ["/editorial-policy/", "Editorial policy"],
  ["/advertising/", "Advertise"],
  ["/submit/", "Submit a platform"],
  ["/contact/", "Contact"],
];
const POLICIES: [string, string][] = [
  ["/affiliate-disclosure/", "Affiliate disclosure"],
  ["/sponsored-placements/", "Sponsored placements"],
  ["/privacy/", "Privacy policy"],
  ["/terms/", "Terms of use"],
  ["/privacy/#cookies", "Cookies"],
  ["/content-removal/", "Content removal"],
];

const head = "mb-3.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#9A9AA6]";
const link = "text-[14.5px] text-[#F3F3F5] hover:!text-[oklch(0.7_0.2_22)]";

export function Footer() {
  const cats = publishedCategories();
  return (
    <footer className="bg-[#111114] text-[#F3F3F5]">
      <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-12 lg:px-10 lg:pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1.6fr_0.8fr_0.8fr] lg:gap-12">
          <div>
            <Link href="/" aria-label="AI Porn Bible home"><Logo inverted /></Link>
            <p className="mt-4 max-w-[320px] text-[14.5px] leading-[1.55] text-[#9A9AA6]">
              An independent directory of AI porn platforms. We list, test and rate. We don&apos;t host explicit content.
            </p>
            <p className="mt-5 flex items-center gap-2.5 text-[13px] text-[#9A9AA6]">
              <span className="inline-flex h-6 items-center rounded-[5px] border border-[#F3F3F5] px-1.5 text-[11px] font-extrabold text-[#F3F3F5]">18+</span>
              Adults only. All listings are for users 18 and over.
            </p>
          </div>
          <div>
            <h2 className={head}>Categories</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {cats.map((c) => <li key={c.slug}><Link href={`/category/${c.slug}/`} className={link}>{c.name}</Link></li>)}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:contents">
            <div>
              <h2 className={head}>Company</h2>
              <ul className="space-y-2.5">{COMPANY.map(([h, l]) => <li key={h}><Link href={h} className={link}>{l}</Link></li>)}</ul>
            </div>
            <div>
              <h2 className={head}>Policies</h2>
              <ul className="space-y-2.5">{POLICIES.map(([h, l]) => <li key={h}><Link href={h} className={link}>{l}</Link></li>)}</ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-[#2C2C33] pt-6 text-[13px] text-[#9A9AA6] sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} AI Porn Bible</p>
          <p>Ratings are editorial and never for sale. Sponsored placements are always labelled.</p>
        </div>
      </div>
    </footer>
  );
}
