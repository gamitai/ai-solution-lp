// Injects the server-rendered HTML into dist/index.html so crawlers see real content without running JS.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const { render, ABOUT, faqs, projects, services, steps } = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href)
const htmlPath = path.join(root, 'dist/index.html')
const template = readFileSync(htmlPath, 'utf8')
if (!template.includes('<div id="root"></div>')) throw new Error('root placeholder not found')
writeFileSync(htmlPath, template.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
const md = [
  '# SochenAI - פתרונות עסקיים עם סוכני AI',
  '',
  '> תטמיעו סוכני AI ואוטומציות בעסק שלכם: תחסכו אדמיניסטרציה ועבודה ידנית ותתמקדו במה שאתם באמת טובים.',
  '',
  '## מי אנחנו', ABOUT, '',
  '## מה אנחנו בונים', ...services.map((x) => `- **${x.t}**: ${x.d}`), '',
  '## מה כבר בנינו', ...projects.map((x) => `- **${x.title}**: ${x.desc}`), '',
  '## איך זה עובד', ...steps.map((x, i) => `${i + 1}. **${x.t}**: ${x.d}`), '',
  '## שאלות נפוצות', ...faqs.flatMap((f) => [`### ${f.q}`, f.a, '']),
  '## יצירת קשר', '[וואטסאפ](https://wa.me/972525353259)', '',
].join('\n')
writeFileSync(path.join(root, 'dist/index.md'), md)
writeFileSync(path.join(root, 'dist/llms-full.txt'), md)
rmSync(path.join(root, 'dist-server'), { recursive: true, force: true })
console.log('prerendered dist/index.html')
