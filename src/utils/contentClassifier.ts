import type { ClassifiedContent } from '../types'

const field = (value: string | undefined) => value?.trim() ?? ''

export function classifyContent(raw: string): ClassifiedContent {
  const value = raw.trim()
  if (/^WIFI:/i.test(value)) {
    const fields = Object.fromEntries(value.slice(5).split(';').filter(Boolean).map((part) => {
      const [key, ...rest] = part.split(':')
      return [key.toUpperCase(), rest.join(':').replace(/\\([;,:\\])/g, '$1')]
    }))
    return { type: 'wifi', label: 'Wi-Fi network', details: { Network: field(fields.S), Security: field(fields.T) || 'None', Password: field(fields.P) || 'Not set', Hidden: fields.H === 'true' ? 'Yes' : 'No' } }
  }
  if (/^BEGIN:VCARD/i.test(value)) {
    const lines = value.split(/\r?\n/)
    const read = (prefix: string) => lines.find((line) => line.startsWith(prefix))?.split(':').slice(1).join(':') ?? ''
    return { type: 'vcard', label: 'Contact card', details: { Name: read('FN'), Phone: read('TEL'), Email: read('EMAIL'), Organization: read('ORG') } }
  }
  if (/^geo:/i.test(value)) { const [latitude, longitude] = value.slice(4).split(','); return { type: 'geo', label: 'Location', details: { Latitude: latitude ?? '', Longitude: longitude ?? '' } } }
  if (/^(SMSTO:|sms:)/i.test(value)) { const [number, message = ''] = value.replace(/^SMSTO:/i, '').replace(/^sms:/i, '').split(':'); return { type: 'sms', label: 'Text message', details: { Number: number, Message: message } } }
  if (/^mailto:/i.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { const parsed = value.replace(/^mailto:/i, '').split('?'); const query = new URLSearchParams(parsed[1] ?? ''); return { type: 'email', label: 'Email address', details: { Recipient: parsed[0], Subject: query.get('subject') ?? '', Body: query.get('body') ?? '' } } }
  if (/^tel:/i.test(value) || /^\+?[\d ().-]{7,}$/.test(value)) return { type: 'phone', label: 'Phone number', details: { Number: value.replace(/^tel:/i, '') } }
  if (/^https?:\/\//i.test(value)) {
    try { const url = new URL(value); return { type: 'url', label: 'Website', details: { Domain: url.hostname, Protocol: url.protocol.replace(':', '').toUpperCase(), Path: url.pathname, 'Query parameters': String([...url.searchParams].length), 'Potential caution': url.protocol === 'http:' ? 'This link does not use HTTPS.' : '' } } } catch { /* fallback */ }
  }
  try { JSON.parse(value); return { type: 'json', label: 'JSON data', details: { Structure: 'Valid JSON', Characters: String(value.length) } } } catch { /* fallback */ }
  return { type: 'text', label: 'Plain text', details: { Characters: String(value.length) } }
}
