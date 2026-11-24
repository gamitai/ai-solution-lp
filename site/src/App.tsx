import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

const PHONE = '972525353259'
const wa = (text: string) => `https://wa.me/+${PHONE}?text=${encodeURIComponent(text)}`
const OPENING = 'היי, הגעתי מדף הנחיתה ואשמח לשמוע על פתרונות AI לעסק שלי'

// כדי להוסיף סרטון אמיתי: מלאו src (קובץ mp4 בתיקיית public או קישור) ו-poster אופציונלי
type Project = { title: string; tag: string; desc: string; src?: string; poster?: string; hue: number }
const projects: Project[] = [
  { title: 'Competitor Feed + Slack', tag: 'מודיעין תחרותי', desc: 'מעקב אוטומטי אחרי מתחרים, סיכום עם AI ושליחה בזמן אמת לערוץ Slack.', hue: 75 },
  { title: 'ניהול סטודיו לאימון', tag: 'וואטסאפ + תשלומים', desc: 'הזמנת אימון, רכישת כרטיסיה, תזכורות, מעקב תשלומים ובוט AI בוואטסאפ.', hue: 150 },
  { title: 'שיבוץ צוותי מילואים', tag: 'אייג׳נט + BI', desc: 'שיבוץ לפי תנאים, צרכים ומגבלות דרך אייג׳נט בוואטסאפ, מערכת רישום ודשבורד BI.', hue: 195 },
  { title: 'בוט שירות לקוחות', tag: 'AI BOT', desc: 'בוט שעונה ללקוחות 24/7, מבין הקשר ומעביר לנציג כשצריך.', hue: 40 },
  { title: 'דשבורד ניתוח נתונים', tag: 'BI', desc: 'חיבור מקורות נתונים לדשבורד אחד ברור לקבלת החלטות.', hue: 110 },
]

const services = [
  { n: '01', t: 'סוכני AI בוואטסאפ', d: 'אייג׳נט שמקבל הודעות, מבצע פעולות ומעדכן את המערכת שלכם.' },
  { n: '02', t: 'אוטומציות ואינטגרציות', d: 'חיבור בין Slack, וואטסאפ, תשלומים, CRM וכל כלי שאתם משתמשים בו.' },
  { n: '03', t: 'מערכות ניהול מותאמות', d: 'מערכות רישום והזמנות עם ממשק נוח, תזכורות וניהול תשלומים.' },
  { n: '04', t: 'ניתוח נתונים ו-BI', d: 'דשבורדים ותובנות על הנתונים של העסק, בזמן אמת.' },
]

