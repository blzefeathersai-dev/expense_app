import React from 'react'

export default function CountUp({ value = 0, duration = 600, formatter = v => v }) {
  const [display, setDisplay] = React.useState(value)
  const rafRef = React.useRef(null)

  React.useEffect(() => {
    const start = performance.now()
    const from = Number(display)
    const to = Number(value)
    if (from === to) return
    function step(ts) {
      const t = Math.min(1, (ts - start) / duration)
      const cur = from + (to - from) * t
      setDisplay(Number(cur.toFixed(2)))
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span>{formatter(display)}</span>
}
