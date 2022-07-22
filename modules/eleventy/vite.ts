import os from 'node:os'

const isProduction = process.env.NODE_ENV !== undefined
const viteUrl = isProduction ? viteUrlForProduction : viteUrlForDevelopment

process.env.VITE_URL ||= `http://${getHost(process.env.HOST || '')}:5173`

function viteUrlForDevelopment(url: string) {
  const viteUrl = new URL(process.env.VITE_URL || 'http://localhost:5173')
  viteUrl.pathname = url
  return viteUrl.toString()
}

function viteUrlForProduction(url: string) {
  return url
}

function bootVite() {
  return isProduction
    ? ''
    : `<script type="module" src="${viteUrlForDevelopment('@vite/client')}"></script><script type="module" src="${viteUrlForDevelopment(
        'src/client/main.js'
      )}"></script>`
}

function vite(url: string) {
  return viteUrl.call(this, url)
}

function getHost(hostname: string) {
  if (hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '') {
    return 'localhost'
  }
  return Object.values(os.networkInterfaces())
    .flatMap((nInterface) => nInterface ?? [])
    .filter((detail) => detail && detail.address && detail.family === 'IPv4')
    .map((detail) => {
      // const type = detail.address.includes('127.0.0.1') ? 'Local:   ' : 'Network: '
      return detail.address.replace('127.0.0.1', hostname)
    })
    .slice(-1)
}

export { bootVite, vite, viteUrl }
