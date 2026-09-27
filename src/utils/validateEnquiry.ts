import { isDestinationSlug } from '../data/destinations'
import { toISODate } from './format'

export interface EnquiryValues {
  destination: string
  departure: string
  return: string
  flexible: boolean
  travellers: number
  name: string
  email: string
  message: string
}

export type EnquiryField = keyof EnquiryValues
export type EnquiryErrors = Partial<Record<EnquiryField, string>>

export const TRAVELLERS_MIN = 1
export const TRAVELLERS_MAX = 12
export const MESSAGE_MAX = 1000

export const emptyEnquiry: EnquiryValues = {
  destination: '',
  departure: '',
  return: '',
  flexible: false,
  travellers: 2,
  name: '',
  email: '',
  message: '',
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Pure validation for the three-act enquiry. `today` is injectable so the
 * date rules are testable.
 */
export function validateEnquiry(values: EnquiryValues, today: Date = new Date()): EnquiryErrors {
  const errors: EnquiryErrors = {}
  const todayISO = toISODate(today)

  if (!values.destination) {
    errors.destination = 'Choose a journey — or “Not sure yet”.'
  } else if (values.destination !== 'undecided' && !isDestinationSlug(values.destination)) {
    errors.destination = 'Choose one of the four journeys.'
  }

  if (!values.departure) {
    errors.departure = 'Add a departure date.'
  } else if (values.departure < todayISO) {
    errors.departure = 'Departure can’t be in the past.'
  }

  if (!values.return && !values.flexible) {
    errors.return = 'Add a return date, or mark your dates as flexible.'
  } else if (values.return && values.departure && values.return <= values.departure) {
    errors.return = 'Return must be after departure.'
  }

  if (
    !Number.isInteger(values.travellers) ||
    values.travellers < TRAVELLERS_MIN ||
    values.travellers > TRAVELLERS_MAX
  ) {
    errors.travellers = `Between ${TRAVELLERS_MIN} and ${TRAVELLERS_MAX} travellers.`
  }

  const name = values.name.trim()
  if (name.length < 2) errors.name = 'Tell us your name.'
  else if (name.length > 80) errors.name = 'That name is a little long — 80 characters at most.'

  if (!values.email.trim()) errors.email = 'Add an email so we can reply.'
  else if (!EMAIL.test(values.email.trim())) errors.email = 'That email doesn’t look quite right.'

  if (values.message.length > MESSAGE_MAX) errors.message = `Keep it under ${MESSAGE_MAX} characters.`

  return errors
}

/** Fields in the order they appear, used to focus the first error. */
export const fieldOrder: EnquiryField[] = [
  'destination',
  'departure',
  'return',
  'travellers',
  'name',
  'email',
  'message',
]
