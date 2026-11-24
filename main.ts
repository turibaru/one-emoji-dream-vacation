// This tiny program carries one dream-vacation emoji from its source file
// into the grader's output folder, unchanged and unadorned.
// It checks the entry first, so only a single picture character ever
// leaves this folder, and anything else stops the run right away.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The runtime passes the output folder in through MAKEFUN_OUTPUT_DIR, so the
// program never guesses a path or writes next to its own source files.
// The guard below exists because a missing output folder means there is
// nowhere safe for the entry to land, and failing loudly here is better
// than silently producing nothing for the grader to read.
// entry.txt is copied verbatim, byte for byte, because the exact entry
// is the file itself; nothing here rewrites, trims, or appends to it.
// The entry must be exactly one emoji: one grapheme cluster (counted with
// Intl.Segmenter, so a variation selector or ZWJ sequence still counts
// as one) and that cluster must contain an Extended_Pictographic code
// point. Anything else (empty, two emoji, plain text, letters, digits,
// whitespace) is rejected with exit 1.
const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

const entry = readFileSync(new URL("./entry.txt", import.meta.url), "utf8");
if (entry.length === 0 || entry.trim().length === 0) {
  console.error("entry.txt must not be empty or whitespace-only");
  process.exit(1);
}

const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const clusters = [...segmenter.segment(entry)].map((s) => s.segment);
if (clusters.length !== 1) {
  console.error(`entry.txt must be exactly one emoji, got ${clusters.length} grapheme clusters`);
  process.exit(1);
}

const cluster = clusters[0];
if (!/\p{Extended_Pictographic}/u.test(cluster)) {
  console.error("entry.txt must be exactly one emoji (Extended_Pictographic)");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), entry, "utf8");
