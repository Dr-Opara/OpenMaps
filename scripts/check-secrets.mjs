// Post-build guard: fail if server secrets or their env names appear in anything shipped to the browser.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const dir = existsSync("dist/client") ? "dist/client" : ".next/static";
if (!existsSync(dir)) {
  console.error("No build output found (dist/client). Run `npm run build` first.");
  process.exit(2);
}

const needles = ["SUPABASE_SERVICE_ROLE_KEY", "service_role", "SupabaseWaitlistStore"];
for (const name of ["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_URL"]) {
  const v = process.env[name];
  if (v && v.length > 8) needles.push(v);
}

let bad = 0;
let files = 0;
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(js|css|html|json|map|txt)$/.test(f)) {
      files++;
      const text = readFileSync(p, "utf8");
      for (const n of needles) if (text.includes(n)) { console.error(`LEAK: "${n.slice(0, 12)}…" found in ${p}`); bad++; }
    }
  }
})(dir);

if (bad) process.exit(1);
console.log(`check-secrets: ${files} client files scanned, no server secrets found.`);
