import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Henna by Chippy.',
}

export default function TermsPage() {
  return (
    <div className="section-container pt-28 max-w-3xl">
      <div className="prose-henna">
        <h1 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
          Terms of Service
        </h1>
        <p className="text-warm-gray text-sm">Last updated: March 2025</p>

        <p>
          By using this website and placing orders with Henna by Chippy, you agree to these terms.
        </p>

        <h2>Products</h2>
        <p>
          All products are handmade and fresh. Prices are shown in Indian Rupees (INR) and are
          subject to change. Delivery charges are additional and confirmed by Chippy based on your
          location.
        </p>

        <h2>Orders</h2>
        <p>
          Orders are placed via WhatsApp. An order is confirmed only after Chippy replies with a
          confirmation message. Payment terms are agreed directly with Chippy.
        </p>

        <h2>Storage responsibility</h2>
        <p>
          Henna cones must be stored in a freezer immediately upon arrival. Chippy is not
          responsible for quality issues caused by improper storage (leaving the product outside the
          freezer for more than 3 days).
        </p>

        <h2>Refund and replacement</h2>
        <p>
          See our <a href="/refund-policy">Refund and Replacement Policy</a> for full details.
        </p>

        <h2>Intellectual property</h2>
        <p>
          All photos, designs, and content on this website belong to Chippy and may not be used
          without permission.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of India, including the Consumer Protection Act 2019
          and IT Act 2000.
        </p>

        <h2>Contact</h2>
        <p>
          For questions: <a href="https://wa.me/917561856754">WhatsApp +91 7561856754</a>
        </p>
      </div>
    </div>
  )
}
