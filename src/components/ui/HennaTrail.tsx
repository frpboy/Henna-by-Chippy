'use client'

import { useEffect, useRef } from 'react'

// Henna leaf particle — a small teardrop shape that fades as it drifts downward.
// Rendered on a fixed canvas overlay so it never blocks clicks.
// Disabled on: touch devices, small screens (<768px), prefers-reduced-motion.

interface Particle {
  x: number
  y: number
  vx: number   // horizontal drift
  vy: number   // downward drift
  size: number
  alpha: number
  decay: number
  rotation: number
}

const HENNA_MAROON = '93, 41, 6'   // #5D2906 as RGB for rgba()
const MAX_PARTICLES = 40
const SPAWN_THROTTLE_MS = 16        // ~60fps spawn rate cap

export default function HennaTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const lastSpawn = useRef<number>(0)
  const enabled = useRef<boolean>(false)

  useEffect(() => {
    // Disable on touch devices and small screens
    const isTouch = window.matchMedia('(hover: none)').matches
    const isSmall = window.innerWidth < 768
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isTouch || isSmall || prefersReduced) return

    enabled.current = true
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Spawn a particle at cursor position
    const spawn = (x: number, y: number, now: number) => {
      if (now - lastSpawn.current < SPAWN_THROTTLE_MS) return
      lastSpawn.current = now

      if (particles.current.length >= MAX_PARTICLES) {
        particles.current.shift() // drop oldest
      }

      particles.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.8,   // slight horizontal wiggle
        vy: Math.random() * 0.6 + 0.3,       // drift downward
        size: Math.random() * 4 + 4,         // 4–8px
        alpha: 0.85,
        decay: Math.random() * 0.018 + 0.012, // fade speed
        rotation: Math.random() * Math.PI * 2,
      })
    }

    const onMouseMove = (e: MouseEvent) => {
      spawn(e.clientX, e.clientY, performance.now())
    }
    window.addEventListener('mousemove', onMouseMove)

    // Draw a henna leaf teardrop shape
    const drawLeaf = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation + p.vy * 0.5)
      ctx.globalAlpha = p.alpha

      ctx.beginPath()
      // Teardrop: pointy top, round bottom
      ctx.moveTo(0, -p.size)
      ctx.bezierCurveTo(
        p.size * 0.8, -p.size * 0.3,
        p.size * 0.8,  p.size * 0.6,
        0,             p.size
      )
      ctx.bezierCurveTo(
        -p.size * 0.8, p.size * 0.6,
        -p.size * 0.8, -p.size * 0.3,
        0,             -p.size
      )
      ctx.closePath()

      ctx.fillStyle = `rgba(${HENNA_MAROON}, ${p.alpha})`
      ctx.fill()
      ctx.restore()
    }

    // Animation loop
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current = particles.current.filter((p) => p.alpha > 0.01)

      for (const p of particles.current) {
        drawLeaf(ctx, p)
        p.x += p.vx
        p.y += p.vy
        p.alpha -= p.decay
        p.rotation += 0.015
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Render nothing on server / touch devices (canvas is invisible until JS runs)
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 1,
      }}
    />
  )
}
