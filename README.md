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

## Unconfirmed content — do not launch without resolving

The page renders a visible yellow `[CONFIRM WITH CLIENT]` block above the footer listing every
value the client has not yet supplied. Placeholders are deliberately broken, findable tokens
(`CONFIRM_WITH_CLIENT`) rather than plausible invented values, so nothing fake can ship by accident.

Outstanding: phone number, WhatsApp number, exact street address / GhanaPost GPS code, fares,
operating hours, the four track-record figures, the list of routes actually served, logo artwork,
and social profile URLs.

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

The header wordmark is set in type because no V3 logo asset exists yet.
