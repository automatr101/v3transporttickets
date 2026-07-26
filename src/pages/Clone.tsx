import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"

/* ============================================
    UNCONFIRMED DATA
    Every value below must be supplied by the client before launch.
    Deliberately left as findable placeholder tokens rather than
    plausible-looking invented values.
    ============================================ */
const WHATSAPP_NUMBER = "CONFIRM_WITH_CLIENT" // e.g. 233XXXXXXXXX (intl format, no +)
const WHATSAPP_MESSAGE = "Hi, I'd like to book a trip with V3 Transport."
const PHONE_NUMBER = "CONFIRM_WITH_CLIENT"

const Confirm = ({ what }: { what: string }) => (
  <span className="inline-block align-middle px-1.5 py-0.5 rounded bg-yellow-200 text-yellow-900 text-[11px] font-mono font-semibold uppercase tracking-wide">
    [confirm: {what}]
  </span>
)

/* ============================================
    NAV DATA
    Pills carry the three services V3 actually offers.
    Icon shapes are unchanged from the design system.
    ============================================ */
const NAV_LINKS = [
  {
    label: "Inter-Region Travel",
    href: "/",
    active: true,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    label: "Airport Transfers",
    href: "/airport-transfers",
    active: false,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        />
      </svg>
    ),
  },
  {
    label: "Private Charter",
    href: "/private-charter",
    active: false,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
  },
]

