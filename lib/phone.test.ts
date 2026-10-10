import { describe, expect, it } from "vitest";
import { normalizeUsPhone } from "./phone";

describe("normalizeUsPhone", () => {
  it("normalizes common U.S. formats to E.164", () => {
    expect(normalizeUsPhone("(212) 555-0147")).toBe("+12125550147");
    expect(normalizeUsPhone("212-555-0147")).toBe("+12125550147");
    expect(normalizeUsPhone("212.555.0147")).toBe("+12125550147");
    expect(normalizeUsPhone("2125550147")).toBe("+12125550147");
    expect(normalizeUsPhone("+1 212 555 0147")).toBe("+12125550147");
    expect(normalizeUsPhone("1 212 555 0147")).toBe("+12125550147");
  });

  it("rejects obviously invalid values", () => {
    expect(normalizeUsPhone("")).toBeNull();
    expect(normalizeUsPhone("   ")).toBeNull();
    expect(normalizeUsPhone("12345")).toBeNull();
    expect(normalizeUsPhone("not a phone number")).toBeNull();
    expect(normalizeUsPhone("0125550147")).toBeNull(); // area code can't start with 0
    expect(normalizeUsPhone("2121550147")).toBeNull(); // exchange code can't start with 1
    expect(normalizeUsPhone("21255501478")).toBeNull(); // too many digits
  });
});
