import { useEffect, useState } from 'react'
import './App.css'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

const PHONE = '972525353259'
const wa = (text: string) => `https://wa.me/+${PHONE}?text=${encodeURIComponent(text)}`
const OPENING = 'היי, הגעתי מדף הנחיתה ואשמח לשמוע על פתרונות AI לעסק שלי'

const BLUE = '#1b71ff'
const CORAL = '#fa8c7b'

// להוספת סרטון אמיתי: מלאו src (קובץ mp4 בתיקיית public או קישור)
type Project = { title: string; desc: string; src?: string; poster?: string; color: string }
const projects: Project[] = [
  { title: 'Competitor Feed + Slack', desc: 'מעקב אוטומטי אחרי מתחרים, סיכום עם AI ושליחה בזמן אמת לערוץ Slack.', color: '#1b71ff' },
  { title: 'ניהול סטודיו לאימון', desc: 'הזמנת אימון, רכישת כרטיסיה, תזכורות, מעקב תשלומים ובוט AI בוואטסאפ.', color: '#fa8c7b' },
  { title: 'שיבוץ צוותי מילואים', desc: 'שיבוץ לפי תנאים, צרכים ומגבלות דרך אייג׳נט בוואטסאפ, מערכת רישום ודשבורד BI.', color: '#252525' },
  { title: 'פרויקט נוסף', desc: 'בקרוב.', color: '#4d8dff' },
  { title: 'פרויקט נוסף', desc: 'בקרוב.', color: '#e9705e' },
]

const services = [
  { t: 'סוכני AI בוואטסאפ', d: 'אייג׳נט שמקבל הודעות, מבצע פעולות ומעדכן את המערכת שלכם.' },
  { t: 'אוטומציות ואינטגרציות', d: 'חיבור בין Slack, וואטסאפ, תשלומים, CRM וכל כלי שאתם משתמשים בו.' },
  { t: 'מערכות ניהול מותאמות', d: 'מערכות רישום והזמנות עם תזכורות וניהול תשלומים.' },
  { t: 'ניתוח נתונים ו-BI', d: 'דשבורדים ותובנות על הנתונים של העסק, בזמן אמת.' },
]

const steps = ['שיחת היכרות וגיבוש הצורך', 'הצעה ותכנון', 'בנייה והטמעה', 'ליווי ושיפור']

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.1 },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Thumb({ p, big = false }: { p: Project; big?: boolean }) {
  if (p.src) {
    return <video src={p.src} poster={p.poster} muted loop playsInline autoPlay={!big} controls={big} className="h-full w-full object-cover" />
  }
  return (
    <div className="flex h-full w-full items-center justify-center" style={{ background: p.color }}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#252525"><path d="M8 5v14l11-7z" /></svg>
      </div>
    </div>
  )
}

function Spark({ x, y, d }: { x: number; y: number; d: string }) {
  return (
    <path className="twinkle" style={{ animationDelay: d, transformOrigin: `${x}px ${y}px` }} fill="#fff"
      d={`M${x} ${y - 9}Q${x} ${y} ${x + 9} ${y}Q${x} ${y} ${x} ${y + 9}Q${x} ${y} ${x - 9} ${y}Q${x} ${y} ${x} ${y - 9}Z`} />
  )
}

