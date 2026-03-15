import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Use Policy',
  description:
    'How Henna by Chippy uses artificial intelligence in the Stain Consultant chat, including data use, limitations, and your rights.',
}

export default function AiUsePolicyPage() {
  return (
    <div className="section-container pt-28 max-w-3xl">
      <div className="prose-henna">
        <h1 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
          AI Use Policy
        </h1>
        <p className="text-warm-gray text-sm">Last updated: March 2025</p>

        <p>
          Henna by Chippy uses an AI-powered chat assistant called the Stain Consultant to help
          customers with questions about henna application, stain quality, storage, and delivery.
          This page explains how the AI works, what data it uses, and what you should know before
          using it.
        </p>

        <h2>What AI technology we use</h2>
        <p>
          The Stain Consultant is powered by <strong>Google Gemini 2.5 Flash</strong>, a large
          language model provided by Google LLC. Answers are grounded in a curated knowledge base
          specific to Henna by Chippy, retrieved via semantic search using{' '}
          <strong>Pinecone</strong> (a vector database). This approach is called
          Retrieval-Augmented Generation (RAG) and means the AI uses real, fact-checked information
          from Chippy&apos;s knowledge base rather than guessing.
        </p>

        <h2>How your chat messages are used</h2>
        <ul>
          <li>
            <strong>Sent to Google Gemini:</strong> Your messages are sent to Google&apos;s API to
            generate a response. Google&apos;s data use is governed by their{' '}
            <a
              href="https://ai.google.dev/gemini-api/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gemini API Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>Stored by Henna by Chippy:</strong> Chat sessions are saved to our systems with
            a random session ID (not linked to your name or account), detected language, and a
            coarse region code (e.g., &quot;KL&quot; for Kerala). Your raw IP address is never
            stored. See our <a href="/privacy">Privacy Policy</a> for full details.
          </li>
          <li>
            <strong>Used to improve the product:</strong> Chippy reviews chat logs to understand
            common questions and update the knowledge base. This helps the AI give better answers
            over time. No personal information is involved in this review.
          </li>
          <li>
            <strong>Not used for advertising:</strong> Your chat data is never sold, shared with
            advertisers, or used for profiling.
          </li>
        </ul>

        <h2>Limitations of the AI</h2>
        <ul>
          <li>
            The Stain Consultant is designed to answer questions about Chippy&apos;s henna products.
            It may not always be accurate, especially for topics outside this scope.
          </li>
          <li>
            The AI does not have access to real-time information such as live stock levels, current
            promotions, or order status. For these, contact Chippy directly on WhatsApp.
          </li>
          <li>
            The AI can make mistakes. It is not a substitute for medical advice. If you have a skin
            allergy or health concern, consult a doctor before using henna.
          </li>
          <li>
            Responses are generated automatically and are not reviewed by a human before being
            shown to you.
          </li>
        </ul>

        <h2>Session limits</h2>
        <p>
          To prevent misuse and keep the service available for everyone, the AI chat is limited to
          10 messages per browser session. After reaching the limit, you can continue the
          conversation directly with Chippy on WhatsApp.
        </p>

        <h2>How to opt out</h2>
        <p>
          Use of the AI Stain Consultant is entirely optional. You can get the same help by
          messaging Chippy directly on WhatsApp at{' '}
          <a href="https://wa.me/917561856754" target="_blank" rel="noopener noreferrer">
            +91 7561856754
          </a>
          . If you have already used the chat and would like your session data deleted, contact
          Chippy on WhatsApp and the relevant records will be removed within 30 days.
        </p>

        <h2>Data retention</h2>
        <p>
          Chat logs are retained for up to 12 months to allow Chippy to review patterns and improve
          the knowledge base. After 12 months, logs are deleted. You can request earlier deletion at
          any time.
        </p>

        <h2>Legal basis (India DPDP Act 2023)</h2>
        <p>
          Processing of chat data is based on legitimate interest (operating and improving the AI
          service) and your implied consent when you choose to use the chat feature. You have the
          right to access, correct, or erase your data under India&apos;s Digital Personal Data
          Protection Act 2023. To exercise these rights, contact our Grievance Officer:
        </p>
        <p>
          <strong>Name:</strong> Chippy
          <br />
          <strong>WhatsApp:</strong>{' '}
          <a href="https://wa.me/917561856754" target="_blank" rel="noopener noreferrer">
            +91 7561856754
          </a>
          <br />
          <strong>Address:</strong> Karuvarakundu, Malappuram, Kerala, India
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If we change how the AI is used or what data is collected, we will update this page and
          the &quot;Last updated&quot; date at the top. Continued use of the AI chat after changes
          means you accept the updated policy.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about AI use? Message Chippy on WhatsApp:{' '}
          <a href="https://wa.me/917561856754" target="_blank" rel="noopener noreferrer">
            +91 7561856754
          </a>
        </p>
      </div>
    </div>
  )
}
