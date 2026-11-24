import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

const PHONE = '972525353259'
const wa = (text: string) => `https://wa.me/+${PHONE}?text=${encodeURIComponent(text)}`
const OPENING = 'היי, הגעתי מהאתר של SochenAI ואשמח לשמוע על פתרונות AI לעסק שלי'

const BLUE = '#1b71ff'
const CORAL = '#fa8c7b'

// להחלפת איור בסרטון אמיתי: מלאו src (קובץ mp4 בתיקיית public או קישור) והוא יוצג במקום האיור
type Art = 'studio' | 'feed' | 'team' | 'battle' | 'bot' | 'dj'
type Project = { title: string; desc: string; art?: Art; src?: string; poster?: string; color: string }
const projects: Project[] = [
  { title: 'ניהול סטודיו לאימון', art: 'studio', color: '#6b4f7a', desc: 'מתאמנות משבצות את עצמן לאימון, עוקבות אחרי הכרטיסיה, מקבלות תזכורת בוואטסאפ לפני האימון, רואות דרכי הגעה וממלאות הצהרת בריאות. כולל מעקב אחרי ההתקדמות במשקלים בכל תרגיל ותרגיל עם שיאים אישיים, רכישת כרטיסיה, ניהול תשלומים ובוט AI.' },
  { title: 'Competitor Feed + Slack', art: 'feed', color: '#14161f', desc: 'מעקב אוטומטי אחרי מתחרים: פיד אחד עם עדכונים ממקורות שונים, עם סינון לפי סוג, סיכום "למה זה חשוב" מבוסס AI והתראות בזמן אמת לערוץ Slack.' },
  { title: 'שיבוץ צוותי מילואים', art: 'team', color: '#12306b', desc: 'שיבוץ לפי תנאים, צרכים ומגבלות. הכול דרך אייג׳נט בוואטסאפ, עם מערכת רישום ודשבורד BI לניתוח נתונים.' },
  { title: 'Automated Battlecards', art: 'battle', color: '#2b3a67', desc: 'מציג לאנשי מכירות PDF מעודכן תמיד שמשווה בין החברה שלהם למתחרות, ויודע להציג רק את המקומות שבהם החברה שלהם טובה יותר. כך מגדילים את אחוזי המכירה של צוותי המכירות.' },
  { title: 'בוט וואטסאפ לשירות לקוחות', art: 'bot', color: '#0b6b5c', desc: 'חוסך עובד ייעודי שיושב כל הזמן ליד הטלפון. הבוט מכיר את החברה, עונה מתוך הידע שצבר עליה, זמין תמיד ותמיד יש לו תשובה. במקרה קיצון הוא מפנה לעובד אנושי.' },
  { title: 'מערכת ניהול לדי ג׳יי', art: 'dj', color: '#0f1424', desc: 'CRM קטן ופשוט לדי ג׳יי: חתימה על חוזים דיגיטליים ושליחתם לשני הצדדים, תזכורת לפני פגישות, ותזכורות לשלם אחרי האירוע ולכתוב ביקורות באתרים שנבחרו.' },
]

const serviceIcons = [
  <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8M8 13h5" /></>,
  <><path d="M21 12a9 9 0 0 0-15-6.7L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 15 6.7L21 16" /><path d="M16 16h5v5" /></>,
  <><path d="M3 3v18h18" /><path d="M8 17v-5M13 17V8M18 17v-3" /></>,
  <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
]

const services = [
  { t: 'סוכן AI לשירות ולמכירות', d: 'צ׳אטבוט שמדבר עם הלקוחות, עונה מתוך המידע של העסק ומזהה שאלות שחוזרות על עצמן.' },
  { t: 'אוטומציה', d: 'המערכת עושה בשבילכם את העבודה הידנית: פחות טעויות ותהליכים שרצים מהר יותר.' },
  { t: 'דוחות וניתוח נתונים', d: 'מחליטים לפי מספרים: מערכת BI שמנתחת את העסק כמו אנליסט בכיר.' },
  { t: 'קליטת מסמכים וניתוח תוכן', d: 'המערכת קוראת, ממיינת ומבינה מסמכים, תמונות וסרטונים, וחוסכת הקלדה ידנית.' },
]

const steps = [
  { t: 'שיחת היכרות (ללא עלות)', d: 'מבינים מה העסק צריך ובודקים שזה אפשרי.' },
  { t: 'אפיון ומחקר', d: 'מגדירים תוכנית עבודה ברורה.' },
  { t: 'עיצוב ממשק', d: 'מתכננים מערכת פשוטה ונוחה לשימוש.' },
  { t: 'פיתוח ואימון', d: 'בונים את המערכת ומתאימים אותה לנתונים שלכם.' },
  { t: 'אב-טיפוס', d: 'אתם בודקים, מתנסים ומאשרים.' },
  { t: 'עלייה לאוויר', d: 'המערכת מתחילה לעבוד בשבילכם.' },
]

const SITE = 'https://sochen.co/'
const BRAND = 'SochenAI'