const steps = [
  { t: 'שיחת היכרות', d: 'מבינים את העסק ומה כואב בו.' },
  { t: 'הצעה ותכנון', d: 'פתרון ברור, לוח זמנים ומחיר מראש.' },
  { t: 'בנייה והטמעה', d: 'בונים, בודקים ומטמיעים אצלכם.' },
  { t: 'ליווי ושיפור', d: 'תמיכה שוטפת ושיפור לפי שימוש אמיתי.' },
]

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.15 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Thumb({ p, big = false }: { p: Project; big?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  if (p.src) {
    return (
      <video
        ref={ref}
        src={p.src}
        poster={p.poster}
        muted
        loop
        playsInline
        autoPlay={!big}
        controls={big}
        className="h-full w-full object-cover"
      />
    )
  }
  return (
    <div
      className="scan relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(135deg, hsl(${p.hue} 40% 14%), hsl(${p.hue} 55% 24%))` }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/30">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#c6ff3d"><path d="M8 5v14l11-7z" /></svg>
      </div>
      <span className="absolute bottom-2 left-3 text-[11px] text-white/50">הסרטון בקרוב</span>
    </div>
  )
}

export default function App() {
  useReveal()
  const [open, setOpen] = useState<Project | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', msg: '' })
  const loop = [...projects, ...projects]

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = `היי, אני ${form.name || ''}${form.phone ? ` (${form.phone})` : ''}.\n${form.msg || OPENING}`
    window.open(wa(text), '_blank')
  }

  const accent = 'text-[#c6ff3d]'
  const btn = 'inline-flex items-center justify-center rounded-md bg-[#c6ff3d] px-6 py-3 font-bold text-black transition hover:bg-white'
  const btnGhost = 'inline-flex items-center justify-center rounded-md border border-white/25 px-6 py-3 font-medium transition hover:border-[#c6ff3d] hover:text-[#c6ff3d]'

  return (
    <div>
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0c100f]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" className="text-lg font-extrabold">AI<span className={accent}>.</span>לעסקים</a>
          <nav className="hidden gap-6 text-sm text-white/70 md:flex">
            <a href="#services" className="hover:text-white">שירותים</a>
            <a href="#portfolio" className="hover:text-white">תיק עבודות</a>
            <a href="#process" className="hover:text-white">איך עובדים</a>
          </nav>
          <a href="#contact" className="rounded-md bg-[#c6ff3d] px-4 py-2 text-sm font-bold text-black hover:bg-white">דברו איתי</a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-16 md:grid-cols-[1.3fr_1fr] md:pt-24">
        <div>
          <p className={`mb-4 text-sm font-medium ${accent}`}>פתרונות AI לעסקים</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            פחות עבודה ידנית.<br />יותר זמן לעסק.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            אני בונה אוטומציות, סוכני AI בוואטסאפ ומערכות ניהול שחוסכות לכם שעות כל שבוע. פשוט, מהיר ובלי מילים גבוהות.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={wa(OPENING)} target="_blank" rel="noreferrer" className={btn}>דברו איתי בוואטסאפ</a>
            <a href="#portfolio" className={btnGhost}>לתיק העבודות</a>
          </div>
        </div>
        <div className="grid grid-cols-3 content-end gap-px self-end overflow-hidden rounded-md border border-white/10 bg-white/10 text-center md:grid-cols-1 md:text-right">
          {[['WhatsApp', 'סוכנים ובוטים'], ['Slack', 'התראות וסיכומים'], ['BI', 'דשבורדים ונתונים']].map(([a, b]) => (
            <div key={a} className="bg-[#101514] p-4">
              <div className={`text-xl font-extrabold ${accent}`}>{a}</div>
              <div className="text-sm text-white/60">{b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="reveal mb-10 text-3xl font-extrabold">מה אני עושה</h2>
          <div className="grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2">
            {services.map((s) => (
              <div key={s.n} className="reveal group bg-[#0c100f] p-6 transition hover:bg-[#121917]">
                <div className={`mb-3 text-sm font-bold ${accent}`}>{s.n}</div>
                <h3 className="mb-2 text-xl font-bold">{s.t}</h3>
                <p className="text-white/65">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="border-t border-white/10 py-16">
        <div className="mx-auto mb-8 max-w-6xl px-4">
          <h2 className="reveal text-3xl font-extrabold">תיק עבודות</h2>
          <p className="reveal mt-2 text-white/60">לחצו על סרטון כדי להגדיל. הגלריה עוצרת כשעוברים עליה עם העכבר.</p>
        </div>
        <div dir="ltr" className="marquee overflow-hidden">
          <div className="marquee-track flex gap-4 px-2">
            {loop.map((p, i) => (
              <button
                key={i}
                dir="rtl"
                onClick={() => setOpen(p)}
                className="w-72 shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#101514] text-right transition hover:border-[#c6ff3d] md:w-80"
              >
                <div className="aspect-video"><Thumb p={p} /></div>
                <div className="p-4">
                  <div className={`mb-1 text-xs font-medium ${accent}`}>{p.tag}</div>
                  <div className="font-bold">{p.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="reveal mb-10 text-3xl font-extrabold">איך עובדים</h2>
          <ol className="grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.t} className="reveal border-t-2 border-[#c6ff3d] pt-4">
                <div className="text-sm text-white/50">שלב {i + 1}</div>
                <div className="mb-1 text-lg font-bold">{s.t}</div>
                <p className="text-white/65">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-white/10 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2">
          <div className="reveal">
            <h2 className="text-3xl font-extrabold">בואו נדבר</h2>
            <p className="mt-3 text-white/65">ספרו לי בקצרה מה אתם צריכים ואחזור אליכם בוואטסאפ.</p>
            <a href={wa(OPENING)} target="_blank" rel="noreferrer" className={`${btn} mt-6`}>פתיחת שיחה בוואטסאפ</a>
          </div>
          <form onSubmit={submit} className="reveal space-y-4">
            <label className="block text-sm">
              שם
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-md border border-white/15 bg-[#101514] px-3 py-2 outline-none focus:border-[#c6ff3d]" />
            </label>
            <label className="block text-sm">
              טלפון
              <input type="tel" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-md border border-white/15 bg-[#101514] px-3 py-2 text-right outline-none focus:border-[#c6ff3d]" />
            </label>
            <label className="block text-sm">
              במה אוכל לעזור?
              <textarea rows={4} value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} className="mt-1 w-full rounded-md border border-white/15 bg-[#101514] px-3 py-2 outline-none focus:border-[#c6ff3d]" />
            </label>
            <button type="submit" className={`${btn} w-full`}>שלחו בוואטסאפ</button>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-white/45">
        © {new Date().getFullYear()} פתרונות AI לעסקים
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={wa(OPENING)}
        target="_blank"
        rel="noreferrer"
        aria-label="שלחו הודעה בוואטסאפ"
        className="wa-pulse fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-110"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.1-3.4-8.3zM12 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.800 1 1-3.700-.2-.4a9.800 9.800 0 0 1-1.500-5.200c0-5.400 4.400-9.800 9.900-9.800 2.600 0 5.100 1 6.900 2.900a9.700 9.700 0 0 1 2.900 6.900c0 5.400-4.400 9.900-9.800 9.900zm5.400-7.400c-.3-.1-1.800-.9-2-1s-.5-.1-.7.100-.8 1-1 1.200-.4.200-.7.100a8 8 0 0 1-4-3.500c-.3-.5.300-.5.900-1.600.1-.2 0-.4 0-.5l-.9-2.200c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400s-1 1-1 2.500 1.100 2.900 1.200 3.100c.1.200 2.100 3.200 5.100 4.500 1.900.8 2.600.9 3.500.7.600-.1 1.800-.7 2-1.400.3-.7.300-1.300.2-1.400s-.3-.2-.6-.3z" /></svg>
      </a>

      {/* Video modal */}
      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-3xl border-white/10 bg-[#0c100f] text-white" dir="rtl">
          {open && (
            <div>
              <DialogTitle className="mb-3 text-xl font-bold">{open.title}</DialogTitle>
              <div className="aspect-video overflow-hidden rounded-md"><Thumb p={open} big /></div>
              <p className="mt-3 text-white/70">{open.desc}</p>
              <a href={wa(`היי, ראיתי את הפרויקט "${open.title}" ואשמח לפתרון דומה`)} target="_blank" rel="noreferrer" className={`${btn} mt-4`}>
                רוצה משהו כזה? דברו איתי
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
