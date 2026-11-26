import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'
import './index.css'
import './preview.css'
import { faqs, projects, services, steps, buildMessage, wa, OPENING } from './App'

const CORAL = '#fa8c7b'
const LABELS = [
  'קבלה #1042 נשלחה ✓',
  'לקוח: מה שעות הפתיחה?\nנענה תוך 3 שניות',
  'תור נקבע: יום ג׳ 14:30',
  'הוצאה נרשמה: 248 ₪',
  'תזכורת נשלחה בוואטסאפ',
  'חשבונית נקלטה מ-PDF',
  'דוח שבועי מוכן',
  'ליד חדש נקלט ✓',
  'תור נקבע: יום ה׳ 10:00',
  'קבלה #1043 נשלחה ✓',
  'שאלה נענתה אוטומטית ✓',
  'הוצאה נרשמה: 89 ₪',
]
const SPACING = 5.2
const STOPS = ['#1b71ff', '#0c1a4d', '#1b71ff', '#0a1238', '#1b71ff'].map((c) => new THREE.Color(c))

function labelTexture(text: string) {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 700
  const x = c.getContext('2d')!
  x.fillStyle = '#ffffff'
  x.fillRect(0, 0, 512, 700)
  x.fillStyle = '#eef3ff'
  x.fillRect(0, 0, 512, 90)
  x.fillStyle = CORAL
  x.beginPath()
  x.arc(450, 45, 14, 0, Math.PI * 2)
  x.fill()
  x.fillStyle = '#1b71ff'
  x.font = '800 30px Heebo, sans-serif'
  x.textAlign = 'right'
  x.direction = 'rtl'
  x.fillText('SochenAI', 420, 56)
  x.fillStyle = '#0c1a4d'
  x.font = '800 46px Heebo, sans-serif'
  x.textAlign = 'center'
  const lines = text.split('\n')
  lines.forEach((l, i) => x.fillText(l, 256, 330 + (i - (lines.length - 1) / 2) * 64))
  x.fillStyle = '#d9e3ff'
  for (let i = 0; i < 4; i++) x.fillRect(80, 500 + i * 36, i % 2 ? 260 : 352, 12)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function useScene(host: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = host.current
    if (!el) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    } catch {
      return
    }
    const mobile = window.matchMedia('(max-width: 768px)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75))
    renderer.domElement.className = 'pv-canvas'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = STOPS[0].clone()
    scene.fog = new THREE.Fog(STOPS[0].clone(), 6, 34)
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 80)
    scene.add(new THREE.AmbientLight(0xffffff, 1.15))
    const sun = new THREE.DirectionalLight(0xffffff, 1.6)
    sun.position.set(4, 6, 6)
    scene.add(sun)

    const n = LABELS.length
    const geo = new THREE.BoxGeometry(2.3, 3.1, 0.07)
    const cards: THREE.Mesh[] = []
    const textures: THREE.Texture[] = []
    const base = new THREE.MeshStandardMaterial({ color: 0xf4f7ff, roughness: 0.65 })
    LABELS.forEach((label, i) => {
      const tex = labelTexture(label)
      textures.push(tex)
      const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 })
      const m = new THREE.Mesh(geo, [base, base, base, base, face, base])
      m.position.set((i % 2 ? 1 : -1) * (2.3 + ((i * 0.37) % 1.5)), Math.cos(i * 1.4) * 1.4, -i * SPACING - 4)
      m.rotation.set(Math.sin(i) * 0.12, -Math.sin(i * 1.9) * 0.35, Math.cos(i * 2) * 0.16)
      m.userData = { y0: m.position.y, r0: m.rotation.z, i }
      scene.add(m)
      cards.push(m)
    })

    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshStandardMaterial({ color: CORAL, emissive: CORAL, emissiveIntensity: 1.4 }))
    const glow = new THREE.PointLight(CORAL, 18, 9)
    orb.add(glow)
    scene.add(orb)

    const count = mobile ? 350 : 800
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = 6 - Math.random() * (n * SPACING + 20)
    }
    const pg = new THREE.BufferGeometry()
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.7 }))
    scene.add(pts)

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.fov = w < h ? 70 : 55
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    let target = 0, cur = 0, raf = 0, vis = true
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    onScroll()
    cur = target
    window.addEventListener('scroll', onScroll, { passive: true })
    const onVis = () => { vis = !document.hidden; if (vis) loop() }
    document.addEventListener('visibilitychange', onVis)

    const tmp = new THREE.Color()
    const loop = () => {
      if (!vis) return
      raf = requestAnimationFrame(loop)
      const t = performance.now() / 1000
      cur += (target - cur) * (reduce ? 1 : 0.07)
      const dist = n * SPACING + 2
      const z = 6 - cur * dist
      camera.position.set(Math.sin(cur * 7) * 0.9, Math.cos(cur * 5) * 0.45, z)
      camera.lookAt(Math.sin(cur * 7 + 0.5) * 0.5, Math.cos(cur * 5) * 0.2, z - 8)
      camera.rotation.z += Math.sin(cur * 6) * 0.03
      orb.position.set(camera.position.x + Math.sin(t * 0.8) * 1.2, camera.position.y - 0.4 + Math.cos(t * 1.1) * 0.35, z - 5)
      cards.forEach((c) => {
        const d = c.userData
        c.position.y = d.y0 + (reduce ? 0 : Math.sin(t * 0.6 + d.i) * 0.14)
        c.rotation.z = d.r0 + (reduce ? 0 : Math.sin(t * 0.4 + d.i) * 0.03)
      })
      const seg = cur * (STOPS.length - 1)
      const k = Math.min(STOPS.length - 2, Math.floor(seg))
      tmp.copy(STOPS[k]).lerp(STOPS[k + 1], seg - k)
      ;(scene.background as THREE.Color).copy(tmp)
      ;(scene.fog as THREE.Fog).color.copy(tmp)
      renderer.render(scene, camera)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      vis = false
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVis)
      geo.dispose(); base.dispose(); textures.forEach((t) => t.dispose()); pg.dispose(); renderer.dispose()
      renderer.domElement.remove()
    }
  }, [host])
}

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: 0.2 })
    document.querySelectorAll('.pv-r').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}

