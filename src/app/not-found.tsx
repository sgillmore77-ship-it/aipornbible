import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24 lg:py-32">
      <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-red">404</p>
      <h1 className="display mt-3 text-[44px] lg:text-[72px]">Page not found</h1>
      <p className="mt-4 max-w-[560px] text-[17px] leading-[1.5] text-ink2">It may have moved, or the platform may have been removed from the directory.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/directory/" className="btn-red inline-flex h-12 items-center rounded-[8px] px-6 text-[16px] font-bold">Browse the directory</Link>
        <Link href="/" className="inline-flex h-12 items-center rounded-[8px] border border-rule px-6 text-[16px] font-semibold hover:border-ink">Home</Link>
      </div>
    </Container>
  );
}