const faqs = [
  { q: 'מה זה סוכן AI בוואטסאפ?', a: 'סוכן AI בוואטסאפ הוא בוט חכם שמקבל הודעות מלקוחות או מעובדים, מבין מה ביקשו ומבצע פעולה אמיתית: קובע תור, מעדכן מערכת, שולח תזכורת או עונה על שאלה. הוא מתחבר למערכות של העסק, ולכן הוא לא רק עונה אלא גם עושה.' },
  { q: 'אילו תהליכים אפשר לאוטמט בעסק?', a: 'אפשר לאוטמט כמעט כל תהליך חוזר: הזמנות וקביעת תורים, תזכורות ותשלומים, איסוף ומיון פניות, שליחת עדכונים לצוות ב-Slack, ושיבוץ אנשים לפי תנאים ומגבלות. נתחיל מהתהליך שגוזל לכם הכי הרבה זמן.' },
  { q: 'אילו פרויקטים כבר נבנו?', a: 'בין הפרויקטים: מערכת לניהול סטודיו לאימון עם שיבוץ עצמי, כרטיסיה, תזכורות בוואטסאפ, מעקב משקלים לכל תרגיל ובוט AI, מערכת למעקב אחרי מתחרים עם התראות ל-Slack, ומערכת לשיבוץ צוותי מילואים דרך אייג׳נט בוואטסאפ עם דשבורד BI. בנוסף נבנו Automated Battlecards לאנשי מכירות, ובוט וואטסאפ לשירות לקוחות שמפנה לעובד אנושי במקרה קיצון, וגם מערכת CRM לדי ג׳יי עם חוזים דיגיטליים ותזכורות.' },
  { q: 'כמה עולה שיחת ההיכרות?', a: 'שיחת ההיכרות ללא עלות. בה מבינים את העסק, בודקים אם הפתרון אפשרי, ואתם מחליטים אם להמשיך.' },
  { q: 'איך מתחילים לעבוד?', a: 'מתחילים בשיחת היכרות. אחר כך באים אפיון ומחקר, עיצוב ממשק, פיתוח ואימון, אב-טיפוס שאתם בודקים ומאשרים, ולבסוף עלייה לאוויר.' },
  { q: 'האם אפשר לחבר את הפתרון למערכות שכבר יש לי?', a: 'כן. אפשר לחבר וואטסאפ, Slack, מערכות תשלום, CRM וגיליונות נתונים. אם הכלי שלכם חושף API או אפשרות ייצוא, אפשר לשלב אותו בפתרון.' },
]