function Woman() {
  return (
    <svg viewBox="0 -40 300 460" role="img" aria-label="דמות אישה מחזיקה כדור אור" className="mx-auto h-[380px] w-auto md:h-[460px]">
      <defs>
        <radialGradient id="orb" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".45" stopColor="#ffc2ae" />
          <stop offset="1" stopColor="#fa6a4e" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="400" rx="75" ry="8" fill="rgba(0,0,0,.25)" />
      <g className="woman-float">
        {/* legs + shoes */}
        <path d="M120 245h60l6 140h-26l-10-100-10 100h-26z" fill="#f3b093" />
        <ellipse cx="127" cy="388" rx="17" ry="6" fill="#fff" />
        <ellipse cx="173" cy="388" rx="17" ry="6" fill="#fff" />
        {/* arm down */}
        <path d="M121 152Q98 200 108 238" stroke="#fff" strokeWidth="20" strokeLinecap="round" fill="none" />
        <circle cx="108" cy="246" r="9" fill="#f2c4a8" />
        {/* torso */}
        <path d="M116 142Q150 126 184 142L190 256Q150 266 110 256Z" fill="#fff" />
        <rect x="110" y="244" width="80" height="9" rx="3" fill="#e08a6e" />
        {/* neck + head */}
        <rect x="142" y="118" width="16" height="28" rx="6" fill="#e9b394" />
        <g className="woman-head">
          <circle cx="150" cy="54" r="15" fill="#d1622f" />
          <ellipse cx="150" cy="100" rx="28" ry="32" fill="#f2c4a8" />
          <path d="M120 102Q116 60 150 62Q184 60 180 102Q172 80 150 80Q128 80 120 102Z" fill="#d1622f" />
          <circle className="blink" cx="140" cy="103" r="2.6" fill="#252525" />
          <circle className="blink" cx="160" cy="103" r="2.6" fill="#252525" />
          <circle cx="132" cy="113" r="5" fill="#f5a38c" opacity=".5" />
          <circle cx="168" cy="113" r="5" fill="#f5a38c" opacity=".5" />
          <path d="M143 115Q150 122 157 115" stroke="#b5503a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
        {/* raised arm + orb */}
        <g className="woman-arm">
          <path d="M180 152Q216 134 226 84" stroke="#fff" strokeWidth="20" strokeLinecap="round" fill="none" />
          <circle cx="226" cy="76" r="10" fill="#f2c4a8" />
          <g className="orb">
            <circle cx="226" cy="42" r="42" fill="#fa8c7b" opacity=".35" />
            <circle cx="226" cy="46" r="23" fill="url(#orb)" />
          </g>
          <Spark x={186} y={14} d="0s" />
          <Spark x={270} y={30} d=".7s" />
          <Spark x={262} y={92} d="1.4s" />
          <Spark x={196} y={64} d="2.1s" />
        </g>
      </g>
    </svg>
  )
}

const pill = 'inline-flex items-center justify-center rounded-full px-8 py-3 text-lg font-medium transition'
const input = 'w-full text-right rounded-full border border-white/70 bg-transparent px-5 py-3 text-white placeholder-white/70 outline-none focus:border-white'

