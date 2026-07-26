/* ============================================================================
   BOOKING DATA LAYER

   >>> THIS IS MOCK DATA. NO SUPABASE PROJECT IS CONNECTED. <<<

   Every function below returns locally-generated sample data so the booking
   flow is demoable end to end. Each one carries the exact Supabase query that
   should replace it. Swapping to real data is confined to THIS FILE — no
   component imports anything else.

   To go live:
     1. npm install @supabase/supabase-js
     2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local
     3. Uncomment the client below, replace each function body with the
        commented query, and set IS_MOCK = false
     4. Delete the MOCK DATA section

   Expected schema:
     routes   (id, origin text, destination text)
     trips    (id, origin text, destination text, date date,
               departure_time time, seats_available int, fare numeric)
     bookings (id, trip_id fk, passenger_name text, phone text,
               seats int, status text default 'pending', created_at timestamptz)
   ============================================================================ */

// import { createClient } from "@supabase/supabase-js"
// export const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY,
// )

/** Flip to false once the Supabase queries above are wired up. Drives the
 *  "sample data" notice in the UI so a demo is never mistaken for real
 *  schedules, seat counts, or fares. */
export const IS_MOCK = true

export type Trip = {
  id: string
  origin: string
  destination: string
  /** YYYY-MM-DD */
  date: string
  /** HH:MM, 24-hour */
  departureTime: string
  seatsAvailable: number
  /** Ghana cedis */
  fare: number
}

export type BookingDraft = {
  tripId: string
  passengerName: string
  phone: string
  seats: number
}

export type Booking = BookingDraft & {
  id: string
  status: "pending"
  createdAt: string
}

/** Local-time YYYY-MM-DD. Deliberately not toISOString(), which is UTC and
 *  rolls the date over early for anyone west of Greenwich — Ghana is UTC+0 but
 *  the client and any traveller abroad may not be. */
export function toISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function today(): string {
  return toISODate(new Date())
}

/* ============================================================================
   MOCK DATA — delete this whole section when Supabase is connected.
   Routes are provisional and fares are NOT real: both are on the client
   confirm list. Nothing here should ever be quoted to a customer.
   ============================================================================ */

type MockRoute = {
  origin: string
  destination: string
  departures: { time: string; fare: number; baseSeats: number }[]
}

const MOCK_ROUTES: MockRoute[] = [
  {
    origin: "Bolgatanga",
    destination: "Tamale",
    departures: [
      { time: "06:00", fare: 70, baseSeats: 14 },
      { time: "10:30", fare: 70, baseSeats: 9 },
      { time: "15:00", fare: 80, baseSeats: 21 },
    ],
  },
  {
    origin: "Bolgatanga",
    destination: "Accra",
    departures: [
      { time: "05:30", fare: 320, baseSeats: 11 },
      { time: "19:00", fare: 350, baseSeats: 6 },
    ],
  },
  {
    origin: "Bolgatanga",
    destination: "Kumasi",
    departures: [{ time: "07:15", fare: 240, baseSeats: 17 }],
  },
  {
    origin: "Bolgatanga",
    destination: "Tamale Airport (TML)",
    departures: [
      { time: "04:45", fare: 150, baseSeats: 5 },
      { time: "11:00", fare: 150, baseSeats: 8 },
    ],
  },
  {
    origin: "Navrongo",
    destination: "Bolgatanga",
    departures: [
      { time: "08:00", fare: 25, baseSeats: 18 },
      { time: "16:30", fare: 25, baseSeats: 12 },
    ],
  },
  {
    origin: "Bawku",
    destination: "Bolgatanga",
    departures: [{ time: "09:30", fare: 40, baseSeats: 15 }],
  },
]

/** Mock schedules run this many days forward from today, so the demo keeps
 *  working tomorrow instead of going empty the moment a hardcoded date passes. */
const MOCK_HORIZON_DAYS = 21

/** Deterministic per trip so seat counts stay stable across re-renders and
 *  reloads rather than flickering to a new random number each search. */
