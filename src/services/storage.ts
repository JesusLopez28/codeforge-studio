import type { CodeRecord } from '../types'
const KEY = 'codeforge-history-v1'
export function loadHistory(): CodeRecord[] { try { const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]'); return Array.isArray(parsed) ? parsed : [] } catch { return [] } }
export function saveHistory(items: CodeRecord[]) { try { localStorage.setItem(KEY, JSON.stringify(items.slice(0, 100))) } catch { /* storage can be blocked */ } }
