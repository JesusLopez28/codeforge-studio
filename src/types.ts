export type View = 'scan' | 'create' | 'inspector' | 'history' | 'settings'
export type ContentType = 'url' | 'email' | 'phone' | 'wifi' | 'geo' | 'vcard' | 'sms' | 'json' | 'text'
export interface ClassifiedContent { type: ContentType; label: string; details: Record<string, string> }
export interface CodeRecord { id: string; timestamp: number; operation: 'scanned' | 'generated'; codeFormat: string; content: string; contentType: ContentType; favorite?: boolean }
