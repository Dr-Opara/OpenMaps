import { CONTACT_EMAIL } from "@/lib/site";

/** Mailto link, or neutral wording while no contact mailbox is configured (lib/site.ts). */
export function Contact() {
  return CONTACT_EMAIL ? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> : <>the address listed on openmaps.tech</>;
}
