import { Thermometer } from 'lucide-react'

export default function StorageWarningBanner() {
  return (
    <div className="storage-warning" role="alert">
      <span className="inline-flex items-center gap-2 justify-center">
        <Thermometer size={16} strokeWidth={2} aria-hidden="true" />
        Store in freezer immediately upon arrival. Product spoils if left outside freezer for more than 3 days.
      </span>
    </div>
  )
}