export default function App() {
  useReveal()
  const [open, setOpen] = useState<Project | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', msg: '' })
  const loop = [...projects, ...projects]

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const who = [form.name, form.phone].filter(Boolean).join(', ')
    window.open(wa(`היי${who ? `, כאן ${who}` : ''}.\n${form.msg || OPENING}`), '_blank')
  }

  return (
    <div>
      {/* Hero */}
      <section id="top" className="hero-bg px-4 pb-24 text-white">
        <nav className="mx-auto mt-4 flex max-w-5xl items-center justify-between rounded-full bg-black px-6 py-3">
          <a href="#top" className="font-bold">AI לעסקים</a>
          <div className="hidden gap-8 text-sm md:flex">
            <a href="#services">שירותים</a>
            <a href="#portfolio">תיק עבודות</a>
            <a href="#process">איך עובדים</a>
          </div>
          <a href="#contact" className="rounded-full border border-white px-5 py-1.5 text-sm">צור קשר</a>
        </nav>
        <div className="mx-auto grid max-w-5xl items-center gap-8 pt-14 md:grid-cols-[1.2fr_1fr] md:pt-16">
         <div className="text-center md:text-right">
          <h1 className="text-5xl font-extrabold leading-tight md:text-7xl" style={{ color: CORAL }}>
            פתרונות AI לעסקים
          </h1>
          <p className="mt-6 text-xl leading-relaxed md:text-2xl">
            אני בונה אוטומציות, סוכנים בוואטסאפ ומערכות ניהול שחוסכות לכם שעות עבודה כל שבוע.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3 md:justify-start">
            <a href="#portfolio" className={`${pill} border border-white`}>תיק עבודות</a>
            <a href={wa(OPENING)} target="_blank" rel="noreferrer" className={`${pill} bg-black hover:bg-white hover:text-black`}>בואו נדבר ←</a>
          </div>
         </div>
         <Woman />
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-4 py-20">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-black p-8 text-white md:p-14">
          <h2 className="reveal text-3xl font-bold md:text-4xl">מה אני עושה</h2>
          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {services.map((s) => (
              <div key={s.t} className="reveal">
                <h3 className="mb-2 text-xl font-bold" style={{ color: CORAL }}>{s.t}</h3>
                <p className="text-white/70">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="pb-20">
        <div className="mx-auto mb-8 max-w-5xl px-4 text-center">
          <h2 className="reveal text-3xl font-bold md:text-4xl">תיק עבודות</h2>
          <p className="reveal mt-2 text-lg text-black/60">לחצו על סרטון כדי להגדיל</p>
        </div>
        <div dir="ltr" className="marquee overflow-hidden">
          <div className="marquee-track flex gap-5 px-2.5">
            {loop.map((p, i) => (
              <button key={i} dir="rtl" onClick={() => setOpen(p)} className="w-72 shrink-0 text-right md:w-80">
                <div className="aspect-video overflow-hidden rounded-3xl"><Thumb p={p} /></div>
                <div className="mt-3 px-1 font-bold">{p.title}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="reveal mb-10 text-center text-3xl font-bold md:text-4xl">איך עובדים</h2>
          <ol className="grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s} className="reveal text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white" style={{ background: BLUE }}>{i + 1}</div>
                <div className="text-lg font-medium">{s}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 py-20 text-white" style={{ background: BLUE }}>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">שנתחיל? השאירו פרטים</h2>
          <p className="mt-3 text-lg text-white/85">או כתבו לי ישר בוואטסאפ ואחזור אליכם.</p>
          <form onSubmit={submit} className="mt-8 space-y-3 text-right">
            <input aria-label="שם מלא" placeholder="שם מלא" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
            <input aria-label="טלפון" placeholder="טלפון" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
            <input aria-label="במה אוכל לעזור" placeholder="במה אוכל לעזור?" value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} className={input} />
            <button type="submit" className={`${pill} w-full bg-black text-white hover:bg-white hover:text-black`}>שלחו בוואטסאפ</button>
          </form>
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-black/50">© {new Date().getFullYear()} פתרונות AI לעסקים</footer>

      {/* Floating WhatsApp */}
      <a
        href={wa(OPENING)}
        target="_blank"
        rel="noreferrer"
        aria-label="שלחו הודעה בוואטסאפ"
        className="wa-pulse fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-110"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.1-3.4-8.3zM12 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.800 9.800 0 0 1-1.500-5.200c0-5.400 4.400-9.800 9.900-9.800 2.600 0 5.100 1 6.900 2.900a9.700 9.700 0 0 1 2.900 6.900c0 5.400-4.400 9.900-9.800 9.900zm5.400-7.400c-.3-.1-1.800-.9-2-1s-.5-.1-.7.1-.8 1-1 1.200-.4.200-.7.100a8 8 0 0 1-4-3.500c-.3-.5.300-.5.900-1.600.1-.2 0-.4 0-.5l-.9-2.200c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400s-1 1-1 2.500 1.100 2.900 1.200 3.100c.1.200 2.100 3.200 5.100 4.500 1.900.8 2.600.9 3.500.7.600-.1 1.800-.7 2-1.400.3-.7.300-1.300.2-1.400s-.3-.2-.6-.3z" /></svg>
      </a>

      {/* Video modal */}
      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-3xl rounded-3xl" dir="rtl">
          {open && (
            <div>
              <DialogTitle className="mb-3 text-xl font-bold">{open.title}</DialogTitle>
              <div className="aspect-video overflow-hidden rounded-2xl"><Thumb p={open} big /></div>
              <p className="mt-3 text-black/70">{open.desc}</p>
              <a href={wa(`היי, ראיתי את הפרויקט "${open.title}" ואשמח לפתרון דומה`)} target="_blank" rel="noreferrer" className={`${pill} mt-4 bg-black text-white`}>
                רוצה משהו כזה? דברו איתי
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
