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
- In both versions, the list sits above the image and uses `mix-blend-mode`, so the text stays readable over it.

The `webgl` branch keeps the same list and the same images, with three changes:

1. **The DOM stays in charge.** The images are gone from the DOM: GSAP animates an invisible proxy, and on every frame the plane copies its position, scale and opacity from GSAP, without reading the layout.
2. **The lag becomes the bend.** The plane trails behind the cursor, and that offset curves its vertices (`deformationCurve` in `vertex.glsl`).
3. **The image swap bends.** When the preview moves to another row, the next image slides in behind a curved edge (`bend` and `edge` in `fragment.glsl`).

## Frame

The title, branch and links around the demo live in `src/frame/` and aren't part of the effect. The text is in `src/frame/config.ts`, the branch comes from git when Vite starts, and the frame hides itself when the demo is embedded in an iframe.

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