const FEATURE_BULLETS = [
  {
    title: "Punctuality",
    text: "Departures kept to schedule, so your plans hold",
    icon: (
      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    title: "Pay by Mobile Money",
    text: "Settle your fare the way you already pay",
    icon: (
      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Safety First",
    text: "Experienced drivers who know these roads",
    icon: (
      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
]

/* Stat VALUES are client metrics — not invented here. Labels describe the
   categories; each value renders a confirm marker until supplied. */
const STATS = [
  { label: "Passengers moved", color: "text-white" },
  { label: "Routes served", color: "text-rose-400" },
  { label: "Years operating", color: "text-cyan-400" },
  { label: "On-time rate", color: "text-lime-400" },
]

/* Route list is provisional — V3 must confirm which of these it actually serves. */
const PLACES = [
  "Bolgatanga",
  "Navrongo",
  "Bawku",
  "Tamale",
  "Wa",
  "Kumasi",
  "Accra",
  "Tamale Airport (TML)",
  "Kotoka Intl, Accra (ACC)",
]

const SOCIAL_ICONS = [
  {
    label: "Facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Twitter",
    path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
  },
  {
    label: "Linkedin",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Youtube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
]

const CHEVRON_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")"

export default function Clone() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("2026-07-27")
  const [passengers, setPassengers] = useState("1")

  const searchDisabled = !origin || !destination

  return (
    <div className="min-h-screen bg-[#F4EDE4] font-sans text-[#030712]">
      {/* ============================================
          HEADER SECTION
          ============================================ */}
      <header className="sticky top-0 z-50 bg-[#F4EDE4]">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          {/* 24px total to the nav — original composes this as mr-4 (16px) on the img
              plus sm:space-x-2 (8px) on the flex parent; mr-6 is the same rendered gap.
              Wordmark stands in for a real logo asset — see confirm list. */}
          {/* V3's own wordmark. Supplied artwork was white-on-navy; the navy was
              keyed out and the letterforms recoloured to #030712 for this cream
              header. logo-v3-light.png is the same mark in white for dark surfaces. */}
          <a href="/" className="flex items-center shrink-0 mr-6">
            <img src="/images/logo-v3-dark.png" alt="V3 Transport Services" className="h-5 w-auto" />
          </a>

          <div className="lg:flex-1 lg:flex flex-wrap items-center justify-between">
            <ul className="hidden lg:flex items-center gap-x-3 lg:text-base">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={
                      link.active
                        ? "inline-flex items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-900 text-white transition-colors duration-300 ease-in-out"
                        : "inline-flex items-center gap-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors duration-300 ease-in-out"
                    }
                  >
                    {link.icon}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="hidden lg:inline-block text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors duration-300 ease-in-out"
            >
              Contact
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center"
          >
            {mobileNavOpen ? (
              <svg
                className="w-10 h-10 text-slate-900"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-10 h-10 text-slate-900"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile nav dropdown */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="lg:hidden absolute top-14 left-0 w-full z-40 px-4 pb-4"
            >
              <div className="bg-white rounded-xl shadow-xl p-6">
                <ul className="space-y-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className={
                          link.active
                            ? "flex items-center gap-x-2 px-4 py-3 rounded-full text-sm font-medium bg-gray-900 text-white"
                            : "flex items-center gap-x-2 px-4 py-3 rounded-md text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors duration-300 ease-in-out"
                        }
                      >
                        {link.icon}
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 text-center">
                  <a
                    href="#contact"
                    className="inline-block py-3 text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors duration-300 ease-in-out"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="bg-[#F4EDE4]">
        <div className="mx-auto max-w-6xl p-6">
          <h1 className="font-rubik font-extrabold text-[#030712]">
            <span className="block text-[48px] leading-[48px] tracking-[-2.4px] sm:text-[60px] sm:leading-[60px] sm:tracking-[-3px] lg:text-[72px] lg:leading-[72px] lg:tracking-[-3.6px]">
              Northern Ghana's <span className="text-orange-600">Trusted</span>
            </span>
            <span className="block text-[48px] leading-[48px] tracking-[-2.4px] sm:text-[60px] sm:leading-[60px] sm:tracking-[-3px] lg:text-[72px] lg:leading-[72px] lg:tracking-[-3.6px]">
              Way to Move<span className="text-orange-600">.</span>
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-[18px] leading-[28px] font-light tracking-tight text-[#030712]">
            Reliable inter-region travel and airport transfers, based in the heart of Bolgatanga.
          </p>

          {/* ============================================
              BOOKING CARD
              ============================================ */}
          <div className="mt-5 mb-8">
            <div className="mx-auto sm:flex sm:space-x-3 p-3 bg-white shadow-md rounded-2xl sm:rounded-full">
              <div className="flex-1 flex items-center px-1 py-2 sm:py-0 sm:pr-3">
                <label className="sr-only" htmlFor="origin">
                  Origin
                </label>
                <select
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full appearance-none bg-transparent bg-no-repeat bg-[right_0.25rem_center] pr-6 py-3 px-4 rounded-full text-sm !font-mono font-semibold text-black border border-transparent focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 transition-colors duration-300 ease-in-out cursor-pointer"
                  style={{ backgroundImage: CHEVRON_BG }}
                >
                  <option value="">Travelling from?</option>
                  {PLACES.map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex items-center px-1 py-2 sm:py-0 sm:px-3">
                <label className="sr-only" htmlFor="destination">
                  Destination
                </label>
                <select
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full appearance-none bg-transparent bg-no-repeat bg-[right_0.25rem_center] pr-6 py-3 px-4 rounded-full text-sm !font-mono font-semibold text-black border border-transparent focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 transition-colors duration-300 ease-in-out cursor-pointer"
                  style={{ backgroundImage: CHEVRON_BG }}
                >
                  <option value="">Select a destination</option>
                  {PLACES.map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center px-1 py-2 sm:py-0 sm:px-3">
                <label className="sr-only" htmlFor="travel-date">
                  Travel Date
                </label>
                <input
                  id="travel-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full sm:w-auto py-3 px-4 rounded-full text-sm !font-mono font-semibold text-black border border-transparent focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 transition-colors duration-300 ease-in-out"
                />
              </div>

              <div className="flex items-center px-1 py-2 sm:py-0 sm:px-3">
                <label className="sr-only" htmlFor="passengers">
                  Passengers
                </label>
                <select
                  id="passengers"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full sm:w-auto appearance-none bg-transparent bg-no-repeat bg-[right_0.25rem_center] pr-6 py-3 px-4 rounded-full text-sm !font-mono font-semibold text-black border border-transparent focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 transition-colors duration-300 ease-in-out cursor-pointer"
                  style={{ backgroundImage: CHEVRON_BG }}
                >
                  {["1", "2", "3", "4", "5", "6+"].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === "1" ? "passenger" : "passengers"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 sm:pt-0 sm:flex sm:items-center">
                <button
                  type="button"
                  disabled={searchDisabled}
                  className="w-full sm:w-auto py-3 px-6 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-3xl border border-transparent bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-300 ease-in-out"
                >
                  <svg
                    className="w-5 h-5 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                  Search Trips
                </button>
              </div>
            </div>
          </div>

          {/* Trust line — replaces the offline-USSD line from the source design.
              This is not an app-based business, so no store badges exist. */}
          <div className="text-sm text-[#1F2937]">
            <span>Mobile Money accepted · Operating from the SSNIT Building, Bolgatanga</span>
            <br />
            <span className="font-bold">Local operators, local routes, local knowledge</span>
          </div>
        </div>
      </section>

      {/* ============================================
          ABOUT SECTION
          ============================================ */}
      <section id="about" className="bg-white">
        <div className="mx-auto max-w-6xl p-6 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <img
              src="/images/hero-bus.png"
              alt="V3 Transport coach for inter-region travel"
              className="w-full max-w-sm lg:max-w-none"
            />
          </div>

          <div className="order-2 lg:order-1">
            <h2 className="font-rubik font-bold text-[30px] leading-[36px] tracking-[-0.75px] sm:text-[36px] sm:leading-[40px] sm:tracking-[-0.9px] text-gray-900">
              Who We Are
            </h2>
            <p className="mt-4 text-[18px] leading-[28px] text-gray-600">
              V3 Transport Services is a Bolgatanga-based transport company connecting travelers across Northern Ghana
              and beyond. Operating from the SSNIT Building in Bolgatanga's commercial center, we serve as a key link
              for inter-region travel, airport transfers, and private charter — built on punctuality, safety, and local
              knowledge of the routes that matter.
            </p>

            <ul className="mt-8 space-y-5">
              {FEATURE_BULLETS.map((bullet) => (
                <li key={bullet.title} className="flex items-start gap-x-4">
                  <span className="w-10 h-10 shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                    {bullet.icon}
                  </span>
                  <span>
                    <h3 className="text-[16px] leading-6 font-semibold text-gray-900">{bullet.title}</h3>
                    <p className="text-[14px] leading-5 text-gray-600">{bullet.text}</p>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-x-6">
              <a
                href="#book"
                className="flex items-center px-6 py-3 rounded text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 transition-colors duration-300 ease-in-out"
              >
                Book a Trip
              </a>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center px-6 py-3 rounded text-sm font-medium text-black hover:text-gray-600 transition-colors duration-300 ease-in-out"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          TRACK RECORD SECTION
          ============================================ */}
      <section className="relative isolate overflow-hidden py-24 sm:py-32">
        <img
          src="/images/city-view-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-30 h-full w-full object-cover"
        />
        {/* NOTE: the original declares bg-gray-950/80 on the stacking-context root itself,
            so it paints *behind* the opaque -z-30 photo and never visually applies. Reproducing
            it as a real overlay div here would dim the photo 80% and diverge from what the live
            site actually renders, so it is intentionally omitted. See review-notes.md, Major #2. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -z-10 -bottom-8 -left-96 sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10 transform-gpu blur-3xl"
        >
          <div
            className="aspect-[1266/975] w-[79.125rem] opacity-20"
            style={{
              backgroundImage: "linear-gradient(to top right, rgb(255,70,148), rgb(119,111,255))",
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <p className="text-base font-semibold leading-8 text-lime-400">Our track record</p>
          <p className="mt-2 font-rubik font-bold text-[36px] leading-[40px] text-white max-w-2xl">
            Moving Northern Ghana, one trip at a time.
          </p>
          <p className="mt-6 text-[18px] leading-8 text-gray-200 max-w-2xl">
            Bolgatanga sits at the crossroads of the Upper East, and we run the connections that hold the region
            together — north to Navrongo and Bawku, south to Tamale, Kumasi and Accra, and out to the airport when the
            journey continues by air. <Confirm what="track-record narrative" />
          </p>

          <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-y-3 border-l border-white/10 pl-6">
                <dd className={`order-first text-[30px] font-semibold tracking-tight ${stat.color}`}>
                  <Confirm what="figure" />
                </dd>
                <dt className="text-sm leading-6 text-white">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============================================
          OPEN ITEMS — REMOVE BEFORE LAUNCH
          Visible checklist of everything that must come from the client.
          ============================================ */}
      <section id="contact" className="bg-yellow-50 border-y-2 border-yellow-300 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-rubik font-bold text-[20px] leading-7 text-yellow-900">
            [CONFIRM WITH CLIENT] — not yet supplied, nothing invented
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-yellow-900">
            <li>
              <strong>Phone number</strong> — "Call Now" links to <code className="font-mono">tel:{PHONE_NUMBER}</code>
            </li>
            <li>
              <strong>WhatsApp number</strong> — floating button links to{" "}
              <code className="font-mono">wa.me/{WHATSAPP_NUMBER}</code>
            </li>
            <li>
              <strong>Exact address / GPS</strong> — currently "SSNIT Building, Bolgatanga, Upper East Region, Ghana"
              with no street line or GhanaPost GPS code
            </li>
            <li>
              <strong>Fares</strong> — no prices anywhere on the page
            </li>
            <li>
              <strong>Operating hours</strong> — not stated
            </li>
            <li>
              <strong>Track-record figures</strong> — the four statistics are placeholders
            </li>
            <li>
              <strong>Routes served</strong> — the origin/destination lists are provisional
            </li>
            <li>
              <strong>Social profiles</strong> — footer icons link nowhere
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================
          FOOTER SECTION
          ============================================ */}
      <footer className="bg-[#F4EDE4] px-6 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <nav role="Utility navigation">
            <ul className="lg:flex items-center justify-center text-center lg:my-6 mb-6 lg:text-base text-lg">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "#about" },
                { label: "Contact", href: "#contact" },
              ].map((item) => (
                <li key={item.label} className="py-3 lg:py-0">
                  <a
                    href={item.href}
                    className="px-3 py-2 text-black hover:text-gray-700 transition-colors duration-300 ease-in-out"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex items-center justify-center gap-x-6 mb-6">
            {SOCIAL_ICONS.map((social) => (
              <li key={social.label}>
                <a href="#" aria-label={social.label} className="group inline-flex">
                  <svg
                    className="w-6 h-6 fill-current text-stone-700 group-hover:text-gray-600 transition-colors duration-300 ease-in-out"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <p className="text-sm text-slate-600">SSNIT Building, Bolgatanga, Upper East Region, Ghana</p>
          <p className="mt-2 text-sm text-slate-600">© V3 Transport Services. All Rights Reserved.</p>
        </div>
      </footer>

      {/* ============================================
          WHATSAPP FLOATING BUTTON
          ============================================ */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with V3 Transport on WhatsApp"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1EBE5B] transition-colors duration-300 ease-in-out"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.174-.297-.019-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.116-.198.058-.371-.015-.52-.074-.149-.669-1.612-.916-2.207-.241-.579-.486-.5-.668-.51-.172-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  )
}
