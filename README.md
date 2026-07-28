# V3 Transport Services — Bolgatanga, Upper East Region, Ghana

Marketing site for V3 Transport Services: inter-region travel, airport transfers, and
private charter, operating from the SSNIT Building in Bolgatanga.

Vite + React 19 + TypeScript, Tailwind CSS v4, `motion` for animation.

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
```

The whole page is one component: [`src/pages/Clone.tsx`](src/pages/Clone.tsx), with sections
divided by banner comments (Header, Hero, Booking card, About, Track record, Open items, Footer,
WhatsApp button). `src/App.tsx` renders it at the root route.

## Booking flow

The hero search card is wired end to end: route dropdowns -> trip search -> results ->
booking form -> `pending` booking record.

**No Supabase project is connected.** All data comes from [`src/lib/booking.ts`](src/lib/booking.ts),
which generates sample routes and schedules locally. Every exported function carries the exact
Supabase query that should replace it, and the swap is confined to that one file — no component
imports anything else. Setting `IS_MOCK = false` also removes the "Sample data" notice that
currently sits above the results, which exists so a demo is never mistaken for real availability
or fares.

Mock schedules are generated relative to today across a 21-day horizon rather than hardcoded to
fixed dates, so the demo does not go empty tomorrow. Departures that have already left are hidden
from today's results.

Expected schema (`routes`, `trips`, `bookings`) is documented at the top of that file. Note that
seat decrementing is deliberately *not* implemented client-side — it races between concurrent
bookings and belongs in a Postgres transaction or edge function.

## The dark band: benefits, not statistics

That section originally held four count-up statistics with no figures behind them, rendering as em
dashes. It is now four benefit cards (`WHY_BOOK` in `Clone.tsx`).

This follows [vipbustickets.com](https://www.vipbustickets.com/), which has **no statistics section
at all** — it fills the equivalent slot with benefit cards ("24/7 Booking", "Mobile Money",
"E-Ticket"). That is the honest way to fill the space: the slot reads as finished without asserting
a number nobody has verified.

[`src/hooks/useCountUp.ts`](src/hooks/useCountUp.ts) is retained and unused. If V3 supplies real
figures and wants counters restored, it counts from zero on scroll into view via
IntersectionObserver and honours `prefers-reduced-motion`.

## Map

Contact section uses a keyless Google Maps `output=embed` iframe, so there is no API key or
billing account to leak. The pin is an approximate coordinate for the SSNIT Building
(`MAP_LAT` / `MAP_LNG` in `Clone.tsx`) — replace with the exact GhanaPost GPS code when supplied.

## Unconfirmed content — do not launch without resolving

The page renders a visible yellow `[CONFIRM WITH CLIENT]` block above the footer listing every
value the client has not yet supplied. Placeholders are deliberately broken, findable tokens
(`CONFIRM_WITH_CLIENT`) rather than plausible invented values, so nothing fake can ship by accident.

Outstanding: phone number, WhatsApp number, exact street address / GhanaPost GPS code, fares,
operating hours, the four track-record figures, the list of routes actually served, and social
profile URLs.

Grep for `CONFIRM_WITH_CLIENT` to find the wiring points. Remove the "Open items" `<section>`
once everything is filled in.

## Design provenance — read before shipping

The layout, spacing, type scale, and component design are a close reproduction of
`travel.egotickets.com`, produced as a reference build. Two image files in `public/images/`
originate from that site and are **not** licensed to V3 Transport:

- `city-view-bg.jpg` — track-record section background
- `hero-bus.png` — About section illustration

These are placeholders pending V3's own photography. Replace them at the same dimensions
(1200x800 and 1200x853) before any public launch.

A further eight unreferenced files from the same source (the eGotravel logo SVGs, favicons, and
OG banner) were moved to `_reference-assets/` and are gitignored — no component renders them.

## Logo

`public/images/logo-v3-dark.png` is V3's own wordmark, used in the header at `h-5` (renders
125x20 from a 748x120 source, so ~6x density).

The supplied artwork was a JPEG of white letterforms on a flat navy field. It was cropped to the
mark's bounding box, the navy keyed out to transparency, and the letterforms recoloured to
`#030712` to sit on this cream header. The orange period is preserved at its source value
`#FB3B17` — it is detected by hue and given its own alpha, otherwise a luminance key would have
rendered it semi-transparent.

`logo-v3-light.png` is the same mark left white, for dark surfaces (footer variant, OG image).

**This is a raster derived from a JPEG.** Ask the client for the vector source (SVG/AI/Figma) —
the sliced letterforms will not survive being scaled up for signage or vehicle livery, and a
vector would also drop the header asset from ~38 KB to about 3 KB.
