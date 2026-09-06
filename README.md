# CodeForge Studio

Scan. Create. Understand.

Toolkit frontend para escanear, interpretar, generar y conservar localmente codigos legibles por maquina.

## Funciones

- Escaneo por camara e imagen con `@zxing/browser`.
- Interpretacion local de URL, email, telefono, Wi-Fi, vCard, geo, SMS, JSON y texto.
- Generacion QR en vivo con `qr-code-styling` y Code 128 con `jsbarcode`.
- Inspector, copiado, historial local buscable y UI responsive dark/light.

## Formatos soportados

El escaneo delega los formatos disponibles a ZXing en el navegador; pueden detectarse QR, Code 128, EAN, Data Matrix, PDF417 y Aztec segun el dispositivo. La generacion incluye QR Code y Code 128.

## Desarrollo

```bash
npm install
npm run dev
npm run build
```

## Netlify

El archivo `netlify.toml` configura el build de produccion, publica `dist` y redirige las rutas SPA a `index.html`.

## Privacidad

No hay autenticacion ni backend. Camara e imagenes se procesan localmente cuando el navegador lo permite. El historial usa localStorage. Las URLs nunca se abren automaticamente y el contenido escaneado se muestra como texto no confiable.
