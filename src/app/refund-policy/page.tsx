import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund and Replacement Policy',
  description:
    'Refund and replacement policy for Henna by Chippy. Damaged on arrival: send unboxing video within 24 hours.',
}

export default function RefundPolicyPage() {
  return (
    <div className="section-container pt-28 max-w-3xl">
      <div className="prose-henna">
        <h1 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
          Refund and Replacement Policy
        </h1>
        <p className="text-warm-gray text-sm">Last updated: March 2025</p>

        <p>
          Chippy stands behind the quality of every cone. If something goes wrong, here is exactly
          what happens.
        </p>

        <h2>Damaged on arrival</h2>
        <p>
          If your product arrives damaged, you are entitled to a full refund or a replacement,
          your choice.
        </p>
        <p>
          <strong>What to do:</strong> Record a short unboxing video while opening the package (do
          not open it before recording). Send the video to Chippy on WhatsApp at{' '}
          <a href="https://wa.me/917561856754">+91 7561856754</a> within{' '}
          <strong>24 hours of delivery</strong>. Chippy will arrange the refund or replacement
          immediately.
        </p>
        <p>
          Alternatively, submit the request using our{' '}
          <Link href="/support/refund">online refund form</Link> (video upload, max 100MB).
        </p>

        <h2>Wrong item sent</h2>
        <p>
          If you received the wrong product, you get a full replacement. No video required. Just
          message Chippy on WhatsApp with a photo of what you received.
        </p>

        <h2>Missing item</h2>
        <p>
          If an item from your order is missing, contact Chippy on WhatsApp with your order
          details. A replacement will be sent.
        </p>

        <h2>Poor stain quality</h2>
        <p>
          Poor stain quality is usually caused by one of these:
        </p>
        <ul>
          <li>Henna was not kept on long enough (minimum 8 hours for deep stain)</li>
          <li>Water or soap contact within 24 hours of removal</li>
          <li>Product was stored outside the freezer for more than 3 days (spoiled)</li>
        </ul>
        <p>
          If the product was stored incorrectly after delivery, this is not covered under the
          refund policy. If you believe the product was defective from dispatch, contact Chippy to
          discuss.
        </p>

        <h2>What is NOT covered</h2>
        <ul>
          <li>Spoilage due to not storing in the freezer immediately upon arrival</li>
          <li>Stain quality issues from improper application or short wear time</li>
          <li>Claims made more than 24 hours after delivery (for damaged on arrival)</li>
        </ul>

        <h2>How to claim</h2>
        <p>Two options:</p>
        <ol>
          <li>
            <strong>WhatsApp:</strong> <a href="https://wa.me/917561856754">+91 7561856754</a>
          </li>
          <li>
            <strong>Online form:</strong> <Link href="/support/refund">Submit a refund request</Link>
          </li>
        </ol>
        <p>
          Chippy responds within 24 hours. Refunds are processed immediately after review.
        </p>

        <h2>Consumer rights</h2>
        <p>
          This policy is in addition to your rights under the Consumer Protection Act 2019, India.
          Chippy is the grievance officer (contact details in{' '}
          <Link href="/privacy">Privacy Policy</Link>).
        </p>
      </div>
    </div>
  )
}
