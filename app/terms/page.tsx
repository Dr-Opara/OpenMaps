import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { Contact } from "@/components/Contact";
import { TERMS_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Early Access Terms — OpenMaps",
  description: "Terms for using the OpenMaps website and joining the early-access waitlist.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Early Access Terms" updated={TERMS_UPDATED}>
      <section>
        <p>
          These terms cover the openmaps.tech website and the early-access waitlist, and set expectations for any
          Early Access testing we invite you to. By using the site or joining the waitlist you agree to them. If you
          don&rsquo;t agree, please don&rsquo;t join.
        </p>
      </section>

      <section>
        <h2>OpenMaps is in development</h2>
        <p>
          The images on this site are concepts. Features shown or described are goals, not promises, and may change or
          never ship. Joining the waitlist does not guarantee that you will be invited to test, and any launch will begin
          in selected U.S. markets only.
        </p>
      </section>

      <section>
        <h2>Eligibility</h2>
        <p>
          You must be at least 18, located in the United States, and able to give accurate information. Use your own
          email address.
        </p>
      </section>

      <section>
        <h2>If you are invited to Early Access</h2>
        <ul>
          <li>Early Access software is unfinished. It may be inaccurate, unavailable, or stop working, and may be changed or withdrawn at any time.</li>
          <li><strong>Do not rely on it for safety.</strong> Navigation data, directions, hazards and camera overlays may be wrong or late. Obey traffic laws and road signs, and use your own judgment.</li>
          <li><strong>Never operate or look at your phone while driving.</strong> Have a passenger use it, or use it only when the vehicle is safely stopped.</li>
          <li>We may ask for feedback. You grant us a free, perpetual right to use feedback you give us to improve OpenMaps, without obligation to you.</li>
          <li>Please keep Early Access builds and unreleased features confidential unless we say otherwise.</li>
          <li>Separate Early Access terms and an app privacy policy may apply to the app itself, and we will show them before you start testing.</li>
        </ul>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>
          Don&rsquo;t submit false or someone else&rsquo;s information, try to disrupt or probe the site or its waitlist,
          or use automated means to sign up.
        </p>
      </section>

      <section>
        <h2>Ownership</h2>
        <p>
          The OpenMaps name, logo, site content and concept imagery belong to us. These terms give you no rights to
          them beyond viewing the site.
        </p>
      </section>

      <section>
        <h2>No warranty; limited liability</h2>
        <p>
          The site and any Early Access testing are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
          warranties of any kind. To the fullest extent the law allows, OpenMaps will not be liable for indirect,
          incidental or consequential damages, or for any loss arising from your use of the site or Early Access, and
          our total liability is limited to $100. Some jurisdictions don&rsquo;t allow certain limits, so parts of this
          may not apply to you.
        </p>
      </section>

      <section>
        <h2>Ending and changes</h2>
        <p>
          You can leave the waitlist or stop testing at any time (see the Privacy Policy). We may remove anyone from the
          waitlist or Early Access, and may update these terms; continued use after an update means you accept it. The
          current version is always at openmaps.tech/terms.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions: <Contact />. See also our <a href="/privacy">Privacy Policy</a>.
        </p>
      </section>
    </LegalPage>
  );
}
