import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Chippy',
  description:
    'Meet Chippy, the henna artist behind Henna by Chippy. Made in Karuvarakundu, Malappuram with 100% natural ingredients. No PPD, no preservatives.',
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '917561856754'
const CONTACT_MSG = encodeURIComponent(
  "Hi Chippy! I found you through your website and wanted to get in touch.",
)

export default function AboutPage() {
  return (
    <div className="pt-24">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="section-container" aria-label="About Chippy">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
            <Image
              src="/images/bridal-4.jpg"
              alt="Chippy applying bridal henna — close-up of hands and henna cone"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-terracotta text-sm font-semibold tracking-widest uppercase mb-3">
              About Chippy
            </p>
            <h1
              className="font-serif text-henna-maroon leading-tight mb-5"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)' }}
            >
              Made in the highlands.
              <br />
              Made with love.
            </h1>
            <div className="flex items-center gap-2 text-warm-gray text-sm mb-6">
              <MapPin size={14} aria-hidden="true" />
              <span>Karuvarakundu, Malappuram, Kerala</span>
            </div>
            <p className="text-dark-earth/80 leading-relaxed mb-4">
              I grew up in Karuvarakundu, in the hills of Malappuram, where henna isn&apos;t just a
              trend. It&apos;s a tradition woven into celebrations, weddings, and everyday joy.
            </p>
            <p className="text-dark-earth/80 leading-relaxed mb-4">
              I started making my own cones because I couldn&apos;t find ones I could trust. Every
              product on the shelf had something added: preservatives, chemicals, things I
              couldn&apos;t even pronounce. I wanted a cone I could put on my own family&apos;s
              hands without a second thought.
            </p>
            <p className="text-dark-earth/80 leading-relaxed">
              So I went back to the basics. Just henna, water, oil, and sugar. Every cone I roll is
              from Karuvarakundu. Every batch is fresh.
            </p>
          </div>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────────────── */}
      <section className="organic-bg" aria-label="Chippy's story">
        <div className="organic-blob organic-blob-1" aria-hidden="true" />
        <div className="organic-blob organic-blob-2" aria-hidden="true" />
        <div className="section-container relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2
              className="font-serif text-henna-maroon mb-8 text-center"
              style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
            >
              The story behind the cone
            </h2>

            <blockquote className="space-y-5 text-dark-earth/80 leading-relaxed">
              <p>
                I perfected the blend over time. And when the results started speaking for
                themselves, deep rich maroon stains that lasted days, I knew I had something worth
                sharing.
              </p>
              <p>
                Every order goes out with the same care as if it were for my own wedding day. I pack
                each cone myself. I freeze them before shipping. I know what happens if they
                don&apos;t reach you in perfect condition, so I treat every cone like it matters.
                Because it does.
              </p>
              <p>
                My cones have travelled from Karuvarakundu to kitchens and celebrations across
                Kerala and beyond. That&apos;s something I never take for granted.
              </p>
              <footer className="pt-2">
                <cite className="font-serif text-henna-maroon font-semibold not-italic">
                  — Chippy
                </cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Ingredients ───────────────────────────────────────────── */}
      <section className="section-container" aria-labelledby="ingredients-heading">
        <h2
          id="ingredients-heading"
          className="font-serif text-henna-maroon text-center mb-3"
          style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
        >
          What&apos;s NOT in our cones matters.
        </h2>
        <p className="text-center text-warm-gray text-sm mb-10 max-w-xl mx-auto">
          Four ingredients. Nothing hidden. No PPD, no black henna chemicals, no preservatives.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-3xl mx-auto">
          {[
            {
              label: 'Henna Powder',
              detail: 'Sourced for quality, finely sieved for smooth flow',
              color: 'bg-henna-maroon/8',
            },
            {
              label: 'Pure Water',
              detail: 'Activates the natural dye without any additives',
              color: 'bg-leaf-green/8',
            },
            {
              label: 'Essential Oil',
              detail: 'Keeps the paste smooth and helps it stick',
              color: 'bg-terracotta/15',
            },
            {
              label: 'Sugar',
              detail: 'Natural binder that helps the paste dry and set',
              color: 'bg-henna-maroon/8',
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`${item.color} rounded-xl p-5 text-center`}
            >
              <p className="font-serif font-semibold text-henna-maroon mb-2">{item.label}</p>
              <p className="text-xs text-dark-earth/65 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-dark-earth/60 mt-8 max-w-xl mx-auto">
          No preservatives means our cones are alive, actively releasing dye. That&apos;s why
          freezing immediately on arrival is so important. It pauses the process and keeps your
          cone potent for 3 to 4 months.
        </p>
      </section>

      {/* ── Photo Strip ───────────────────────────────────────────── */}
      <section aria-label="Henna portfolio photos">
        <div className="grid grid-cols-3 md:grid-cols-6 h-48 md:h-64">
          {[
            { src: '/images/stain-skin-1.jpg', alt: 'Deep maroon skin henna with floral ring motif' },
            { src: '/images/bridal-2.jpg', alt: 'Bold bridal full hand design in deep maroon' },
            { src: '/images/stain-floral-1.jpg', alt: 'Artistic henna floral pattern close-up' },
            { src: '/images/bridal-3.jpg', alt: 'Bridal henna with maroon outfit and bangles' },
            { src: '/images/stain-nail-1.jpg', alt: 'Dark henna applied on nail tips' },
            { src: '/images/bridal-5.jpg', alt: 'Skin henna design against tropical green leaves' },
          ].map((photo) => (
            <div key={photo.src} className="relative overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 33vw, 17vw"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────── */}
      <section className="section-container" aria-labelledby="values-heading">
        <h2
          id="values-heading"
          className="font-serif text-henna-maroon text-center mb-10"
          style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
        >
          What we stand for
        </h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: 'Honest ingredients',
              body: 'Four ingredients. Always the same four. No substitutes, no shortcuts. What you see on the label is all that goes in.',
            },
            {
              title: 'Small batch, made fresh',
              body: 'Not factory made. Not stored in a warehouse. Each batch is rolled and packed fresh, then frozen for you.',
            },
            {
              title: 'Your trust, first',
              body: 'If something goes wrong, Chippy will make it right. That\'s a personal promise, not a policy.',
            },
          ].map((val) => (
            <div key={val.title} className="border border-henna-maroon/12 rounded-xl p-6">
              <h3 className="font-serif font-semibold text-henna-maroon mb-2">{val.title}</h3>
              <p className="text-sm text-dark-earth/70 leading-relaxed">{val.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact / CTA ─────────────────────────────────────────── */}
      <section className="section-container" aria-label="Get in touch">
        <div className="max-w-xl mx-auto text-center">
          <h2
            className="font-serif text-henna-maroon mb-3"
            style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
          >
            Say hello
          </h2>
          <p className="text-dark-earth/70 text-sm mb-6 leading-relaxed">
            Questions about your order, a bridal booking, or just want to know more? Chippy reads
            every message personally.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${CONTACT_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <MessageCircle size={17} aria-hidden="true" />
              Message on WhatsApp
            </a>
            <Link href="/shop" className="btn-outline">
              Shop Henna Cones
            </Link>
          </div>
          <p className="text-xs text-warm-gray mt-6 flex items-center justify-center gap-1.5">
            <Phone size={12} aria-hidden="true" />
            <span>+91 7561856754</span>
            <span className="mx-2">·</span>
            <MapPin size={12} aria-hidden="true" />
            <span>Karuvarakundu, Malappuram</span>
          </p>
        </div>
      </section>

    </div>
  )
}
