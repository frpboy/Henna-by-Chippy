import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Henna by Chippy. How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="section-container pt-28 max-w-3xl">
      <div className="prose-henna">
        <h1 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
          Privacy Policy
        </h1>
        <p className="text-warm-gray text-sm">Last updated: March 2025</p>

        <p>
          Henna by Chippy is operated by Chippy, a small henna artisan based in Karuvarakundu,
          Malappuram, Kerala. This policy explains what data we collect, why, and your rights under
          India&apos;s Digital Personal Data Protection Act 2023 (DPDP Act).
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Reviews:</strong> Your name, location, rating, review text, and photos, only
            when you choose to submit a review and consent to its use.
          </li>
          <li>
            <strong>Chat logs:</strong> AI chat sessions are stored with a random session ID (not
            tied to your identity), your message history, detected language, and a coarse region
            code (e.g., KL for Kerala). Your raw IP address is never stored.
          </li>
          <li>
            <strong>Refund requests:</strong> Name, WhatsApp number, order details, issue
            description, and unboxing video (if required). Used only to process your request.
          </li>
        </ul>

        <h2>Why we collect it</h2>
        <p>
          Data is used exclusively for business operations: fulfilling orders, responding to
          support requests, improving the AI knowledge base, and displaying customer reviews (with
          your consent). We never sell your data.
        </p>

        <h2>Third-party processors</h2>
        <ul>
          <li>
            <strong>Sanity.io</strong> (content and data storage, cloud CDN)
          </li>
          <li>
            <strong>Vercel</strong> (hosting and edge functions, US servers)
          </li>
          <li>
            <strong>Pinecone</strong> (AI vector search, US servers, disclosed under DPDP Act)
          </li>
          <li>
            <strong>Google Gemini</strong> (AI responses, Google&apos;s infrastructure)
          </li>
        </ul>
        <p>
          All processors are disclosed. International data transfers (Pinecone, Vercel, Google) are
          acknowledged. These processors are used only to operate this website.
        </p>

        <h2>Cookies</h2>
        <p>
          We use session cookies only, for technical operation of the site. No advertising cookies,
          no tracking pixels, no third-party ad networks.
        </p>

        <h2>Your rights</h2>
        <p>
          Under India&apos;s DPDP Act 2023, you have the right to access, correct, or erase your
          personal data. To make a request, message Chippy on WhatsApp at{' '}
          <a href="https://wa.me/917561856754">+91 7561856754</a>. Requests will be handled within
          30 days.
        </p>

        <h2>Grievance Officer</h2>
        <p>
          As required by Consumer Protection (E-Commerce) Rules 2020:
          <br />
          <strong>Name:</strong> Chippy
          <br />
          <strong>Contact:</strong>{' '}
          <a href="https://wa.me/917561856754">WhatsApp: +91 7561856754</a>
          <br />
          <strong>Address:</strong> Karuvarakundu, Malappuram, Kerala, India
        </p>

        <h2>Security</h2>
        <p>
          We take reasonable security measures as required under IT Act 2000 Section 43A to protect
          your personal data stored in our systems.
        </p>

        <h2>Contact</h2>
        <p>
          For any privacy questions, contact Chippy on WhatsApp:{' '}
          <a href="https://wa.me/917561856754">+91 7561856754</a>
        </p>
      </div>
    </div>
  )
}
