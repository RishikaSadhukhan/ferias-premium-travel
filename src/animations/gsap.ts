import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register once, import from here everywhere else.
gsap.registerPlugin(ScrollTrigger, useGSAP)

gsap.defaults({ ease: 'power3.out', duration: 0.9 })

// Mobile address bars resize the viewport constantly; don't re-measure for that.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, useGSAP }
