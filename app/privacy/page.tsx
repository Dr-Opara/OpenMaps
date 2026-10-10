import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Privacy Policy — OpenMaps",
  description: "How OpenMaps handles information collected through the early-access waitlist.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <section>
        <p>
          OpenMaps is a navigation product in development. This policy covers the openmaps.tech website and its
          early-access waitlist. It does not cover the OpenMaps app, which is not released; we will publish an app
          privacy policy before any app testing begins.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <p>When you join the waitlist you give us:</p>
        <ul>
          <li><strong>Email address</strong> (required)</li>
          <li><strong>First name</strong>, <strong>Android phone model</strong> and <strong>city / state</strong> (all optional)</li>
          <li>Whether you checked <strong>&ldquo;I&rsquo;m interested in testing the Android Alpha&rdquo;</strong></li>
        </ul>
        <p>We also record:</p>
        <ul>
          <li>
            A <strong>source</strong> label (<em>twitter</em>, <em>direct</em> or <em>other</em>) taken from the link you
            arrived through, so we know where signups come from
          </li>
          <li>The date and time you signed up</li>
        </ul>
        <p>
          We do not ask for your precise location, payment details, or a password, and the website does not use
          advertising trackers. Our hosting provider receives standard request data such as your IP address and browser
          type in order to serve the site and protect it from abuse.
        </p>
      </section>

      <section>
        <h2>How we use it</h2>
        <ul>
          <li>To contact you about OpenMaps early access and Alpha testing</li>
          <li>To choose which U.S. test markets and Android devices to start with</li>
          <li>To understand which channels bring people to the waitlist</li>
          <li>To keep the site secure and prevent duplicate or abusive signups</li>
        </ul>
        <p>We do not sell your information and we do not use it for third-party advertising.</p>
      </section>

      <section>
        <h2>Who handles it</h2>
        <p>
          We use service providers to run the site and store the waitlist: our web host and network provider (Cloudflare) and our database
          provider (Supabase). They process data on our behalf. We may also
          disclose information if the law requires it. If OpenMaps is ever transferred to another company, the waitlist
          would transfer with it and this policy would continue to apply until you were told otherwise.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          We keep waitlist entries until the early-access program ends or you ask us to delete yours, whichever comes
          first. After that we delete or anonymize them.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can ask us to see, correct or delete your waitlist information, or to stop contacting you, at any time by
          emailing <Contact /> from the address you signed up with. Every
          message we send will also tell you how to opt out. Residents of some states, including California, have
          additional rights under state law; we will honor valid requests.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          Waitlist data is stored in an access-restricted database that is only reachable from our server, and is sent to
          us over HTTPS. No system is perfectly secure, so we ask only for what we need.
        </p>
      </section>

      <section>
        <h2>Who it&rsquo;s for</h2>
        <p>
          OpenMaps is intended for adults in the United States. We do not knowingly collect information from anyone under
          18. If you believe a child has joined the waitlist, contact us and we will remove the entry.
        </p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          We will update the date above when this policy changes and, for material changes, tell waitlist members by
          email. Questions: <Contact />.
        </p>
      </section>
    </LegalPage>
  );
}
