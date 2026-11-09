import "./frame.css";
import { frame } from "./config";

// Set by vite.config.ts: the branch this build comes from
declare const __BRANCH__: string;

const SITE = "https://davidfaure.eu";

const link = (href: string, label: string) =>
  `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;

// Read from the page's own background, so the frame stays legible on light and dark demos
const isDark = () => {
  for (const element of [document.body, document.documentElement]) {
    const [r = 255, g = 255, b = 255, a = 1] =
      getComputedStyle(element).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];

    if (a > 0) return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
  }

  return false;
};

// Embedded, as in the Lab, the page around the demo already says all this
if (window.self === window.top) {
  const branch = __BRANCH__;

  const steps = Object.entries(frame.steps)
    .map(([step, demo]) =>
      step === branch
        ? `<span aria-current="page">${step}</span>`
        : link(`${SITE}/demos/${demo}/`, step),
    )
    .join("");

  const header = document.createElement("header");

  header.className = `frame${isDark() ? " frame--dark" : ""}`;
  header.innerHTML = `
    <div class="frame__effect">
      <p class="frame__title">${frame.title}${branch ? ` <span class="frame__branch">${branch}</span>` : ""}</p>
      <nav class="frame__links">
        ${link(`${SITE}/lab/${frame.slug}`, "Tutorial")}
        ${link(branch ? `${frame.repo}/tree/${branch}` : frame.repo, "GitHub")}
      </nav>
    </div>
    <div class="frame__author">
      <p>by David Faure</p>
      <nav class="frame__links">
        ${link(SITE, "Portfolio")}
        ${link(`${SITE}/lab`, "Lab")}
        ${frame.alcide ? link(frame.alcide, "Alcide") : ""}
      </nav>
    </div>
    ${steps ? `<nav class="frame__steps"><span class="frame__label">Steps</span>${steps}</nav>` : ""}
    <p class="frame__tags">${frame.tags.map((tag) => `#${tag}`).join(" ")}</p>
  `;

  document.body.prepend(header);
}
