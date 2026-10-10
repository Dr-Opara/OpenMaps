/**
 * Shared email shell: one brand-styled HTML layout + plain-text equivalent, parameterized by
 * copy. Keeps every template (confirmation, early-access invite, launch update) visually consistent
 * without a templating framework (none of this runs anywhere but a Worker, so plain strings).
 */

const BRAND_NAME = "OpenMaps";
const BRAND_TAGLINE = "See What's Ahead";

export interface EmailContent {
  headline: string;
  paragraphs: string[];
  cta: { label: string; url: string } | null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderEmailHtml(content: EmailContent): string {
  const paragraphsHtml = content.paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1b2430;">${escapeHtml(p)}</p>`,
    )
    .join("\n");

  const ctaHtml = content.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 28px;">
        <tr>
          <td style="border-radius:8px;background:#2f7bff;">
            <a href="${escapeHtml(content.cta.url)}" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">${escapeHtml(content.cta.label)}</a>
          </td>
        </tr>
      </table>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(BRAND_NAME)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 4px;">
                <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;color:#050a14;">${escapeHtml(content.headline)}</h1>
                ${paragraphsHtml}
                ${ctaHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;border-top:1px solid #e6e9ee;">
                <p style="margin:20px 0 0;font-size:12px;line-height:1.5;color:#8a93a3;">${escapeHtml(BRAND_NAME)}<br />${escapeHtml(BRAND_TAGLINE)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderEmailText(content: EmailContent): string {
  const lines = [content.headline, "", ...content.paragraphs];
  if (content.cta) lines.push("", `${content.cta.label}: ${content.cta.url}`);
  lines.push("", BRAND_NAME, BRAND_TAGLINE);
  return lines.join("\n");
}
