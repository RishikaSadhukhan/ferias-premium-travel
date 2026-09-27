import { destinationBySlug, isDestinationSlug } from '../data/destinations'
import type { EnquiryValues } from './validateEnquiry'

export type SubmitResult = { ok: true; demo: boolean } | { ok: false; message: string }

const ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

const journeyLabel = (slug: string) =>
  isDestinationSlug(slug) ? `${destinationBySlug[slug].packageName} — ${destinationBySlug[slug].name}` : 'Not sure yet'

/**
 * Sends the enquiry through Web3Forms (free, no backend). Without an access
 * key the form runs in demo mode: it resolves successfully and sends nothing.
 */
export async function submitEnquiry(values: EnquiryValues, honeypot: string): Promise<SubmitResult> {
  if (honeypot) return { ok: true, demo: true } // quietly drop bots

  if (!ACCESS_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    return { ok: true, demo: true }
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `New journey enquiry — ${journeyLabel(values.destination)}`,
        from_name: 'FÉRIAS website',
        name: values.name.trim(),
        email: values.email.trim(),
        journey: journeyLabel(values.destination),
        departure: values.departure,
        return: values.return || '—',
        flexible_dates: values.flexible ? 'Yes' : 'No',
        travellers: values.travellers,
        message: values.message.trim() || '—',
      }),
    })
    const data = (await response.json().catch(() => ({}))) as { success?: boolean; message?: string }
    if (response.ok && data.success) return { ok: true, demo: false }
    return { ok: false, message: data.message ?? 'The enquiry could not be sent.' }
  } catch {
    return { ok: false, message: 'We couldn’t reach the server. Check your connection and try again.' }
  }
}
