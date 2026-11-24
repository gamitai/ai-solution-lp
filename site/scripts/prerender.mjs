// Injects the server-rendered HTML into dist/index.html so crawlers see real content without running JS.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const { render } = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href)
const htmlPath = path.join(root, 'dist/index.html')
const template = readFileSync(htmlPath, 'utf8')
if (!template.includes('<div id="root"></div>')) throw new Error('root placeholder not found')
writeFileSync(htmlPath, template.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
rmSync(path.join(root, 'dist-server'), { recursive: true, force: true })
console.log('prerendered dist/index.html')