function seatJitter(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return Math.abs(h) % 7
}

function mockTripsFor(origin: string, destination: string, date: string): Trip[] {
  const route = MOCK_ROUTES.find((r) => r.origin === origin && r.destination === destination)
  if (!route) return []

  const target = new Date(`${date}T00:00:00`)
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const daysOut = Math.round((target.getTime() - todayStart.getTime()) / 86_400_000)
  if (daysOut < 0 || daysOut > MOCK_HORIZON_DAYS) return []

  return route.departures
    .filter((d) => {
      // Hide departures that have already left today.
      if (daysOut > 0) return true
      const [h, m] = d.time.split(":").map(Number)
      return h * 60 + m > now.getHours() * 60 + now.getMinutes()
    })
    .map((d) => {
      const id = `${origin}|${destination}|${date}|${d.time}`
      const seats = Math.max(0, d.baseSeats - seatJitter(id))
      return {
        id,
        origin,
        destination,
        date,
        departureTime: d.time,
        seatsAvailable: seats,
        fare: d.fare,
      }
    })
    .filter((t) => t.seatsAvailable > 0)
    .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
}

/* ========================================================================= */

/**
 * Distinct origins.
 * SUPABASE:
 *   const { data } = await supabase.from("routes").select("origin")
 *   return [...new Set(data.map(r => r.origin))].sort()
 */
export async function listOrigins(): Promise<string[]> {
  return [...new Set(MOCK_ROUTES.map((r) => r.origin))].sort()
}

/**
 * Destinations reachable from `origin`; all destinations when origin is empty.
 * SUPABASE:
 *   let q = supabase.from("routes").select("destination")
 *   if (origin) q = q.eq("origin", origin)
 *   const { data } = await q
 *   return [...new Set(data.map(r => r.destination))].sort()
 */
export async function listDestinations(origin?: string): Promise<string[]> {
  const rows = origin ? MOCK_ROUTES.filter((r) => r.origin === origin) : MOCK_ROUTES
  return [...new Set(rows.map((r) => r.destination))].sort()
}

/**
 * Trips matching origin + destination + date.
 * SUPABASE:
 *   const { data, error } = await supabase
 *     .from("trips")
 *     .select("id, origin, destination, date, departure_time, seats_available, fare")
 *     .eq("origin", origin)
 *     .eq("destination", destination)
 *     .eq("date", date)
 *     .gt("seats_available", 0)
 *     .order("departure_time")
 *   if (error) throw error
 *   return data.map(mapRowToTrip)
 */
export async function searchTrips(params: {
  origin: string
  destination: string
  date: string
}): Promise<Trip[]> {
  // Small delay so loading states are exercised in the demo the same way a
  // real network round trip would exercise them.
  await new Promise((r) => setTimeout(r, 350))
  return mockTripsFor(params.origin, params.destination, params.date)
}

/**
 * Writes a booking with status "pending".
 * SUPABASE:
 *   const { data, error } = await supabase
 *     .from("bookings")
 *     .insert({
 *       trip_id: draft.tripId,
 *       passenger_name: draft.passengerName,
 *       phone: draft.phone,
 *       seats: draft.seats,
 *       status: "pending",
 *     })
 *     .select()
 *     .single()
 *   if (error) throw error
 *   return mapRowToBooking(data)
 *
 * NOTE: seat decrementing is not handled here. Doing it client-side races
 * between concurrent bookings — it belongs in a Postgres transaction or an
 * edge function that books the seat and writes the row atomically.
 */
export async function createBooking(draft: BookingDraft): Promise<Booking> {
  await new Promise((r) => setTimeout(r, 400))
  return {
    ...draft,
    id: `MOCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  }
}

/** 24h "15:00" -> "3:00 PM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number)
  const suffix = h < 12 ? "AM" : "PM"
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`
}

/** Currency is shown as GHS rather than a bare number so a mock fare can never
 *  be mistaken for a confirmed price in a screenshot. */
export function formatFare(amount: number): string {
  return `GHS ${amount.toFixed(2)}`
}
