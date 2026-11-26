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


const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

function useProgress(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const calc = () => {
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const v = total > 0 ? clamp(-r.top / total) : 0
      setP((o) => (Math.abs(o - v) > 0.004 ? v : o))
    }
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(calc) }
    calc()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [ref])
  return p
}

const CHAT: { from: 'c' | 'b'; t: string; note?: string }[] = [
  { from: 'c', t: 'היי, אפשר לקבוע תור למחר?' },
  { from: 'b', t: 'היי! כמובן 😊 יש לי פנוי מחר ב-10:00 או ב-16:30. מה מתאים לך?', note: 'נענה תוך 3 שניות' },
  { from: 'c', t: '16:30 מעולה' },
  { from: 'b', t: 'נקבע ✓ תור למחר ב-16:30. אשלח לך תזכורת שעה לפני.' },
  { from: 'c', t: 'תודה! אפשר קבלה על התשלום מהשבוע שעבר?' },
  { from: 'b', t: 'כבר שלחתי לך קבלה #1042 ✓' },
]

function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(false)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.35 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(CHAT.length); return }
    let alive = true
    const ids: number[] = []
    const wait = (ms: number) => new Promise<void>((r) => ids.push(window.setTimeout(r, ms)))
    ;(async () => {
      while (alive) {
        setShown(0); setTyping(false)
        await wait(700)
        for (let i = 0; i < CHAT.length && alive; i++) {
          if (CHAT[i].from === 'b') { setTyping(true); await wait(1300); if (!alive) return; setTyping(false) }
          else await wait(900)
          setShown(i + 1)
        }
        await wait(4200)
      }
    })()
    return () => { alive = false; ids.forEach(clearTimeout) }
  }, [active])
  useEffect(() => { box.current?.scrollTo({ top: 9999, behavior: 'smooth' }) }, [shown, typing])
  return (
    <div ref={ref} className="mx-auto w-full max-w-[19rem]" aria-label="דוגמה לשיחת וואטסאפ עם סוכן AI" role="img">
      <div className="overflow-hidden rounded-[2.2rem] border-[6px] border-[#0a1238] bg-[#eef1f8] shadow-2xl" dir="ltr">
        <div className="flex items-center gap-3 bg-[#0a1238] px-4 py-3 text-white" dir="rtl">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b71ff] font-extrabold">S</div>
          <div className="text-right leading-tight"><div className="text-sm font-bold">העסק שלכם</div><div className="text-xs text-[#7be0c3]">סוכן AI · מחובר</div></div>
        </div>
        <div ref={box} className="h-[26rem] space-y-2 overflow-hidden px-3 py-4" dir="rtl">
          {CHAT.slice(0, shown).map((m, i) => (
            <div key={i} className={`flex ${m.from === 'b' ? 'justify-start' : 'justify-end'}`}>
              <div className="pv-pop max-w-[85%]">
                <div className={`rounded-2xl px-3.5 py-2 text-[0.92rem] leading-snug text-[#0c1a4d] shadow-sm ${m.from === 'b' ? 'rounded-br-md bg-[#d6e4ff]' : 'rounded-bl-md bg-white'}`}>{m.t}</div>
                {m.note && <div className="mt-1 text-[0.7rem] font-bold text-[#1b71ff]">⚡ {m.note}</div>}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start"><div className="flex gap-1 rounded-2xl rounded-br-md bg-[#d6e4ff] px-4 py-3"><i className="pv-dot" /><i className="pv-dot" style={{ animationDelay: '.15s' }} /><i className="pv-dot" style={{ animationDelay: '.3s' }} /></div></div>
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-xs opacity-70">דוגמה להמחשה. השיחה והנתונים בדויים.</p>
    </div>
  )
}

const DOM = ['פנייה נקלטת', 'נענית אוטומטית', 'תור נקבע', 'תזכורת נשלחת', 'קבלה מוצאת', 'הוצאה נרשמת', 'דוח מוכן']

function Dominoes() {
  const ref = useRef<HTMLElement>(null)
  const p = useProgress(ref)
  const n = DOM.length
  const prog = clamp((p - 0.08) / 0.8) * (n + 0.6)
  const current = clamp(Math.floor(prog), 0, n - 1)
  const done = p > 0.9
  return (
    <section ref={ref} id="dominoes" aria-label="האימפקט של אוטומציה" className="relative h-[300svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center px-6 pt-14 md:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="pv-big text-[clamp(2rem,6vw,4.5rem)]">כל אוטומציה <span style={{ color: CORAL }}>מפילה את הבאה</span></h2>
          <p className="mt-3 h-8 text-xl font-bold md:text-2xl" aria-live="off">
            {done ? 'והזמן שנחסך? משקיעים אותו בצמיחה.' : <>{current + 1}. {DOM[current]}</>}
          </p>
          <div className="mt-6 flex items-end overflow-visible" dir="rtl" style={{ ['--H' as string]: 'min(52svh, 50vw)', height: 'var(--H)', gap: 'clamp(.35rem,1.4vw,1.2rem)' }} aria-hidden="true">
            {DOM.map((_, i) => {
              const h = 14 * Math.pow(1.38, i)
              const fall = clamp(prog - i)
              const ang = Math.pow(fall, 1.6) * 82
              return (
                <div key={i} className="flex flex-none flex-col items-center justify-start rounded-md border border-[#c9d6ff] bg-gradient-to-b from-white to-[#dfe8ff] shadow-lg"
                  style={{ height: `${h}%`, aspectRatio: '1 / 2.3', transformOrigin: '0% 100%', transform: `rotate(${-ang}deg)`, opacity: fall > 0.98 ? 0.55 : 1, zIndex: n - i }}>
                  <span className="pv-big mt-[12%] text-[clamp(.9rem,3.2vw,2.6rem)] text-[#0c1a4d]">{i + 1}</span>
                  <span className="my-[10%] h-px w-4/5 bg-[#0c1a4d]/25" />
                  <span className="h-2 w-2 rounded-full" style={{ background: CORAL }} />
                </div>
              )
            })}
          </div>
          <p className="mt-5 max-w-2xl text-lg opacity-90">כל צעד שמפסיקים לעשות ידנית מפנה זמן לצעד הבא. ההשפעה מצטברת, והיא גדלה עם כל תהליך שמוסיפים.</p>
        </div>
      </div>
    </section>
  )
}

const CATS = [
  { t: 'מענה ללקוחות', h: 1.5, c: '#ff8a7a' },
  { t: 'תורים ותזכורות', h: 1, c: '#ffc46b' },
  { t: 'קבלות וחשבוניות', h: 0.75, c: '#9fb7ff' },
  { t: 'הוצאות ומסמכים', h: 0.75, c: '#7be0c3' },
]
const DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳']

function Week() {
  const ref = useRef<HTMLElement>(null)
  const p = useProgress(ref)
  const q = clamp((p - 0.08) / 0.8) * CATS.length
  const s = CATS.map((_, i) => clamp(q - i))
  const hours = DAYS.length * CATS.reduce((a, c, i) => a + c.h * (1 - 0.9 * s[i]), 0)
  return (
    <section ref={ref} id="week" aria-label="לפני ואחרי" className="relative h-[280svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center px-6 pt-14 md:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="pv-big text-[clamp(2rem,6vw,4.5rem)]">שבוע בעסק: <span style={{ color: CORAL }}>לפני ואחרי</span></h2>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <div className="pv-big text-[clamp(2.4rem,7vw,5rem)] tabular-nums" style={{ color: CORAL }}>{hours.toFixed(0)}</div>
            <div className="text-lg font-bold md:text-xl">שעות בשבוע על עבודה ידנית וחוזרת</div>
          </div>
          <div className="mt-5 grid gap-6 md:grid-cols-[1fr_16rem]">
            <div className="grid grid-cols-5 gap-2 md:gap-3" style={{ height: 'min(44svh, 78vw)' }} aria-hidden="true">
              {DAYS.map((d, di) => (
                <div key={d} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/25 bg-white/10">
                  <div className="py-1 text-center text-xs font-bold md:text-sm" style={{ background: 'rgba(255,255,255,.14)' }}>{d}</div>
                  <div className="flex min-h-0 flex-1 flex-col gap-[3px] p-[3px]">
                    {CATS.map((c, i) => (
                      <div key={c.t} className="rounded-md" style={{ flex: `0 0 ${(c.h / 8) * 100 * (1 - 0.9 * s[i])}%`, background: c.c, opacity: 0.95 - s[i] * 0.25 + di * 0, transition: 'none' }} />
                    ))}
                    <div className="flex min-h-0 flex-1 items-center justify-center rounded-md text-center text-[0.65rem] font-bold leading-tight text-[#0c1a4d] md:text-xs" style={{ background: `linear-gradient(180deg, ${CORAL}, #ffd0c7)`, opacity: 0.25 + 0.75 * clamp(q / CATS.length) }}>
                      <span className="px-1">{q > 2.2 ? 'זמן לעסק' : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ul className="space-y-3 self-center text-base">
              {CATS.map((c, i) => (
                <li key={c.t} className="flex items-center gap-3">
                  <span className="h-4 w-4 flex-none rounded" style={{ background: c.c }} />
                  <span className="flex-1">{c.t}</span>
                  <span className="font-bold" style={{ color: s[i] >= 1 ? '#7be0c3' : 'rgba(255,255,255,.55)' }}>{s[i] >= 1 ? '✓ AI' : ' '}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-sm opacity-75">דוגמה להמחשה: עסק קטן עם כ-4 שעות ניהול ביום. המספרים בכל עסק שונים, ובשיחת ההיכרות נבדוק מה מתאים לכם.</p>
        </div>
      </div>
    </section>
  )
}

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


          <section id="demo" className="px-6 py-24 md:px-16">
            <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
              <div className="pv-r">
                <h2 className="pv-big text-[clamp(2.2rem,6vw,4.5rem)]">ככה זה נראה אצל <span style={{ color: CORAL }}>הלקוח שלכם</span></h2>
                <ul className="mt-6 space-y-3 text-xl">
                  <li>✓ תשובה תוך שניות, גם בשתיים בלילה</li>
                  <li>✓ קובע תור, שולח תזכורת ומוציא קבלה</li>
                  <li>✓ ואם צריך, מעביר לנציג אנושי</li>
                </ul>
              </div>
              <div className="pv-r"><ChatDemo /></div>
            </div>
          </section>

          <Dominoes />
          <Week />

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
