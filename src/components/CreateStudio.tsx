import { useEffect, useMemo, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import JsBarcode from 'jsbarcode'
import { AlertTriangle, Check, Download, Palette, RotateCcw, Sparkles } from 'lucide-react'

interface Props { notify: (message: string) => void }
type QrShape = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'
type BarcodeFormat = 'CODE128' | 'CODE39' | 'EAN13'

const qrDefaults = { foreground: '#10251e', background: '#f5f3ed', shape: 'rounded' as QrShape, correction: 'M' as 'L' | 'M' | 'Q' | 'H', size: 300, margin: 16 }

export default function CreateStudio({ notify }: Props) {
  const [mode, setMode] = useState<'qr' | 'barcode'>('qr')
  const [payload, setPayload] = useState('https://codeforge.studio')
  const [payloadType, setPayloadType] = useState('url')
  const [qrForeground, setQrForeground] = useState(qrDefaults.foreground)
  const [qrBackground, setQrBackground] = useState(qrDefaults.background)
  const [qrShape, setQrShape] = useState<QrShape>(qrDefaults.shape)
  const [correction, setCorrection] = useState(qrDefaults.correction)
  const [qrSize, setQrSize] = useState(qrDefaults.size)
  const [qrMargin, setQrMargin] = useState(qrDefaults.margin)
  const [barValue, setBarValue] = useState('CODEFORGE-2026')
  const [barFormat, setBarFormat] = useState<BarcodeFormat>('CODE128')
  const [barWidth, setBarWidth] = useState(2)
  const [barHeight, setBarHeight] = useState(110)
  const [barFontSize, setBarFontSize] = useState(16)
  const [barForeground, setBarForeground] = useState('#10251e')
  const [barBackground, setBarBackground] = useState('#f5f3ed')
  const [barText, setBarText] = useState(true)
  const qrHost = useRef<HTMLDivElement>(null)
  const barcodeSvg = useRef<SVGSVGElement>(null)
  const qrInstance = useRef<QRCodeStyling | undefined>(undefined)
  const barcodeError = useMemo(() => validateBarcode(barValue, barFormat), [barValue, barFormat])
  const qrWarning = useMemo(() => getContrastWarning(qrForeground, qrBackground), [qrForeground, qrBackground])

  useEffect(() => {
    if (mode !== 'qr' || !qrHost.current) return
    const instance = new QRCodeStyling({ width: qrSize, height: qrSize, data: payload.trim() || ' ', margin: qrMargin, qrOptions: { errorCorrectionLevel: correction }, dotsOptions: { color: qrForeground, type: qrShape }, backgroundOptions: { color: qrBackground }, cornersSquareOptions: { color: qrForeground, type: 'extra-rounded' }, cornersDotOptions: { color: qrForeground, type: 'dot' } })
    qrHost.current.replaceChildren(); instance.append(qrHost.current); qrInstance.current = instance
  }, [mode, payload, qrForeground, qrBackground, qrShape, correction, qrSize, qrMargin])

  useEffect(() => {
    if (mode !== 'barcode' || !barcodeSvg.current) return
    if (barcodeError) { barcodeSvg.current.replaceChildren(); return }
    JsBarcode(barcodeSvg.current, barValue, { format: barFormat, width: barWidth, height: barHeight, margin: 14, background: barBackground, lineColor: barForeground, displayValue: barText, fontSize: barFontSize, textMargin: 7 })
  }, [mode, barValue, barFormat, barWidth, barHeight, barFontSize, barForeground, barBackground, barText, barcodeError])

  const download = () => {
    if (mode === 'qr') qrInstance.current?.download({ name: 'codeforge-qr', extension: 'png' })
    else if (barcodeSvg.current && !barcodeError) { const blob = new Blob([new XMLSerializer().serializeToString(barcodeSvg.current)], { type: 'image/svg+xml' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'codeforge-barcode.svg'; link.click(); URL.revokeObjectURL(url) }
    notify('Exportación iniciada')
  }
  const updatePayloadType = (value: string) => { setPayloadType(value); const defaults: Record<string, string> = { url: 'https://codeforge.studio', email: 'mailto:hello@codeforge.studio', phone: 'tel:+15550102026', wifi: 'WIFI:T:WPA;S:Network;P:Password;;', geo: 'geo:40.7128,-74.0060', text: '' }; setPayload(defaults[value] ?? '') }
  const resetQr = () => { setQrForeground(qrDefaults.foreground); setQrBackground(qrDefaults.background); setQrShape(qrDefaults.shape); setCorrection(qrDefaults.correction); setQrSize(qrDefaults.size); setQrMargin(qrDefaults.margin) }

  return <><div className="eyebrow">Creador de códigos</div><h1>Hazlo tuyo.<br /><span className="gold">Hazlo escaneable.</span></h1><p className="lead">Un editor visual, con controles precisos y avisos cuando un diseño puede perder fiabilidad.</p><div className="creator-switch"><button className={mode === 'qr' ? 'active' : ''} onClick={() => setMode('qr')}><Sparkles size={14} /> Código QR</button><button className={mode === 'barcode' ? 'active' : ''} onClick={() => setMode('barcode')}><Palette size={14} /> Código de barras</button></div><div className="grid create-grid"><section className="panel editor-panel"><div className="panel-title"><div><h2>Editor</h2><span className="muted">Cambios en tiempo real</span></div><button className="text-action" onClick={mode === 'qr' ? resetQr : () => setBarValue('CODEFORGE-2026')}><RotateCcw size={13} /> Restaurar</button></div>{mode === 'qr' ? <QrEditor payloadType={payloadType} payload={payload} setPayload={setPayload} updatePayloadType={updatePayloadType} foreground={qrForeground} setForeground={setQrForeground} background={qrBackground} setBackground={setQrBackground} shape={qrShape} setShape={setQrShape} correction={correction} setCorrection={setCorrection} size={qrSize} setSize={setQrSize} margin={qrMargin} setMargin={setQrMargin} warning={qrWarning} /> : <BarcodeEditor value={barValue} setValue={setBarValue} format={barFormat} setFormat={setBarFormat} width={barWidth} setWidth={setBarWidth} height={barHeight} setHeight={setBarHeight} fontSize={barFontSize} setFontSize={setBarFontSize} foreground={barForeground} setForeground={setBarForeground} background={barBackground} setBackground={setBarBackground} displayValue={barText} setDisplayValue={setBarText} error={barcodeError} />}<div className="actions editor-actions"><button className="secondary" onClick={download}><Download size={14} /> Descargar</button></div></section><section className="panel preview-panel"><div className="panel-title"><div><h2>Vista previa</h2><span className="muted">Listo para descargar</span></div><span className="live-dot"><Check size={12} /> En vivo</span></div><div className="preview">{mode === 'qr' ? <div ref={qrHost} aria-label="Vista previa del código QR" /> : <svg ref={barcodeSvg} aria-label="Vista previa del código de barras" />}</div><p className="preview-note">{mode === 'qr' ? 'Mantén un contraste alto y deja espacio alrededor del código.' : 'Los formatos lineales necesitan barras nítidas y suficiente altura.'}</p></section></div></>
}

function QrEditor({ payloadType, payload, setPayload, updatePayloadType, foreground, setForeground, background, setBackground, shape, setShape, correction, setCorrection, size, setSize, margin, setMargin, warning }: { payloadType: string; payload: string; setPayload: (value: string) => void; updatePayloadType: (value: string) => void; foreground: string; setForeground: (value: string) => void; background: string; setBackground: (value: string) => void; shape: QrShape; setShape: (value: QrShape) => void; correction: string; setCorrection: (value: 'L' | 'M' | 'Q' | 'H') => void; size: number; setSize: (value: number) => void; margin: number; setMargin: (value: number) => void; warning: string }) {
  return <div className="editor-sections"><section className="editor-section"><div className="section-heading"><span>01</span><div><strong>Contenido</strong><small>Qué quieres codificar</small></div></div><div className="form-grid"><div className="field"><label>TIPO</label><select value={payloadType} onChange={(event) => updatePayloadType(event.target.value)}><option value="url">Website URL</option><option value="text">Texto</option><option value="email">Email</option><option value="phone">Teléfono</option><option value="wifi">Wi-Fi</option><option value="geo">Ubicación</option></select></div><div className="field"><label>CONTENIDO</label><textarea value={payload} onChange={(event) => setPayload(event.target.value)} placeholder="Escribe el contenido..." /></div></div></section><section className="editor-section"><div className="section-heading"><span>02</span><div><strong>Dirección de arte</strong><small>Forma y paleta visual</small></div></div><label className="field"><span className="field-label">FORMA DE MÓDULOS</span><select value={shape} onChange={(event) => setShape(event.target.value as QrShape)}>{(['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'] as QrShape[]).map((value) => <option key={value} value={value}>{value}</option>)}</select></label><div className="color-row"><ColorInput label="Módulos" value={foreground} onChange={setForeground} /><ColorInput label="Fondo" value={background} onChange={setBackground} /></div>{warning && <div className="inline-warning"><AlertTriangle size={14} /> {warning}</div>}</section><section className="editor-section"><div className="section-heading"><span>03</span><div><strong>Fiabilidad</strong><small>Más corrección, más tolerancia</small></div></div><div className="segmented">{(['L', 'M', 'Q', 'H'] as const).map((value) => <button key={value} className={correction === value ? 'active' : ''} onClick={() => setCorrection(value)}>{value}<small>{value === 'L' ? '7%' : value === 'M' ? '15%' : value === 'Q' ? '25%' : '30%'}</small></button>)}</div><Range label={`Tamaño · ${size}px`} value={size} min={180} max={720} step={10} onChange={setSize} /><Range label={`Margen · ${margin}px`} value={margin} min={8} max={40} step={1} onChange={setMargin} /></section></div>
}

function BarcodeEditor({ value, setValue, format, setFormat, width, setWidth, height, setHeight, fontSize, setFontSize, foreground, setForeground, background, setBackground, displayValue, setDisplayValue, error }: { value: string; setValue: (value: string) => void; format: BarcodeFormat; setFormat: (value: BarcodeFormat) => void; width: number; setWidth: (value: number) => void; height: number; setHeight: (value: number) => void; fontSize: number; setFontSize: (value: number) => void; foreground: string; setForeground: (value: string) => void; background: string; setBackground: (value: string) => void; displayValue: boolean; setDisplayValue: (value: boolean) => void; error: string }) {
  return <div className="editor-sections"><section className="editor-section"><div className="section-heading"><span>01</span><div><strong>Contenido</strong><small>Valor y formato</small></div></div><div className="form-grid"><div className="field"><label>FORMATO</label><select value={format} onChange={(event) => setFormat(event.target.value as BarcodeFormat)}><option value="CODE128">Code 128 · flexible</option><option value="CODE39">Code 39 · industrial</option><option value="EAN13">EAN-13 · retail</option></select></div><div className="field"><label>VALOR</label><input value={value} onChange={(event) => setValue(event.target.value)} /></div></div>{error && <div className="inline-warning"><AlertTriangle size={14} /> {error}</div>}</section><section className="editor-section"><div className="section-heading"><span>02</span><div><strong>Estilo</strong><small>Color, escala y etiqueta</small></div></div><div className="color-row"><ColorInput label="Barras" value={foreground} onChange={setForeground} /><ColorInput label="Fondo" value={background} onChange={setBackground} /></div><Range label={`Grosor · ${width}px`} value={width} min={1} max={5} step={1} onChange={setWidth} /><Range label={`Alto · ${height}px`} value={height} min={50} max={240} step={10} onChange={setHeight} /><Range label={`Texto · ${fontSize}px`} value={fontSize} min={10} max={28} step={1} onChange={setFontSize} /><label className="check"><input type="checkbox" checked={displayValue} onChange={(event) => setDisplayValue(event.target.checked)} /> Mostrar valor bajo las barras</label></section></div>
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="color-input"><input type="color" value={value} aria-label={`Color de ${label}`} onChange={(event) => onChange(event.target.value)} /><span>{label}</span><code>{value.toUpperCase()}</code></label> }
function Range({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) { return <label className="range"><span>{label}</span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label> }
function validateBarcode(value: string, format: BarcodeFormat) { if (!value.trim()) return 'Escribe un valor para generar el código.'; if (format === 'EAN13' && !/^\d{12,13}$/.test(value)) return 'EAN-13 necesita 12 dígitos (o 13 con dígito de control).'; if (format === 'CODE39' && !/^[0-9A-Z $%+\-./]+$/.test(value)) return 'Code 39 solo acepta mayúsculas, números y sus símbolos permitidos.'; return '' }
function getContrastWarning(foreground: string, background: string) { const luminance = (hex: string) => { const rgb = hex.slice(1).match(/.{2}/g)?.map((part) => Number.parseInt(part, 16) / 255) ?? [0, 0, 0]; return rgb.map((value) => value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0) }; const ratio = (Math.max(luminance(foreground), luminance(background)) + .05) / (Math.min(luminance(foreground), luminance(background)) + .05); return ratio < 3 ? 'Contraste bajo: el código puede ser difícil de escanear.' : '' }
