import { useEffect, useRef, useState } from "react"

/**
 * Counts from 0 up to `target` once the element scrolls into view.
 *
 * `target` of null means "figure not supplied yet" — the hook stays dormant and
 * the caller renders a placeholder. That is the current state of every V3 stat;
 * see STATS in Clone.tsx. When a real number is dropped into the config the
 * animation starts working with no other change.
 *
 * Fires once. Re-entering the viewport does not replay it.
 */
export function useCountUp(
  target: number | null,
  options: { duration?: number; decimals?: number } = {},
) {
  const { duration = 1600, decimals = 0 } = options
  const ref = useRef<HTMLDivElement | null>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (target === null) return
    const el = ref.current
    if (!el) return

    const run = () => {
      if (started.current) return
      started.current = true

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (reduced) {
        setValue(target)
        return
      }

      const t0 = performance.now()
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / duration)
        // easeOutCubic — fast start, gentle settle, so the final digits are readable
        const eased = 1 - Math.pow(1 - p, 3)
        const raw = target * eased
        const factor = Math.pow(10, decimals)
        setValue(Math.round(raw * factor) / factor)
        if (p < 1) requestAnimationFrame(step)
        else setValue(target)
      }
      requestAnimationFrame(step)
    }

    // IntersectionObserver is in every browser this site targets, but guard
    // anyway: without it, show the number rather than a permanent zero.
    if (typeof IntersectionObserver === "undefined") {
      run()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            run()
            io.disconnect()
          }
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, duration, decimals])

  return { ref, value, pending: target === null }
}
