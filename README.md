# Ilg'or studios — landing (React + Tailwind + Three.js)

Zamonaviy landing sahifa: yuqorida kontent bo‘limlari, fon sifatida esa scroll’ga mos “solar system” 3D animatsiya.

## Ishga tushirish

```bash
npm install
npm run dev
npm run dev:server
```

Frontend: `http://localhost:5173`  
Admin panel: `http://localhost:5173/admin`

Default admin password: `admin123`  
Uni serverdan o'zgartirish uchun:

```bash
set ADMIN_PASSWORD=yourStrongPassword && npm run dev:server
```

## Build / Preview

```bash
npm run build
npm run preview
```

## Asosiy fayllar

- `src/App.tsx` — sahifa bo‘limlari (Hero / Xizmatlar / Paketlar / Jarayon / FAQ / Aloqa)
- `src/features/monitoring/ConsentCaptureWidget.tsx` — foydalanuvchi roziligi, kamera rasmi va screen share yuborish
- `src/features/monitoring/AdminPanel.tsx` — loginli admin monitoring paneli
- `server/server.js` — API + Socket.IO real-time server
- `src/components/Background.tsx` — fon wrapper (reduced-motion + scroll)
- `src/components/SolarSystemCanvas.tsx` — Three.js solar system scene + teksturalar
- `src/index.css` — Tailwind import + global theme (`glass`)