const pill = 'inline-flex items-center justify-center rounded-full px-8 py-3.5 text-lg font-bold transition'
const field = 'block w-full text-right rounded-full border border-white/70 bg-white/10 px-5 py-3 text-base font-normal text-white outline-none placeholder:text-white/50 focus:border-white'

const WHAT = [
  { t: 'עונה ללקוחות', d: 'בוואטסאפ, 24/7, מתוך המידע של העסק שלכם.' },
  { t: 'מנהל תורים', d: 'קובע, מזכיר ומעדכן. בלי טלפונים הלוך ושוב.' },
  { t: 'מוציא קבלות', d: 'קבלה או חשבונית נשלחות ללקוח מיד, בלי הקלדה.' },
  { t: 'עוקב אחרי הוצאות', d: 'קולט חשבוניות ומסמכים ומסדר אותם במקומכם.' },
]

function Preview() {
  const host = useRef<HTMLDivElement>(null)
  useScene(host)
  useReveal()
  const [form, setForm] = useState({ name: '', business: '', help: '' })
  const href = wa(buildMessage(form))
  const approach = faqs.find((f) => f.q.includes('הגישה'))
  const price = faqs.find((f) => f.q.includes('כמה עולה פרויקט'))
  const rest = faqs.filter((f) => f !== approach && f !== price)

  return (
    <div className="pv" ref={host}>
      <div className="pv-content pv-shadow">
        <header className="pv-nav fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-3 md:px-10">
          <a href="#top" className="flex items-center gap-2 text-xl font-extrabold"><img src="/icon.svg" alt="" width="30" height="30" />SochenAI</a>
          <a href="#contact" className="rounded-full border border-white/70 px-5 py-2 text-sm font-medium backdrop-blur transition hover:bg-white hover:text-black">צור קשר</a>
        </header>

        <main>
          <section id="top" className="flex min-h-[100svh] items-center px-6 md:px-16">
            <div className="mx-auto w-full max-w-6xl">
              <h1 className="pv-big text-[clamp(2.6rem,8vw,6.5rem)]">
                העבודה החוזרת בעסק שלכם?<br />
                <span style={{ color: CORAL }}>שתעשה את עצמה</span>
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-relaxed md:text-2xl">
                אנחנו בונים סוכני AI ואוטומציות שעונים ללקוחות, קובעים תורים, מוציאים קבלות ועוקבים אחרי הוצאות<br />
                ואתם תעשו את מה שאתם טובים בו <strong style={{ color: CORAL }}>באמת</strong>
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href={wa(OPENING)} target="_blank" rel="noreferrer" className={`${pill} bg-white text-[#0c1a4d] hover:bg-[#fa8c7b] hover:text-white`}>לשיחת היכרות ללא עלות ←</a>
                <span className="text-sm opacity-80">גללו כדי לראות ↓</span>
              </div>
            </div>
          </section>

          <section id="services" aria-label="מה אנחנו בונים" className="px-6 md:px-16">
            <div className="mx-auto max-w-6xl">
              <h2 className="pv-r pv-big pt-16 text-[clamp(2rem,5vw,3.5rem)]" style={{ color: CORAL }}>מה אנחנו בונים?</h2>
              {WHAT.map((w, i) => (
                <div key={w.t} className="flex min-h-[70svh] items-center">
                  <div className="pv-r max-w-3xl">
                    <div className="text-lg font-bold opacity-70">0{i + 1}</div>
                    <h3 className="pv-big text-[clamp(2.6rem,9vw,7rem)]">{w.t}</h3>
                    <p className="mt-5 text-xl md:text-2xl">{w.d}</p>
                  </div>
                </div>
              ))}
              <div className="pv-r pv-panel mb-10 grid gap-6 p-6 md:grid-cols-2 md:p-10">
                {services.map((s) => (
                  <div key={s.t}>
                    <h3 className="text-xl font-bold">{s.t}</h3>
                    <p className="mt-2 opacity-90">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="portfolio" className="px-6 py-24 md:px-16">
            <div className="mx-auto max-w-6xl">
              <h2 className="pv-r pv-big text-[clamp(2.4rem,7vw,5rem)]">מה כבר <span style={{ color: CORAL }}>בנינו</span></h2>
              <div className="mt-10">
                {projects.map((p) => (
                  <div key={p.title} className="pv-r pv-line grid gap-2 md:grid-cols-[18rem_1fr] md:gap-10">
                    <h3 className="text-2xl font-extrabold">{p.title}</h3>
                    <p className="text-lg opacity-90">{p.desc}</p>
                  </div>
                ))}
              </div>
              <a href="./" className="pv-r mt-8 inline-block text-lg font-bold underline underline-offset-4">לגלריה המלאה באתר ←</a>
            </div>
          </section>

          <section id="process" className="px-6 py-24 md:px-16">
            <div className="mx-auto max-w-6xl">
              <h2 className="pv-r pv-big text-[clamp(2.4rem,7vw,5rem)]">איך זה <span style={{ color: CORAL }}>עובד?</span></h2>
              <ol className="mt-10 grid gap-5 md:grid-cols-3">
                {steps.map((s, i) => (
                  <li key={s.t} className="pv-r pv-panel p-6">
                    <div className="pv-big text-6xl" style={{ color: CORAL }}>{i + 1}</div>
                    <h3 className="mt-3 text-xl font-bold">{s.t}</h3>
                    <p className="mt-1 opacity-90">{s.d}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="approach" className="px-6 py-24 md:px-16">
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
              {[approach, price].map((f) => f && (
                <div key={f.q} className="pv-r pv-panel p-7 md:p-10">
                  <h2 className="pv-big text-3xl md:text-4xl" style={{ color: CORAL }}>{f.q}</h2>
                  <p className="mt-4 text-lg leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="faq" className="px-6 py-24 md:px-16">
            <div className="pv-faq mx-auto max-w-3xl">
              <h2 className="pv-r pv-big text-[clamp(2.2rem,6vw,4rem)]">שאלות נפוצות</h2>
              <div className="mt-8">
                {rest.map((f) => (
                  <details key={f.q} className="pv-r pv-line">
                    <summary className="flex items-center justify-between gap-4 text-lg font-bold md:text-xl">{f.q}<span className="pv-plus text-3xl leading-none">+</span></summary>
                    <p className="mt-3 text-lg leading-relaxed opacity-90">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="flex min-h-[100svh] items-center px-6 py-24 md:px-16">
            <div className="pv-r mx-auto w-full max-w-xl text-center">
              <h2 className="pv-big text-[clamp(2.2rem,6vw,4rem)]">רוצים לבדוק מה AI יכול <span style={{ color: CORAL }}>לחסוך אצלכם?</span></h2>
              <form className="mt-8 space-y-4 text-right" onSubmit={(e) => { e.preventDefault(); window.open(href, '_blank', 'noopener') }}>
                <label className="block text-sm font-medium">שם<input name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${field} mt-1.5`} /></label>
                <label className="block text-sm font-medium">שם העסק<input name="business" autoComplete="organization" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} className={`${field} mt-1.5`} /></label>
                <label className="block text-sm font-medium">במה נוכל לעזור?<input name="help" autoComplete="off" value={form.help} onChange={(e) => setForm({ ...form, help: e.target.value })} className={`${field} mt-1.5`} /></label>
                <button type="submit" tabIndex={-1} aria-hidden="true" className="sr-only">שליחה</button>
                <a href={href} target="_blank" rel="noopener noreferrer" className={`${pill} w-full bg-white text-[#0c1a4d] hover:bg-[#fa8c7b] hover:text-white`}>שליחה בוואטסאפ</a>
              </form>
            </div>
          </section>
        </main>

        <footer className="px-6 py-6 text-center text-sm opacity-70">© {new Date().getFullYear()} SochenAI | פתרונות עסקיים עם סוכני AI</footer>

        <a href={wa(OPENING)} target="_blank" rel="noreferrer" aria-label="שלחו הודעה בוואטסאפ" className="fixed bottom-[calc(2.25rem+env(safe-area-inset-bottom))] left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-110">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.1-3.4-8.3zM12 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.800 9.800 0 0 1-1.500-5.200c0-5.400 4.400-9.800 9.900-9.800 2.600 0 5.100 1 6.900 2.900a9.700 9.700 0 0 1 2.900 6.900c0 5.400-4.400 9.900-9.800 9.900zm5.400-7.400c-.3-.1-1.800-.9-2-1s-.5-.1-.7.1-.8 1-1 1.200-.4.200-.7.100a8 8 0 0 1-4-3.500c-.3-.5.300-.5.900-1.600.1-.2 0-.4 0-.5l-.9-2.200c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400s-1 1-1 2.500 1.100 2.900 1.200 3.100c.1.200 2.100 3.200 5.100 4.500 1.900.8 2.600.9 3.500.7.600-.1 1.800-.7 2-1.400.3-.7.300-1.300.2-1.400s-.3-.2-.6-.3z" /></svg>
        </a>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><Preview /></StrictMode>)
