# Ilg'or studios — landing (React + Tailwind + Three.js)

Zamonaviy landing sahifa: yuqorida kontent bo‘limlari, fon sifatida esa scroll’ga mos “solar system” 3D animatsiya.

## Ishga tushirish

```bash
npm install
npm run dev
```

## Build / Preview

```bash
npm run build
npm run preview
```

## Asosiy fayllar

- `src/App.tsx` — sahifa bo‘limlari (Hero / Xizmatlar / Paketlar / Jarayon / FAQ / Aloqa)
- `src/components/Background.tsx` — fon wrapper (reduced-motion + scroll)
- `src/components/SolarSystemCanvas.tsx` — Three.js solar system scene + teksturalar
- `src/index.css` — Tailwind import + global theme (`glass`)
