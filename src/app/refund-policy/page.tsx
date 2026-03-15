import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund, Replacement and Cancellation Policy',
  description:
    'Refund and replacement policy for Henna by Chippy. Prepaid orders only. No cancellations. Unboxing video required for all claims.',
}

export default function RefundPolicyPage() {
  return (
    <div className="section-container pt-28 max-w-3xl">
      <div className="prose-henna">
        <h1 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
          Refund, Replacement and Cancellation Policy
        </h1>
        <p className="text-warm-gray text-sm">Last updated: March 2025</p>

        <p>
          Chippy stands behind the quality of every cone. Please read this policy carefully before
          placing an order.
        </p>

        <h2>Prepaid Orders Only</h2>
        <p>
          <strong>We accept prepaid orders only.</strong> Payment is collected before the order is
          dispatched. Cash on delivery (COD) is not available.
        </p>

        <h2>No Cancellations</h2>
        <p>
          <strong>Orders cannot be cancelled once placed.</strong> All sales are final. If you have
          placed an order by mistake, please contact Chippy on WhatsApp immediately at{' '}
          <a href="https://wa.me/917561856754" target="_blank" rel="noopener noreferrer">+91 7561856754</a>.
          Cancellations before dispatch may be considered at Chippy&apos;s discretion, but are not
          guaranteed.
        </p>

        <h2>Unboxing Video Requirement</h2>
        <p>
          <strong>An unboxing video is required for all refund and replacement claims, without
          exception.</strong> This video must be recorded while opening the sealed package, without
          stopping or cutting the recording. Claims submitted without a valid unboxing video cannot
          be processed.
        </p>
        <p>
          The video protects both you and Chippy. It allows a fair review of every claim.
        </p>

        <h2>Damaged on arrival</h2>
        <p>
          If your product arrives damaged, you are entitled to a full refund or a replacement,
          your choice.
        </p>
        <p>
          <strong>What to do:</strong> Record the unboxing video while opening the package. Send
          it to Chippy on WhatsApp at{' '}
          <a href="https://wa.me/917561856754" target="_blank" rel="noopener noreferrer">+91 7561856754</a> within{' '}
          <strong>24 hours of delivery</strong>. Or submit via the{' '}
          <Link href="/support/refund">online refund form</Link> (max 100MB video upload).
        </p>

        <h2>Wrong item sent</h2>
        <p>
          If you received the wrong product, you get a full replacement. Record an unboxing video
          showing what you received and message Chippy on WhatsApp.
        </p>

        <h2>Missing item</h2>
        <p>
          If an item from your order is missing, record the unboxing video showing the package
          contents and contact Chippy on WhatsApp. A replacement will be sent.
        </p>

        <h2>Poor stain quality</h2>
        <p>
          Poor stain quality is usually caused by one of these:
        </p>
        <ul>
          <li>Henna was not kept on long enough (minimum 8 hours for a deep stain)</li>
          <li>Water or soap contact within 24 hours of removal</li>
          <li>Product was stored outside the freezer for more than 3 days (spoiled)</li>
        </ul>
        <p>
          If the product was stored incorrectly after delivery, this is not covered. If you believe
          the product was defective from dispatch, contact Chippy with your unboxing video.
        </p>

        <h2>What is NOT covered</h2>
        <ul>
          <li>Claims without an unboxing video</li>
          <li>Spoilage due to not storing in the freezer immediately upon arrival</li>
          <li>Stain quality issues from improper application or short wear time</li>
          <li>Claims made more than 24 hours after delivery</li>
          <li>Order cancellations after payment is made</li>
        </ul>

        <h2>How to claim</h2>
        <p>Two options:</p>
        <ol>
          <li>
            <strong>WhatsApp:</strong>{' '}
            <a href="https://wa.me/917561856754" target="_blank" rel="noopener noreferrer">+91 7561856754</a>
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
