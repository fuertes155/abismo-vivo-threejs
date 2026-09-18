# Abismo Vivo — Santuario Bioluminiscente Abisal

Taller práctico de **Programación de Entornos Multimedia** (Semana 3): video como
textura 3D, audio espacial y animación en Three.js.

## Concepto

Un santuario en el fondo abisal del océano. En el centro flota el **Ojo Abisal**,
una superficie circular que proyecta un video en bucle, rodeada de coral
bioluminiscente, una anémona de tentáculos ondulantes y plancton ascendiendo.
El sonido ambiental del abismo se escucha con audio espacial: sube o baja de
volumen según qué tan cerca esté la cámara del Ojo Abisal.

Ver [`ficha-concepto.html`](./ficha-concepto.html) para la explicación completa
del concepto (ábrelo en el navegador y usa Ctrl+P → Guardar como PDF).

## Requisitos

- Node.js 18+

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre la URL que indique Vite (por defecto `http://localhost:5173`).

## Assets necesarios

Coloca tus propios archivos en `public/assets/` (no incluidos en el repositorio):

- `public/assets/video.mp4` — clip que se proyecta en el Ojo Abisal.
- `public/assets/audio.mp3` — sonido ambiental espacial.

Ver [`public/assets/LEEME.txt`](./public/assets/LEEME.txt) para más detalles.

## Controles

| Acción | Cómo |
|---|---|
| Iniciar / pausar video + audio | Botón en pantalla o tecla `Espacio` |
| Orbitar cámara | Arrastrar con el mouse |
| Acercar / alejar (afecta volumen del audio espacial) | Rueda del mouse |

## Estructura del proyecto

```
├── index.html          # Punto de entrada + overlay de UI
├── src/
│   ├── main.js          # Escena, animación, video, audio espacial
│   └── style.css         # Estilos del overlay
├── public/
│   └── assets/           # video.mp4 y audio.mp3 (agregar manualmente)
└── ficha-concepto.html  # Documento de concepto (1 página, imprimible a PDF)
```

## Tecnologías

Three.js · VideoTexture · PositionalAudio · OrbitControls · Vite

---
Eval Samuel Molina Fuertes
