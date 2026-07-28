# V3 Transport — outstanding items

This list used to render as a yellow block on the page itself. It was removed so the site reviews
cleanly as a concept, but nothing here is resolved. Grep `CONFIRM_WITH_CLIENT` to find the wiring
points in code.

## Must have before the site goes live

| Item | Current state | Where |
|---|---|---|
| **Phone number** | `tel:CONFIRM_WITH_CLIENT` — the "Call the station" and "Call Now" buttons do not dial | `PHONE_NUMBER` in `src/pages/Clone.tsx` |
| **WhatsApp number** | `wa.me/CONFIRM_WITH_CLIENT` — floating button and contact button do not open a chat | `WHATSAPP_NUMBER` in `src/pages/Clone.tsx` |
| **Exact address / GhanaPost GPS** | "SSNIT Building, Bolgatanga, Upper East Region" with no street line or GPS code | Contact section |
| **Map pin** | Approximate coordinate 10.7875, -0.853 | `MAP_LAT` / `MAP_LNG` in `src/pages/Clone.tsx` |
| **Routes actually served** | 14 corridors, both directions, built around Bolgatanga. Provisional — V3 must confirm which it runs | `MOCK_ROUTES` in `src/lib/booking.ts` |
| **Fares** | **Not V3's prices.** See the note below | `MOCK_ROUTES` in `src/lib/booking.ts` |
| **Schedules** | Sample departure times | `MOCK_ROUTES` in `src/lib/booking.ts` |
| **Booking backend** | No Supabase project. Bookings are not saved anywhere | `src/lib/booking.ts`, `IS_MOCK` |
| **Social profiles** | Footer icons link to `#` | `SOCIAL_ICONS` in `src/pages/Clone.tsx` |
| **Opening hours** | Plausible placeholder hours are shown — confirm or correct them | Contact section |
| **Logo source** | Raster derived from a JPEG; no vector | `public/images/logo-v3-dark.png` |

## Where the fares came from — read this before showing anyone

**Every fare on the site is a placeholder, and none of them were set by V3.**

Each route in `MOCK_ROUTES` carries a `fareSource` field:

- **`vip`** — the corridor also runs on vipbustickets.com, and their published fare is used as a
  market-rate anchor so the demo shows a believable number. Accra↔Bolgatanga GHS 410,
  Navrongo→Accra GHS 420, Bawku→Accra GHS 430.
- **`derived`** — short Upper East legs VIP does not run (Bolgatanga to Navrongo, Bawku, Tamale,
  and the airport transfers). Scaled from VIP's long-haul rates, which work out around
  GHS 0.5–0.6 per km. Estimates, not quotes.

This is a competitor's pricing being used as scaffolding. It makes the concept read as real
instead of arbitrary, but **V3 must replace every one of these with its own prices before launch**,
and nobody should quote a figure off this site in the meantime. The routes table and every search
result carry a "Demonstration timetable / schedule" caption for exactly that reason — do not remove
those captions until `IS_MOCK` is false and the fares are V3's own.

## Deliberately not on this list any more

**Track-record statistics.** The band used to carry four counters (passengers moved, routes served,
years operating, on-time rate) with no figures behind them. Rather than invent numbers about a real
business, that band is now four benefit cards — the same approach vipbustickets.com takes, which
has no statistics section at all. There is nothing left to confirm there. If V3 supplies real,
defensible figures and wants counters back, `src/hooks/useCountUp.ts` is still in the repo.

**A printed phone number in the contact block.** Also following the reference site, contact runs
through buttons rather than a number printed in the copy. A fabricated Ghanaian mobile number on a
public page is somebody's real line.

## Licensing — separate from the above

`public/images/city-view-bg.jpg` and `public/images/hero-bus.png` originate from
`travel.egotickets.com` and are not licensed to V3. Replace with V3's own photography at 1200x800
and 1200x853 before any real launch. See the design provenance note in the README.
