import { SITE_URL } from "@/lib/site";
import { renderEmailHtml, renderEmailText } from "./layout";
import type { EmailTemplate } from "./types";

/** `smsOptIn` adds one line noting a launch text will also follow — never pass true unless the signup actually opted in. */
export function waitlistConfirmationTemplate(smsOptIn: boolean): EmailTemplate {
  const paragraphs = [
    "Thanks for joining the OpenMaps early access list.",
    "We're building a camera-first navigation experience designed to help you see what's ahead — directions, road context, traffic, places and more in one view.",
    "Early access will open in stages.",
    "We'll let you know when OpenMaps is ready for you.",
  ];
  if (smsOptIn) paragraphs.push("You'll also receive a text when OpenMaps launches.");

  const content = {
    headline: "You're in.",
    paragraphs,
    cta: { label: "Visit OpenMaps", url: SITE_URL },
  };
  return {
    subject: "You're on the OpenMaps early access list",
    html: renderEmailHtml(content),
    text: renderEmailText(content),
  };
}

/**
 * Reusable for future early-access invitations. Not wired to any automatic trigger — call this
 * explicitly (e.g. from an admin script) once an access URL exists.
 */
export function earlyAccessInviteTemplate(accessUrl: string): EmailTemplate {
  const content = {
    headline: "You're invited.",
    paragraphs: [
      "OpenMaps early access is opening to a limited group of users.",
      "You'll be among the first to experience the camera-first navigation experience and help shape what we build next.",
    ],
    cta: { label: "Access OpenMaps", url: accessUrl },
  };
  return {
    subject: "Your OpenMaps early access invite is ready",
    html: renderEmailHtml(content),
    text: renderEmailText(content),
  };
}

/**
 * Reusable for future launch announcements. Not wired to any automatic trigger.
 */
export function launchUpdateTemplate(): EmailTemplate {
  const content = {
    headline: "See What's Ahead.",
    paragraphs: [
      "OpenMaps is moving from concept to the road.",
      "Thank you for being one of the early people who believed this should exist.",
    ],
    cta: { label: "Explore OpenMaps", url: SITE_URL },
  };
  return {
    subject: "OpenMaps is launching",
    html: renderEmailHtml(content),
    text: renderEmailText(content),
  };
}
