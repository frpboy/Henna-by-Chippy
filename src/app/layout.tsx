import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import FloatingNav from '@/components/ui/FloatingNav'
import CartDrawer from '@/components/shop/CartDrawer'
import StainConsultant from '@/components/ai/StainConsultant'
import HennaTrail from '@/components/ui/HennaTrail'
import PromotionBanner from '@/components/shop/PromotionBanner'

export const metadata: Metadata = {
  title: {
    default: 'Henna by Chippy — Natural Organic Henna, Malappuram Kerala',
    template: '%s | Henna by Chippy',
  },
  description:
    'Pure organic henna cones handmade in Karuvarakundu, Malappuram. No PPD, no preservatives. Nail cones Rs 35, Skin cones Rs 45. Ship across Kerala and India.',
  keywords: [
    'organic henna Malappuram',
    'natural henna cone Kerala',
    'PPD-free henna India',
    'bridal henna Malappuram',
    'henna cone buy online Kerala',
    'Karuvarakundu henna',
    'henna near me',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Henna by Chippy',
    title: 'Henna by Chippy — Natural Organic Henna, Malappuram Kerala',
    description:
      'Pure organic henna cones handmade in Karuvarakundu, Malappuram. No PPD, no preservatives.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: 'fuBB-v7LkYGmqLJooCU2JYB3tVPl19Pw2RHFM1Lq-Ao',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <HennaTrail />
        <FloatingNav />
        <PromotionBanner />
        <main>{children}</main>
        <CartDrawer />
        <StainConsultant />
        <footer className="py-10 px-6 border-t border-henna-maroon/10 mt-20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-warm-gray">
            <div className="text-center md:text-left">
              <p className="font-serif text-henna-maroon font-semibold">Henna by Chippy</p>
              <p className="mt-1">Karuvarakundu, Malappuram, Kerala</p>
            </div>

            <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-4">
              <a href="/privacy" className="hover:text-henna-maroon transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-henna-maroon transition-colors">Terms</a>
              <a href="/ai-use-policy" className="hover:text-henna-maroon transition-colors">AI Use Policy</a>
              <a href="/refund-policy" className="hover:text-henna-maroon transition-colors">Refund Policy</a>
              <a href="/support/refund" className="hover:text-henna-maroon transition-colors">Request Refund</a>
            </nav>

            <div className="text-center md:text-right space-y-1">
              <a
                href="https://www.instagram.com/henna_by_chippy/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-henna-maroon transition-colors"
              >
                @henna_by_chippy
              </a>
              <p>
                Developed by{' '}
                <a
                  href="https://github.com/frpboy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-henna-maroon font-medium hover:underline"
                >
                  frpboy
                </a>
              </p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
