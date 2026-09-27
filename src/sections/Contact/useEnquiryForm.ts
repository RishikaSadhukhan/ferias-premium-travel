import { useCallback, useMemo, useRef, useState, type FormEvent } from 'react'
import type { PlanRequest } from '../../context/journeys'
import { submitEnquiry } from '../../utils/submitEnquiry'
import {
  emptyEnquiry,
  fieldOrder,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryField,
  type EnquiryValues,
} from '../../utils/validateEnquiry'

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

/**
 * State for the three-act enquiry. Errors appear once a field is left
 * (touched) or after a submit attempt, then update live as the user fixes them.
 */
export function useEnquiryForm(planRequest: PlanRequest | null) {
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<EnquiryValues>(() => ({ ...emptyEnquiry, destination: planRequest?.slug ?? '' }))
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [serverError, setServerError] = useState('')
  const [demo, setDemo] = useState(false)

  // "Plan this journey" from a slate preselects the destination.
  const [lastRequest, setLastRequest] = useState(planRequest)
  if (planRequest !== lastRequest) {
    setLastRequest(planRequest)
    if (planRequest) {
      setValues((v) => ({ ...v, destination: planRequest.slug }))
      setStatus('idle')
    }
  }

  const allErrors = useMemo(() => validateEnquiry(values), [values])
  const errors: EnquiryErrors = useMemo(() => {
    const visible: EnquiryErrors = {}
    for (const field of fieldOrder) {
      if (allErrors[field] && (attempted || touched[field])) visible[field] = allErrors[field]
    }
    return visible
  }, [allErrors, attempted, touched])

  const setField = useCallback(<K extends EnquiryField>(field: K, value: EnquiryValues[K]) => {
    setValues((v) => ({ ...v, [field]: value }))
    setStatus((st) => (st === 'error' ? 'idle' : st))
  }, [])

  const touch = useCallback((field: EnquiryField) => setTouched((t) => ({ ...t, [field]: true })), [])

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setAttempted(true)
      const firstInvalid = fieldOrder.find((field) => allErrors[field])
      if (firstInvalid) {
        formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus()
        return
      }
      const honeypot = new FormData(event.currentTarget).get('company')?.toString() ?? ''
      setStatus('submitting')
      const result = await submitEnquiry(values, honeypot)
      if (result.ok) {
        setDemo(result.demo)
        setStatus('success')
      } else {
        setServerError(result.message)
        setStatus('error')
      }
    },
    [allErrors, values],
  )

  const reset = useCallback(() => {
    setValues(emptyEnquiry)
    setTouched({})
    setAttempted(false)
    setServerError('')
    setStatus('idle')
  }, [])

  return { formRef, values, errors, status, serverError, demo, setField, touch, submit, reset }
}
