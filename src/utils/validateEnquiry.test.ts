import { describe, expect, it } from 'vitest'
import { emptyEnquiry, validateEnquiry, type EnquiryValues } from './validateEnquiry'

const today = new Date(2026, 8, 27) // 27 Sep 2026, local time

const valid: EnquiryValues = {
  ...emptyEnquiry,
  destination: 'kerala',
  departure: '2026-12-10',
  return: '2026-12-17',
  travellers: 2,
  name: 'Amara Iyer',
  email: 'amara@example.com',
}

describe('validateEnquiry', () => {
  it('accepts a complete enquiry', () => {
    expect(validateEnquiry(valid, today)).toEqual({})
  })

  it('flags every required field on an empty form', () => {
    const errors = validateEnquiry(emptyEnquiry, today)
    expect(Object.keys(errors).sort()).toEqual(['departure', 'destination', 'email', 'name', 'return'])
  })

  it('accepts "undecided" but rejects unknown destinations', () => {
    expect(validateEnquiry({ ...valid, destination: 'undecided' }, today).destination).toBeUndefined()
    expect(validateEnquiry({ ...valid, destination: 'atlantis' }, today).destination).toBeDefined()
  })

  it('rejects departures in the past and allows today', () => {
    expect(validateEnquiry({ ...valid, departure: '2026-09-26' }, today).departure).toBeDefined()
    expect(validateEnquiry({ ...valid, departure: '2026-09-27' }, today).departure).toBeUndefined()
  })

  it('requires return after departure', () => {
    expect(validateEnquiry({ ...valid, return: '2026-12-10' }, today).return).toBeDefined()
    expect(validateEnquiry({ ...valid, return: '2026-12-01' }, today).return).toBeDefined()
  })

  it('lets flexible travellers skip the return date', () => {
    expect(validateEnquiry({ ...valid, return: '', flexible: true }, today).return).toBeUndefined()
  })

  it('keeps travellers between 1 and 12', () => {
    expect(validateEnquiry({ ...valid, travellers: 0 }, today).travellers).toBeDefined()
    expect(validateEnquiry({ ...valid, travellers: 13 }, today).travellers).toBeDefined()
    expect(validateEnquiry({ ...valid, travellers: 12 }, today).travellers).toBeUndefined()
  })

  it('validates email shape', () => {
    expect(validateEnquiry({ ...valid, email: 'amara@example' }, today).email).toBeDefined()
    expect(validateEnquiry({ ...valid, email: '  amara@example.co  ' }, today).email).toBeUndefined()
  })

  it('limits message length', () => {
    expect(validateEnquiry({ ...valid, message: 'x'.repeat(1001) }, today).message).toBeDefined()
  })
})
