/** Reads every entry through Keystatic's own reader to prove the JSON matches the dashboard schema. */
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);
(async () => {
  let bad = 0;
  for (const name of ["platforms", "categories", "articles", "pages"] as const) {
    const slugs = await reader.collections[name].list();
    for (const s of slugs) {
      try {
        const e = await reader.collections[name].read(s, { resolveLinkedFiles: true });
        if (!e) throw new Error("null");
      } catch (err) {
        bad++;
        console.error(`✖ ${name}/${s}: ${(err as Error).message.split("\n").slice(0, 6).join(" | ")}`);
      }
    }
    console.log(`${name}: ${slugs.length} entries`);
  }
  if (bad) process.exit(1);
  console.log("✔ Keystatic can read every entry");
})();
