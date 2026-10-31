# Hover List

A project list with an image preview that follows the cursor, built twice: once with the DOM, once with WebGL.

## Branches

| Branch  | What it shows                                                                  |
| ------- | ------------------------------------------------------------------------------ |
| `main`  | The list itself — markup, styles and data, no hover effect                     |
| `dom`   | The preview follows the cursor, images slide inside a DOM container            |
| `webgl` | Same behaviour, the image is now a WebGL plane synced to the DOM and distorted |

Compare the two versions:

```bash
git diff dom webgl
```

## How it works

- The effect is enabled on devices with a mouse, from 769px wide.
- The list sits above the image and uses `mix-blend-mode`, so the text stays readable over it.
- In the `webgl` branch the DOM stays in charge: GSAP animates an invisible proxy, and on every frame the plane copies its position, scale and opacity from GSAP, without reading the layout.

## Getting started

```bash
npm install
npm run dev
```

## Stack

- TypeScript
- Vite
- GSAP
- Three.js (`webgl` branch)