function JsonLd() {
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: BRAND,
      alternateName: 'SochenAI - פתרונות עסקיים עם סוכני AI',
      url: SITE,
      logo: `${SITE}logo.png`,
      image: `${SITE}logo.png`,
      description: 'AI ואוטומציה שחוסכים זמן וכסף: סוכן AI לשירות ולמכירות, אוטומציה, ניתוח נתונים ב-BI וקליטת מסמכים.',
      inLanguage: 'he',
      areaServed: { '@type': 'Country', name: 'ישראל' },
      telephone: '+972525353259',
      knowsAbout: ['בינה מלאכותית', 'סוכני AI', 'אוטומציה עסקית', 'צ׳אטבוט', 'BI', 'ניתוח נתונים'],
      makesOffer: services.map((x) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: x.t, description: x.d } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: BRAND,
      url: SITE,
      inLanguage: 'he',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: 'he',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

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

function StrengthScene() {
  return (
    <svg viewBox="0 0 150 138" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="st-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ecd3be" />
          <stop offset=".62" stopColor="#c79f98" />
          <stop offset="1" stopColor="#7d5f78" />
        </linearGradient>
      </defs>
      <rect width="150" height="138" fill="url(#st-bg)" />
      {/* window light */}
      <rect x="92" y="0" width="14" height="86" fill="#fff" opacity=".28" />
      <rect x="110" y="0" width="14" height="86" fill="#fff" opacity=".2" />
      <rect x="128" y="0" width="14" height="86" fill="#fff" opacity=".14" />
      {/* floor, mat, plant */}
      <rect y="112" width="150" height="26" fill="#6c4f67" opacity=".55" />
      <ellipse cx="75" cy="114" rx="46" ry="5" fill="#3b2a4a" opacity=".55" />
      <rect x="14" y="98" width="12" height="15" rx="2" fill="#a86e55" />
      <path d="M20 98C10 90 8 78 14 70C18 80 20 88 20 98ZM20 98C22 86 28 78 36 76C34 86 28 94 20 98Z" fill="#6d8f68" />
      {/* lifter + barbell */}
      <g className="lift">
        <path d="M66 82h7l-1 30h-7zM77 82h7l2 30h-7z" fill="#3b2a4a" />
        <ellipse cx="68" cy="113" rx="7" ry="2.6" fill="#fff" /><ellipse cx="83" cy="113" rx="7" ry="2.6" fill="#fff" />
        <rect x="64" y="52" width="22" height="34" rx="7" fill="#f6ede7" />
        <rect x="64" y="80" width="22" height="5" fill="#3b2a4a" />
        <path d="M67 58L58 26M83 58L92 26" stroke="#f0c4a8" strokeWidth="5" strokeLinecap="round" />
        <rect x="71" y="52" width="8" height="8" rx="3" fill="#e9b394" />
        <circle cx="75" cy="31" r="5.5" fill="#8a4b2d" />
        <ellipse cx="75" cy="42" rx="8.5" ry="9.5" fill="#f0c4a8" />
        <path d="M66.500 42C65 31 85 31 83.500 42C81 36 70 36 66.500 42Z" fill="#8a4b2d" />
        <rect x="32" y="21" width="86" height="3" rx="1.500" fill="#d3d6dd" />
        <rect x="30" y="11" width="5" height="23" rx="2" fill="#2a2a33" /><rect x="36" y="14" width="4" height="17" rx="1.500" fill="#3a3a46" />
        <rect x="115" y="11" width="5" height="23" rx="2" fill="#2a2a33" /><rect x="110" y="14" width="4" height="17" rx="1.500" fill="#3a3a46" />
        <circle cx="58" cy="24" r="3.500" fill="#f0c4a8" /><circle cx="92" cy="24" r="3.500" fill="#f0c4a8" />
      </g>
    </svg>
  )
}

function StudioArt() {
  const rows = [['לחיצות חזה', '12', '14'], ['דדליפט', '40', '40'], ['סקוואט', '30', '30']]
  return (
    <div aria-hidden="true" className="relative h-full w-full overflow-hidden bg-[#0e0c13] text-white">
      {/* class card */}
      <div className="absolute bottom-3 right-3 top-3 w-[52%] overflow-hidden rounded-xl bg-gradient-to-br from-[#c9a58f] via-[#a67c7c] to-[#4f3b5c]">
        <StrengthScene />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
        <span className="absolute left-2 top-2 rounded-full bg-white/25 px-1.5 py-0.5 text-[8px]">19:00</span>
        <span className="absolute right-2 top-2 rounded-lg bg-white/25 px-1.5 py-0.5 text-center text-[8px] leading-tight">שלישי<br /><b className="text-[11px]">26</b></span>
        <span className="absolute right-2 top-[44px] rounded-full bg-[#d9344f] px-1.5 py-0.5 text-[7px] font-bold">מקומות אחרונים</span>
        <div className="absolute inset-x-2 bottom-2 text-right">
          <div className="text-[12px] font-extrabold leading-tight">Strength</div>
          <div className="mb-1.5 text-[8px] text-white/70">עם יובל כהן</div>
          <div className="relative h-5">
            <span className="art-a absolute inset-0 grid place-items-center rounded-full bg-white text-[9px] font-bold text-[#2b2233]">הרשמה לאימון</span>
            <span className="art-b absolute inset-0 grid place-items-center rounded-full bg-[#25d366] text-[9px] font-bold">נרשמת ✓</span>
          </div>
        </div>
      </div>
      {/* weights tracking */}
      <div className="absolute bottom-3 left-3 top-3 w-[40%] rounded-xl border border-white/10 bg-white/[.06] p-2 text-right">
        <div className="mb-1.5 text-[9px] font-bold text-white/80">מעקב הרמות</div>
        {rows.map(([name, a, b], i) => (
          <div key={name} className="relative flex items-center justify-between border-b border-white/10 py-[3px] text-[8px]">
            <span className="text-white/70">{name}</span>
            <span className="relative h-3 w-8 text-left font-bold text-[#a78bfa]">
              <span className={i === 0 ? 'art-a absolute left-0' : 'absolute left-0'}>{a} ק״ג</span>
              {i === 0 && <span className="art-b absolute left-0">{b} ק״ג</span>}
            </span>
          </div>
        ))}
        <div className="art-pop2 mt-1.5 rounded-md bg-[#8b6cf0] px-1.5 py-1 text-center text-[8px] font-bold">שיא חדש!</div>
        <div className="art-pop absolute inset-x-2 bottom-2 rounded-lg rounded-bl-sm bg-[#d9fdd3] px-1.5 py-1 text-[7.5px] leading-snug text-[#1f2c34]">תזכורת: אימון מחר ב-19:00</div>
      </div>
    </div>
  )
}

function FeedArt() {
  return (
    <div aria-hidden="true" dir="ltr" className="relative h-full w-full overflow-hidden text-left bg-gradient-to-br from-[#d9f2fa] via-[#eceeff] to-[#f1e6ff] text-[#1d2433]">
      {/* sidebar */}
      <div className="absolute bottom-2.5 left-2.5 top-2.5 w-[31%] rounded-xl bg-white/85 p-2 shadow-sm">
        <div className="flex items-center gap-1 text-[8px] font-extrabold"><i className="h-3 w-3 rounded-full bg-gradient-to-br from-[#4d8dff] to-[#8b5cf6]" />Competitor Feed</div>
        <div className="mt-2 rounded-lg bg-white px-1.5 py-1 text-[8px] font-bold shadow-sm">Feed</div>
        <div className="mt-2 text-[6px] font-bold tracking-wider text-black/40">COMPETITORS</div>
        {['Acme', 'Bolt', 'Corex'].map((n, i) => (
          <div key={n} className="mt-1 flex items-center gap-1 text-[8px]">
            <i className="grid h-3 w-3 place-items-center rounded-full text-[6px] font-bold text-white" style={{ background: ['#4d8dff', '#fa8c7b', '#8b5cf6'][i] }}>{n[0]}</i>{n}
          </div>
        ))}
      </div>
      {/* feed */}
      <div className="absolute bottom-2.5 left-[36%] right-2.5 top-2.5">
        <div className="flex items-center gap-1 text-[8px]">
          <b className="mr-1 text-[10px]">Feed</b>
          <span className="rounded-full bg-[#1d2433] px-1.5 py-0.5 text-white">All</span>
          <span className="rounded-full bg-white/80 px-1.5 py-0.5">Sales</span>
          <span className="rounded-full bg-white/80 px-1.5 py-0.5">Product</span>
        </div>
        {[['Acme', 'Acme ships a new pricing page', '#4d8dff'], ['Bolt', 'Bolt launches an integration', '#fa8c7b']].map(([n, t, c], i) => (
          <div key={n} className="art-row mt-1.5 rounded-lg bg-white p-1.5 shadow-sm" style={{ animationDelay: `${i * 1.1}s` }}>
            <div className="flex items-center gap-1 text-[7px]"><i className="h-2.5 w-2.5 rounded-full" style={{ background: c }} /><b>{n}</b><span className="text-black/40">1d</span><span className="rounded bg-[#ece8ff] px-1 text-[6px] font-bold text-[#6d4fd1]">Release</span></div>
            <div className="mt-0.5 text-[8px] font-bold leading-tight">{t}</div>
            <div className="mt-0.5 border-l-2 border-[#4d8dff] pl-1 text-[6.5px] text-black/55">Why it matters: pricing pressure</div>
          </div>
        ))}
      </div>
      {/* Slack notification */}
      <div className="art-pop2 absolute bottom-2 right-2 w-[48%] rounded-lg bg-[#2b0f2e] p-1.5 text-white shadow-lg">
        <div className="flex items-center gap-1 text-[7px] text-white/60"><i className="grid h-3 w-3 place-items-center rounded bg-white/90 text-[6px] font-extrabold text-[#4a154b]">#</i>competitors</div>
        <div className="mt-0.5 text-[7.5px] font-bold text-[#7cc4ff]">Acme ships a new pricing page</div>
        <div className="mt-1 flex gap-1 text-[6.5px]"><span className="rounded border border-white/30 px-1.5 py-0.5">Read</span><span className="rounded border border-white/30 px-1.5 py-0.5">Open in app</span></div>
      </div>
    </div>
  )
}

function TeamArt() {
  return (
    <div aria-hidden="true" className="relative flex h-full w-full gap-3 overflow-hidden bg-gradient-to-br from-[#0b1f4a] to-[#1b4fb8] p-3 text-white">
      <div className="flex flex-1 flex-col justify-center gap-2 text-[10px]">
        <div className="art-pop self-start rounded-xl rounded-br-sm bg-white px-2.5 py-1.5 text-[#1f2c34]">מי פנוי ביום שלישי?</div>
        <div className="art-pop2 self-end rounded-xl rounded-bl-sm bg-[#d9fdd3] px-2.5 py-1.5 text-[#1f2c34]">שובצו 5 לוחמים ✓</div>
      </div>
      <div className="flex w-[40%] items-end gap-1.5 rounded-xl bg-white/10 p-2">
        {[55, 80, 45, 95].map((h, i) => (
          <span key={i} className="art-bar flex-1 rounded-t bg-[#fa8c7b]" style={{ height: `${h}%`, animationDelay: `${i * 0.35}s` }} />
        ))}
      </div>
    </div>
  )
}

function BattleArt() {
  const rows = [['מחיר', 'משתלם יותר'], ['זמן הטמעה', 'מהיר יותר'], ['תמיכה', 'זמינה תמיד']]
  return (
    <div aria-hidden="true" className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#dfe8ff] via-[#eef0ff] to-[#fbe9e4] p-3 text-[#1d2433]">
      <div className="mx-auto h-full w-[78%] rounded-lg bg-white p-2 text-right shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <b className="text-[10px]">Battlecard</b>
            <span className="rounded bg-[#e5484d] px-1 text-[6px] font-bold text-white">PDF</span>
          </div>
          <span className="flex items-center gap-0.5 rounded-full bg-[#e8f8ee] px-1.5 py-0.5 text-[6.5px] font-bold text-[#1a8f4c]">
            <svg className="art-spin" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" /></svg>
            עודכן עכשיו
          </span>
        </div>
        <div className="mt-1.5 flex justify-between text-[6.5px] font-bold text-black/45"><span>אנחנו מול המתחרה</span></div>
        {rows.map(([k, v], i) => (
          <div key={k} className="art-row mt-1 flex items-center justify-between rounded-md bg-[#f4f7ff] px-1.5 py-1 text-[8px]" style={{ animationDelay: `${i * 0.7}s` }}>
            <span className="font-bold">{k}</span>
            <span className="flex items-center gap-1 text-[#1a8f4c]"><i className="grid h-3 w-3 place-items-center rounded-full bg-[#1a8f4c] text-[7px] text-white not-italic">✓</i>{v}</span>
          </div>
        ))}
        <div className="mt-1.5 flex items-end gap-1">
          <span className="text-[6.5px] text-black/50">אחוזי מכירה</span>
          {[40, 55, 72, 90].map((h, i) => (
            <span key={i} className="art-bar w-2 rounded-t bg-[#4d8dff]" style={{ height: `${h * 0.22}px`, animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function BotArt() {
  return (
    <div aria-hidden="true" className="relative flex h-full w-full flex-col overflow-hidden bg-[#efeae2] text-[#1f2c34]">
      <div className="flex items-center gap-1.5 bg-[#075e54] px-2 py-1.5 text-white">
        <i className="grid h-4 w-4 place-items-center rounded-full bg-white/90 text-[7px] font-extrabold text-[#075e54] not-italic">S</i>
        <div className="text-right leading-tight"><div className="text-[8.5px] font-bold">שירות לקוחות</div><div className="text-[6.5px] text-white/75">מחובר</div></div>
      </div>
      <div className="relative flex-1 px-2 pt-1.5 text-[8px]">
        <div className="cb1 absolute right-2 top-1.5 max-w-[70%] rounded-lg rounded-tr-sm bg-[#d9fdd3] px-2 py-1 shadow-sm">מה שעות הפעילות?</div>
        <div className="cbd1 absolute left-2 top-[34px] flex gap-0.5 rounded-lg bg-white px-2 py-1.5 shadow-sm"><i className="dot" /><i className="dot" /><i className="dot" /></div>
        <div className="cb2 absolute left-2 top-[34px] max-w-[72%] rounded-lg rounded-tl-sm bg-white px-2 py-1 shadow-sm">אנחנו פתוחים א׳-ה׳ 9:00-18:00</div>
        <div className="cb3 absolute right-2 top-[62px] max-w-[70%] rounded-lg rounded-tr-sm bg-[#d9fdd3] px-2 py-1 shadow-sm">אפשר לדבר עם נציג?</div>
        <div className="cbd2 absolute left-2 top-[88px] flex gap-0.5 rounded-lg bg-white px-2 py-1.5 shadow-sm"><i className="dot" /><i className="dot" /><i className="dot" /></div>
        <div className="cb4 absolute left-2 top-[88px] max-w-[78%] rounded-lg rounded-tl-sm bg-white px-2 py-1 shadow-sm">מעביר אותך לנציג אנושי ✓</div>
      </div>
      <div className="mx-2 mb-1.5 flex items-center rounded-full bg-white px-2 py-1 text-[8px] shadow-sm">
        <span className="typed whitespace-nowrap text-black/70">מה שעות הפעילות?</span>
      </div>
    </div>
  )
}

function DjArt() {
  const rows = [['דנה ויוני', 'חתונה'], ['חברת Nova', 'אירוע עסקי'], ['מיכל', 'בת מצווה']]
  return (
    <div aria-hidden="true" className="relative flex h-full w-full gap-2 overflow-hidden bg-[#0f1424] p-2.5 text-white">
      {/* clients list */}
      <div className="w-[38%] rounded-xl bg-white/[.07] p-1.5 text-right">
        <div className="mb-1 text-[8px] font-bold text-white/70">לקוחות</div>
        {rows.map(([n, t], i) => (
          <div key={n} className="mb-1 rounded-lg bg-white/10 px-1.5 py-1">
            <div className="flex items-center justify-between text-[8px] font-bold">
              {n}
              <span className="relative h-3 w-10 text-[6px] font-bold">
                {i === 0 ? (
                  <>
                    <span className="art-a absolute inset-0 grid place-items-center rounded-full bg-[#f5a524] text-black">ממתין לחתימה</span>
                    <span className="art-b absolute inset-0 grid place-items-center rounded-full bg-[#25d366]">נחתם ✓</span>
                  </>
                ) : i === 1 ? (
                  <span className="absolute inset-0 grid place-items-center rounded-full bg-[#4d8dff]">שולם ✓</span>
                ) : (
                  <span className="absolute inset-0 grid place-items-center rounded-full bg-[#e5484d]">ממתין לתשלום</span>
                )}
              </span>
            </div>
            <div className="text-[6.5px] text-white/50">{t}</div>
          </div>
        ))}
      </div>
      {/* contract */}
      <div className="relative flex-1 rounded-xl bg-white p-2 text-right text-[#1d2433]">
        <div className="flex items-center justify-between"><b className="text-[9px]">חוזה הופעה</b><span className="text-[6.5px] text-black/40">דיגיטלי</span></div>
        <div className="mt-1 space-y-1"><i className="block h-[3px] rounded bg-black/10" /><i className="block h-[3px] w-4/5 rounded bg-black/10" /><i className="block h-[3px] w-3/5 rounded bg-black/10" /></div>
        <div className="mt-1.5 flex items-end justify-between border-t border-dashed border-black/20 pt-1">
          <svg width="58" height="22" viewBox="0 0 90 30" fill="none" stroke="#1b3a8f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path className="sig" pathLength="100" d="M4 22C10 4 18 2 16 16S26 28 34 10 46 6 48 20 60 26 68 12 78 8 86 20" />
          </svg>
          <div className="flex gap-1 text-[6px] font-bold">
            <span className="rounded-full bg-[#e8f8ee] px-1 text-[#1a8f4c]">לקוח ✓</span>
            <span className="rounded-full bg-[#e8f8ee] px-1 text-[#1a8f4c]">די ג׳יי ✓</span>
          </div>
        </div>
        <div className="art-pop2 mt-1.5 rounded-md bg-[#1b3a8f] py-1 text-center text-[7px] font-bold text-white">נשלח לשני הצדדים ✓</div>
        <div className="art-pop absolute inset-x-1.5 bottom-1.5 rounded-lg bg-[#1f2937] px-2 py-1 text-[7px] leading-snug text-white shadow-lg">
          <b className="text-[#f5a524]">תזכורת:</b> פגישה מחר ב-18:00. אחרי האירוע: תשלום וביקורת
        </div>
      </div>
    </div>
  )
}

function Thumb({ p, big = false }: { p: Project; big?: boolean }) {
  if (p.src) {
    return <video src={p.src} poster={p.poster} muted loop playsInline autoPlay={!big} controls={big} className="h-full w-full object-cover" />
  }
  if (p.art === 'studio') return <StudioArt />
  if (p.art === 'feed') return <FeedArt />
  if (p.art === 'team') return <TeamArt />
  if (p.art === 'battle') return <BattleArt />
  if (p.art === 'bot') return <BotArt />
  if (p.art === 'dj') return <DjArt />
  return <div className="h-full w-full" style={{ background: p.color }} />
}

function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="logo-g" gradientUnits="userSpaceOnUse" x1="330" y1="120" x2="180" y2="410">
          <stop offset="0" stopColor="#ff1f1f" />
          <stop offset=".25" stopColor="#ff9d00" />
          <stop offset=".45" stopColor="#ff4fd8" />
          <stop offset=".7" stopColor="#8f6bff" />
          <stop offset=".85" stopColor="#1a9bff" />
          <stop offset="1" stopColor="#3ddc55" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill="#020a1a" />
      <path d="M336 184C336 150 302 128 256 128C206 128 172 152 172 190C172 232 210 246 256 256C304 267 344 282 344 328C344 368 308 392 256 392C206 392 170 368 168 330" fill="none" stroke="url(#logo-g)" strokeWidth="58" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

function Process() {
  const ref = useRef<HTMLOListElement>(null)
  const [p, setP] = useState(-1) // raw progress; <0 means the line has not reached the list yet

  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const update = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setP(calm ? 2 : (window.innerHeight * 0.62 - r.top) / r.height)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const n = steps.length
  const fill = Math.min(1, Math.max(0, p))
  return (
    <ol ref={ref} className="relative mx-auto max-w-2xl space-y-5">
      <span aria-hidden="true" className="absolute right-6 top-6 bottom-6 w-0.5 translate-x-1/2 bg-black/10" />
      <span aria-hidden="true" className="absolute right-6 top-6 w-0.5 translate-x-1/2 rounded-full" style={{ height: `calc((100% - 3rem) * ${fill})`, background: BLUE, transition: 'height .15s linear' }} />
      {steps.map((s, i) => {
        const on = p >= i / (n - 1) - 0.01
        return (
          <li key={s.t} className={`step relative flex items-start gap-5 ${on ? 'on' : ''}`}>
            <div className="step-dot relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="step-card flex-1 rounded-3xl border p-5">
              <h3 className="text-xl font-bold">{s.t}</h3>
              <p className="mt-1 text-black/65">{s.d}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

// Builds the WhatsApp message from whatever the visitor filled in; empty fields are simply left out.
function buildMessage({ name, business, help }: { name: string; business: string; help: string }) {
  const n = name.trim(), b = business.trim(), h = help.trim()
  let intro = 'היי'
  if (n && b) intro += `, אני ${n} ויש לי עסק בשם ${b}`
  else if (n) intro += `, אני ${n}`
  else if (b) intro += `, יש לי עסק בשם ${b}`
  const parts = [n || b ? `${intro}.` : 'היי,', 'הגעתי מהאתר של SochenAI.']
  parts.push(h ? `אשמח לעזרה ב: ${h}` : 'אשמח לשמוע איך AI יכול לחסוך לי זמן וכסף בעסק.')
  return parts.join(' ')
}

const SETS = 5 // the card set is repeated so the row can loop endlessly

function Gallery({ onOpen }: { onOpen: (p: Project) => void }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const holdUntil = useRef(0) // auto-scroll stays paused until this timestamp
  const hovering = useRef(false)
  const tipOpen = useRef(false)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const swallowClick = useRef(false)
  const [sets, setSets] = useState(1) // 1 set in the pre-rendered HTML, more once the page runs
  const [dragging, setDragging] = useState(false)
  const [tip, setTip] = useState<{ i: number; p: Project; x: number; y: number } | null>(null)
  tipOpen.current = tip !== null

  const pause = (ms = 5000) => { holdUntil.current = performance.now() + ms }
  const items = Array.from({ length: sets }, (_, k) => projects.map((p, j) => ({ p, k, key: `${k}-${j}` }))).flat()

  useEffect(() => setSets(SETS), [])

  // endless auto-scroll that pauses while the visitor hovers, drags, taps or has a tooltip open
  useEffect(() => {
    const row = rowRef.current
    if (!row || sets !== SETS) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const period = () => row.scrollWidth / SETS
    row.scrollLeft = period()
    let pos = row.scrollLeft, lastSet = pos, last = performance.now(), raf = 0
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64)
      last = now
      const p = period()
      const cur = row.scrollLeft
      if (Math.abs(cur - lastSet) > 1.5) pos = cur // visitor (or a smooth scroll) moved it
      let changed = false
      if (!calm && !hovering.current && !drag.current && !tipOpen.current && now > holdUntil.current) { pos += dt * 0.04; changed = true }
      if (pos >= p * 3) { pos -= p * 2; changed = true }
      else if (pos < p) { pos += p * 2; changed = true }
      if (changed) { row.scrollLeft = pos; lastSet = row.scrollLeft } // only write when we move it, so smooth scrolls and drags are not overridden
      else { pos = cur; lastSet = cur }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [sets])

  // close the tooltip when the page scrolls or a tap lands outside the cards
  useEffect(() => {
    const close = () => setTip(null)
    const outside = (e: PointerEvent) => { if (!(e.target as Element).closest?.('.gcard')) setTip(null) }
    window.addEventListener('scroll', close, { passive: true })
    window.addEventListener('resize', close)
    document.addEventListener('pointerdown', outside)
    return () => {
      window.removeEventListener('scroll', close)
      window.removeEventListener('resize', close)
      document.removeEventListener('pointerdown', outside)
    }
  }, [])

  const showTip = (i: number, p: Project, el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    setTip({ i, p, x: r.left + r.width / 2, y: r.bottom + r.height * 0.06 + 8 }) // allow for the hover growth
  }

  const step = (dir: 1 | -1) => {
    const row = rowRef.current
    const card = row?.querySelector<HTMLElement>('.gcard')
    if (!row || !card) return
    pause(7000)
    setTip(null)
    row.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: 'smooth' })
  }

  const canHover = () => window.matchMedia('(hover: hover)').matches

  return (
    <div className="relative">
      <div
        ref={rowRef}
        dir="ltr"
        className={`gallery-row flex gap-5 overflow-x-auto px-6 py-10 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') hovering.current = true }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') { hovering.current = false; setTip(null) } }}
        onTouchStart={() => pause(7000)}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || e.button !== 0) return
          drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false }
        }}
        onPointerMove={(e) => {
          const d = drag.current
          if (!d) return
          const dx = e.clientX - d.x
          if (!d.moved && Math.abs(dx) > 4) {
            d.moved = true
            e.currentTarget.setPointerCapture(e.pointerId)
            setDragging(true)
            setTip(null)
          }
          if (d.moved) e.currentTarget.scrollLeft = d.left - dx
        }}
        onPointerUp={() => {
          if (drag.current?.moved) { swallowClick.current = true; setTimeout(() => { swallowClick.current = false }, 0) }
          drag.current = null
          setDragging(false)
          pause(4000)
        }}
        onPointerCancel={() => { drag.current = null; setDragging(false) }}
      >
        {items.map(({ p, k, key }, idx) => {
          const first = k === 0
          const i = idx % projects.length
          return (
            <div key={key} className="gcard relative w-72 shrink-0 md:w-80" aria-hidden={first ? undefined : true}>
              <button
                dir="rtl"
                tabIndex={first ? 0 : -1}
                className="block w-full select-none text-right"
                onPointerEnter={(e) => { if (e.pointerType === 'mouse' && !drag.current) showTip(i, p, e.currentTarget) }}
                onPointerLeave={(e) => { if (e.pointerType === 'mouse') setTip(null) }}
                onFocus={(e) => { if (first && e.currentTarget.matches(':focus-visible')) { pause(8000); showTip(i, p, e.currentTarget) } }}
                onBlur={() => setTip(null)}
                onClick={(e) => {
                  if (swallowClick.current) return
                  if (p.src) return onOpen(p)
                  if (!canHover()) { if (tip?.i === i) setTip(null); else showTip(i, p, e.currentTarget) }
                }}
              >
                <div className="aspect-video overflow-hidden rounded-3xl shadow-md"><Thumb p={p} /></div>
                <div className="mt-3 px-1 font-bold">{p.title}</div>
                {first && <span className="sr-only">{p.desc}</span>}
              </button>
            </div>
          )
        })}
      </div>

      <button type="button" aria-label="הקודם" onClick={() => step(-1)} className="gal-arrow left-3 hidden md:grid">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
      </button>
      <button type="button" aria-label="הבא" onClick={() => step(1)} className="gal-arrow right-3 hidden md:grid">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
      </button>

      {tip && (
        <div role="tooltip" dir="rtl" className="gtip" style={{ left: Math.min(Math.max(tip.x, 172), window.innerWidth - 172), top: tip.y }}>
          <strong>{tip.p.title}</strong>
          {tip.p.desc}
        </div>
      )}
    </div>
  )
}

const pill = 'inline-flex items-center justify-center rounded-full px-8 py-3 text-lg font-medium transition'
const input = 'block w-full text-right rounded-full border border-white/70 bg-transparent px-5 py-3 text-base font-normal text-white outline-none focus:border-white'

export default function App() {
  useReveal()
  const [open, setOpen] = useState<Project | null>(null)
  const [form, setForm] = useState({ name: '', business: '', help: '' })
  const href = wa(buildMessage(form))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    window.open(href, '_blank', 'noopener')
  }

  return (
    <div>
      <main>
      {/* Hero */}
      <section id="top" className="hero-bg px-4 pb-24 text-white">
        <nav className="mx-auto mt-4 flex max-w-5xl items-center justify-between rounded-full bg-black px-6 py-3">
          <a href="#top" className="flex items-center gap-2 font-bold"><Logo className="h-8 w-8" />SochenAI</a>
          <div className="hidden gap-7 text-sm md:flex">
            <a href="#services">מה אנחנו בונים</a>
            <a href="#portfolio">מה כבר בנינו</a>
            <a href="#process">איך זה עובד</a>
            <a href="#faq">שאלות נפוצות</a>
          </div>
          <a href="#contact" className="rounded-full border border-white px-5 py-1.5 text-sm">צור קשר</a>
        </nav>
        <div className="mx-auto grid max-w-5xl items-center gap-8 pt-14 md:grid-cols-[1.2fr_1fr] md:pt-16">
         <div className="text-center md:text-right">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl" style={{ color: CORAL }}>
            AI ואוטומציה שחוסכים זמן וכסף
          </h1>
          <p className="mt-6 text-xl leading-relaxed md:text-2xl">
            פתרונות חכמים שעובדים בשבילכם 24/7.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3 md:justify-start">
            <a href={wa(OPENING)} target="_blank" rel="noreferrer" className={`${pill} bg-black hover:bg-white hover:text-black`}>לשיחת היכרות ללא עלות ←</a>
          </div>
         </div>
         <Woman />
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-4 py-20">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-black p-8 text-white md:p-14">
          <h2 className="reveal text-3xl font-bold md:text-4xl">מה אנחנו בונים?</h2>
          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {services.map((s, i) => (
              <div key={s.t} className="reveal">
                <div className="mb-2 flex items-center gap-3">
                  <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl" style={{ background: 'rgba(250,140,123,.16)', color: CORAL }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{serviceIcons[i]}</svg>
                  </span>
                  <h3 className="text-xl font-bold" style={{ color: CORAL }}>{s.t}</h3>
                </div>
                <p className="text-white/70">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="pb-12">
        <div className="mx-auto mb-2 max-w-5xl px-4 text-center">
          <h2 className="reveal text-3xl font-bold md:text-4xl">מה כבר בנינו</h2>
          <p className="reveal mt-2 text-lg text-black/60">עברו עם העכבר על פרויקט כדי להגדיל ולקרוא מה נעשה בו. אפשר לגרור ולגלול.</p>
        </div>
        <Gallery onOpen={setOpen} />
      </section>

      {/* Process */}
      <section id="process" className="overflow-x-clip px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="reveal mb-10 text-center text-3xl font-bold md:text-4xl">איך זה עובד?</h2>
          <Process />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="reveal mb-8 text-center text-3xl font-bold md:text-4xl">שאלות נפוצות</h2>
          <div className="divide-y divide-black/10 rounded-3xl border border-black/10">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none text-lg font-bold">{f.q}</summary>
                <p className="mt-3 text-black/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing / Contact */}
      <section id="contact" className="px-4 py-20 text-white" style={{ background: BLUE }}>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">רוצים לבדוק מה AI יכול לחסוך אצלכם?</h2>
          <form onSubmit={submit} className="mt-8 space-y-4 text-right">
            <label className="block text-sm font-medium">
              שם
              <input name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${input} mt-1.5`} />
            </label>
            <label className="block text-sm font-medium">
              שם העסק
              <input name="business" autoComplete="organization" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} className={`${input} mt-1.5`} />
            </label>
            <label className="block text-sm font-medium">
              במה נוכל לעזור?
              <input name="help" autoComplete="off" value={form.help} onChange={(e) => setForm({ ...form, help: e.target.value })} className={`${input} mt-1.5`} />
            </label>
            <button type="submit" tabIndex={-1} aria-hidden="true" className="sr-only">שליחה</button>
            <a href={href} target="_blank" rel="noopener noreferrer" className={`${pill} w-full bg-black text-white hover:bg-white hover:text-black`}>שליחה בוואטסאפ</a>
          </form>
        </div>
      </section>
      </main>

      <footer className="py-6 text-center text-sm text-black/50">© {new Date().getFullYear()} SochenAI | פתרונות עסקיים עם סוכני AI</footer>

      <JsonLd />

      {/* Floating WhatsApp */}
      <a
        href={wa(OPENING)}
        target="_blank"
        rel="noreferrer"
        aria-label="שלחו הודעה בוואטסאפ"
        className="wa-pulse fixed bottom-9 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-110"
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
