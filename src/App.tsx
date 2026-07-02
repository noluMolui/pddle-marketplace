/* ============================================================
 * This is a near-empty shell ON PURPOSE.
 *
 * We are not giving you a component structure, a router, a state
 * pattern, or a design. Those are the decisions being assessed —
 * designing them is your job, and defending them in your Decision
 * Log is the point.
 *
 * Delete this placeholder. Build the product described in BRIEF.md.
 * Type your data using src/data/types.ts. Load it via
 * src/data/items.ts (or reshape that — your call).
 * ============================================================ */

import { ITEMS } from "./data/items.ts";

export function App() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1>Founder Capstone — start here</h1>
      <p>
        Read <code>BRIEF.md</code> first. It is most of the assessment. Then delete
        this file's contents and build the product.
      </p>
      <p>
        There are <strong>{ITEMS.length}</strong> mock items wired up in{" "}
        <code>src/data/items.ts</code>. Some have no photos, no price, no rating, or
        are paused/removed. Handling those cases well is part of the craft score.
      </p>
      <p style={{ color: "#666" }}>
        Do not ship this screen. This is scaffolding, not a starting design.
      </p>
    </main>
  );
}
