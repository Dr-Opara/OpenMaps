import { describe, expect, it } from "vitest";
import { earlyAccessInviteTemplate, launchUpdateTemplate, waitlistConfirmationTemplate } from "./templates";

describe("waitlistConfirmationTemplate", () => {
  it("renders the exact subject and copy, with both an HTML and a plain-text body", () => {
    const tpl = waitlistConfirmationTemplate(false);

    expect(tpl.subject).toBe("You're on the OpenMaps early access list");
    expect(tpl.text).toContain("You're in.");
    expect(tpl.text).toContain("Thanks for joining the OpenMaps early access list.");
    expect(tpl.text).toContain("Early access will open in stages.");
    expect(tpl.text).toContain("Visit OpenMaps: https://openmaps.tech");
    expect(tpl.html).toContain("https://openmaps.tech");
    expect(tpl.html).toContain("Visit OpenMaps");
  });

  it("does not mention texting when smsOptIn is false", () => {
    const tpl = waitlistConfirmationTemplate(false);

    expect(tpl.text).not.toContain("text when OpenMaps launches");
  });

  it("adds the SMS line only when smsOptIn is true", () => {
    const tpl = waitlistConfirmationTemplate(true);

    expect(tpl.text).toContain("You'll also receive a text when OpenMaps launches.");
    expect(tpl.html).toContain("You&#39;ll also receive a text when OpenMaps launches.");
  });
});

describe("earlyAccessInviteTemplate", () => {
  it("renders with a caller-supplied CTA URL rather than a hardcoded one", () => {
    const tpl = earlyAccessInviteTemplate("https://example.com/early-access");

    expect(tpl.subject).toBe("Your OpenMaps early access invite is ready");
    expect(tpl.text).toContain("You're invited.");
    expect(tpl.text).toContain("Access OpenMaps: https://example.com/early-access");
    expect(tpl.html).toContain("https://example.com/early-access");
    expect(tpl.html).not.toContain("openmaps.tech");
  });
});

describe("launchUpdateTemplate", () => {
  it("renders the exact subject and copy", () => {
    const tpl = launchUpdateTemplate();

    expect(tpl.subject).toBe("OpenMaps is launching");
    expect(tpl.text).toContain("OpenMaps is moving from concept to the road.");
    expect(tpl.text).toContain("Explore OpenMaps: https://openmaps.tech");
    expect(tpl.html).toContain("https://openmaps.tech");
    expect(tpl.html).toContain("Explore OpenMaps");
  });
});
