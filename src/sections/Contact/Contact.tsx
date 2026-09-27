import { useEffect, useRef } from 'react'
import { gsap } from '../../animations/gsap'
import { revealOnEnter } from '../../animations/reveal'
import { useMotionScope } from '../../animations/useMotionScope'
import { DestinationTiles } from '../../components/form/DestinationTiles'
import { Field } from '../../components/form/Field'
import { Stepper } from '../../components/form/Stepper'
import { Switch } from '../../components/form/Switch'
import { Button } from '../../components/ui/Button'
import { destinationBySlug, isDestinationSlug } from '../../data/destinations'
import { site } from '../../data/site'
import { useJourneys } from '../../context/journeys'
import { cx } from '../../utils/cx'
import { toISODate } from '../../utils/format'
import { MESSAGE_MAX, TRAVELLERS_MAX, TRAVELLERS_MIN } from '../../utils/validateEnquiry'
import { useEnquiryForm } from './useEnquiryForm'
import s from './Contact.module.css'

const formatDate = (iso: string) =>
  iso ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${iso}T00:00`)) : ''

export function Contact() {
  const { planRequest } = useJourneys()
  const { formRef, values, errors, status, serverError, demo, setField, touch, submit, reset } =
    useEnquiryForm(planRequest)
  const root = useRef<HTMLElement>(null)
  const successHeading = useRef<HTMLHeadingElement>(null)

  // The three acts arrive in order, once. The form never animates while in use.
  useMotionScope(root, (el) => {
    const q = gsap.utils.selector(el)
    revealOnEnter(q('[data-contact-head] > *'), el, { stagger: 0.1 })
    const [acts] = q('[data-contact-acts]')
    if (acts) revealOnEnter(q('[data-contact-acts] > fieldset'), acts, { stagger: 0.15, y: 36 })
    const [submitRow] = q('[data-contact-submit]')
    if (submitRow) revealOnEnter(submitRow, submitRow, { y: 16 })
  })
  const today = toISODate(new Date())

  useEffect(() => {
    if (status === 'success') successHeading.current?.focus()
  }, [status])

  const journey = isDestinationSlug(values.destination)
    ? destinationBySlug[values.destination].packageName
    : 'Not sure yet'

  return (
    <section ref={root} id="contact" className={s.contact} aria-labelledby="contact-title">
      <div className={s.head} data-contact-head>
        <h2 id="contact-title" className={cx('display', s.title)}>
          Your journey, <em>your cut.</em>
        </h2>
        <div className={cx('mono', s.meta)}>
          <p className={s.metaStrong}>Enquiry — three short acts</p>
          <p>A journey designer replies within 48 hours</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className={s.success} role="status">
          <p className="mono">That’s a wrap on Act III</p>
          <h3 ref={successHeading} tabIndex={-1} className={cx('display', s.successTitle)}>
            Your journey is in the edit, <em>{values.name.trim().split(' ')[0]}.</em>
          </h3>
          <p className={s.successBody}>
            A journey designer will write to {values.email.trim()} within 48 hours with a first cut of your route.
          </p>
          <dl className={s.summary}>
            <div>
              <dt className="mono">Journey</dt>
              <dd>{journey}</dd>
            </div>
            <div>
              <dt className="mono">Departing</dt>
              <dd>{formatDate(values.departure)}</dd>
            </div>
            <div>
              <dt className="mono">Returning</dt>
              <dd>{values.return ? formatDate(values.return) : 'Flexible'}</dd>
            </div>
            <div>
              <dt className="mono">Travellers</dt>
              <dd>{values.travellers}</dd>
            </div>
          </dl>
          {demo && (
            <p className={cx('mono', s.demo)}>
              Demo mode — nothing was sent. Add a Web3Forms key to go live.
            </p>
          )}
          <div className={s.successActions}>
            <Button variant="dark" icon="arrowRight" onClick={reset}>
              Plan another journey
            </Button>
          </div>
        </div>
      ) : (
        <form ref={formRef} className={s.form} onSubmit={submit} noValidate aria-describedby="contact-note">
          <div className={s.acts} data-contact-acts>
            <fieldset className={cx(s.act, s.where)} aria-describedby={errors.destination ? 'destination-error' : undefined}>
              <legend className={cx('mono', s.legend)}>Act I — Where</legend>
              <div className={s.tilesWrap}>
                <DestinationTiles
                  value={values.destination}
                  error={errors.destination}
                  onChange={(v) => setField('destination', v)}
                  onBlur={() => touch('destination')}
                />
              </div>
            </fieldset>

            <fieldset className={s.act}>
              <legend className={cx('mono', s.legend)}>Act II — When &amp; who</legend>
              <div className={s.dates}>
                <Field
                  id="enquiry-departure"
                  label="Departing"
                  type="date"
                  min={today}
                  value={values.departure}
                  error={errors.departure}
                  onChange={(e) => setField('departure', e.target.value)}
                  onBlur={() => touch('departure')}
                  data-field="departure"
                  required
                />
                <Field
                  id="enquiry-return"
                  label="Returning"
                  type="date"
                  min={values.departure || today}
                  value={values.return}
                  error={errors.return}
                  onChange={(e) => setField('return', e.target.value)}
                  onBlur={() => touch('return')}
                  data-field="return"
                />
              </div>
              <Stepper
                id="enquiry-travellers"
                label="Travellers"
                value={values.travellers}
                min={TRAVELLERS_MIN}
                max={TRAVELLERS_MAX}
                error={errors.travellers}
                onChange={(v) => setField('travellers', v)}
                onBlur={() => touch('travellers')}
              />
              <Switch
                id="enquiry-flexible"
                label="My dates are flexible"
                checked={values.flexible}
                onChange={(v) => setField('flexible', v)}
              />
            </fieldset>

            <fieldset className={s.act}>
              <legend className={cx('mono', s.legend)}>Act III — About you</legend>
              <Field
                id="enquiry-name"
                label="Name"
                autoComplete="name"
                placeholder="Your full name"
                value={values.name}
                error={errors.name}
                onChange={(e) => setField('name', e.target.value)}
                onBlur={() => touch('name')}
                data-field="name"
                required
              />
              <Field
                id="enquiry-email"
                label="Email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={values.email}
                error={errors.email}
                onChange={(e) => setField('email', e.target.value)}
                onBlur={() => touch('email')}
                data-field="email"
                required
              />
              <Field
                id="enquiry-message"
                label="The story so far"
                multiline
                rows={4}
                maxLength={MESSAGE_MAX}
                placeholder="An anniversary, a first time in the snow, travelling with grandparents…"
                hint="Optional — anything that helps us plan."
                value={values.message}
                error={errors.message}
                onChange={(e) => setField('message', e.target.value)}
                onBlur={() => touch('message')}
                data-field="message"
              />
            </fieldset>
          </div>

          {/* Spam trap: invisible to people, tempting to bots. */}
          <div className={s.honeypot} aria-hidden="true">
            <label htmlFor="enquiry-company">Company</label>
            <input id="enquiry-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {status === 'error' && (
            <div className={s.alert} role="alert">
              <span>{serverError}</span>
              <span>
                Or write to us at <a href={`mailto:${site.email}`}>{site.email}</a>.
              </span>
            </div>
          )}

          <div className={s.submitRow} data-contact-submit>
            <p id="contact-note" className={cx('mono', s.note)}>
              No payment · no obligation · we never share your details
            </p>
            <Button
              type="submit"
              variant="dark"
              icon="arrowRight"
              className={s.submit}
              disabled={status === 'submitting'}
              aria-busy={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending…' : status === 'error' ? 'Try again' : 'Start planning'}
            </Button>
          </div>
        </form>
      )}
    </section>
  )
}
