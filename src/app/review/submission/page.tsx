import type { Metadata } from 'next'
import ReviewForm from './ReviewForm'

export const metadata: Metadata = {
  title: 'Share Your Experience — Henna by Chippy',
  description:
    'Tell Chippy how your henna turned out. Share photos, your stain result, and how long you kept it on.',
}

export default function ReviewSubmissionPage() {
  return <ReviewForm />
}
