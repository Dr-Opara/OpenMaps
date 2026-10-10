import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// No React rendering harness is set up in this project (no jsdom/@testing-library/react), and
// these are static-copy checks, so asserting on source text is the lightweight option: it
// directly guards against the removed Android-exclusivity/Alpha-branding language regressing,
// and confirms the new early-access copy is actually what ships.
function read(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

/** Every .ts/.tsx source file (not test files) under the given project-root-relative dirs. */
function listSourceFiles(dirs: string[]): string[] {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(join(process.cwd(), dir))) {
      const relativePath = join(dir, name);
      if (statSync(join(process.cwd(), relativePath)).isDirectory()) {
        walk(relativePath);
      } else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) {
        files.push(relativePath);
      }
    }
  };
  for (const dir of dirs) walk(dir);
  return files;
}

const OUTDATED_PHRASES = [
  "Android Alpha first",
  "iPhone planned after Android validation",
  "I want to test the Android Alpha",
  "Join the Android Alpha",
  "Android phone model",
  "testing the Android Alpha",
  "Android devices to start with",
];

describe("outdated Android-first copy is gone from the touched surfaces", () => {
  it.each(["components/Brand.tsx", "components/Waitlist.tsx", "components/WaitlistForm.tsx", "app/privacy/page.tsx"])(
    "%s contains none of the removed Android-exclusivity phrases",
    (relativePath) => {
      const source = read(relativePath);
      for (const phrase of OUTDATED_PHRASES) expect(source).not.toContain(phrase);
    },
  );
});

describe("updated early-access copy renders", () => {
  it("Brand.tsx's PlatformNote does not imply an installable app exists yet", () => {
    const source = read("components/Brand.tsx");
    expect(source).toContain("Early access through openmaps.tech");
    expect(source).toContain("No app store signup required");
    expect(source).not.toContain("Install directly from the web");
  });

  it("Waitlist.tsx's section copy matches the approved EARLY ACCESS text", () => {
    const source = read("components/Waitlist.tsx");
    expect(source).toContain("Be first to experience OpenMaps.");
    expect(source).toContain("Get notified when OpenMaps is ready and help shape what comes next.");
  });

  it("Waitlist.tsx drops the eyebrow and the distribution-note lines entirely", () => {
    const source = read("components/Waitlist.tsx");
    expect(source).not.toContain("Early access</p>");
    expect(source).not.toContain("PlatformNote");
    expect(source).not.toContain("Install directly from the web");
    expect(source).not.toContain("No app store required");
  });

  it("WaitlistForm.tsx renames the early-access checkbox and adds the SMS checkbox + consent text", () => {
    const source = read("components/WaitlistForm.tsx");
    expect(source).toContain("I want early access to OpenMaps");
    expect(source).toContain("Text me when OpenMaps launches");
    expect(source).toContain(
      "By selecting this option, you agree to receive an OpenMaps launch notification by text message. Message and",
    );
    expect(source).toContain("Reply STOP to opt out.");
  });

  it("WaitlistForm.tsx's submit button says Get Updates / Sending…", () => {
    const source = read("components/WaitlistForm.tsx");
    expect(source).toContain("Get Updates");
    expect(source).toContain("Sending…");
    expect(source).not.toContain("Join Early Access");
    expect(source).not.toContain("Joining…");
  });

  it("the Instagram URL lives in site.ts and is not hardcoded in Header or Footer", () => {
    expect(read("lib/site.ts")).toContain('export const INSTAGRAM_URL = "https://www.instagram.com/openmaps.tech"');
    for (const relativePath of ["components/Header.tsx", "components/Footer.tsx"]) {
      const source = read(relativePath);
      expect(source).toContain("INSTAGRAM_URL");
      expect(source).not.toContain("instagram.com");
    }
  });

  it("Header.tsx renders the Instagram link next to X with the required attributes", () => {
    const source = read("components/Header.tsx");
    expect(source).toContain('aria-label="OpenMaps on Instagram"');
    expect(source).toContain('rel="noopener noreferrer"');
    expect(source).toContain("<InstagramGlyph />");
    // The standalone "Early Access" nav link is gone; the CTA covers it.
    expect(source).not.toContain(">Early Access</a>");
  });

  it("Footer.tsx lists X, Instagram, Privacy, Terms, Contact in order", () => {
    const source = read("components/Footer.tsx");
    const order = ['label: "X"', 'label: "Instagram"', 'label: "Privacy"', 'label: "Terms"', 'label: "Contact"'];
    const positions = order.map((needle) => source.indexOf(needle));
    expect(positions.every((p) => p !== -1)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("privacy page describes the phone/SMS consent field instead of the Android device field", () => {
    const source = read("app/privacy/page.tsx");
    expect(source).toContain("phone number");
    expect(source).toContain("I want early access to OpenMaps");
    expect(source).toContain("Text me when OpenMaps launches");
  });
});

describe("no production-facing \"Alpha\" branding remains", () => {
  it("no .ts/.tsx source file under app/ or components/ contains the word \"Alpha\"", () => {
    const offenders = listSourceFiles(["app", "components"])
      .filter((relativePath) => read(relativePath).includes("Alpha"));

    expect(offenders).toEqual([]);
  });

  it.each([
    "components/Header.tsx",
    "components/Hero.tsx",
    "components/WaitlistForm.tsx",
    "components/Experience.tsx",
    "app/terms/page.tsx",
  ])("%s renders \"Early Access\" branding where \"Alpha\" used to be", (relativePath) => {
    expect(read(relativePath)).toContain("Early Access");
  });

  it("keeps the OpenMaps wordmark and tagline untouched", () => {
    expect(read("components/Logo.tsx")).toContain("OpenMaps");
    expect(read("components/Footer.tsx")).toContain("See What&rsquo;s Ahead");
  });
});
