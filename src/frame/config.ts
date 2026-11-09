// Everything the frame says about this effect: the same file on every branch
export const frame = {
  title: "Hover List",
  // The tutorial is at davidfaure.eu/lab/<slug>
  slug: "hover-list-webgl",
  repo: "https://github.com/davidfaure/hover-list-webgl",
  // Branch -> its full-screen demo at davidfaure.eu/demos/<demo>/, in the order of the steps
  steps: {
    dom: "hover-list-dom",
    webgl: "hover-list-webgl",
  } as Record<string, string>,
  tags: ["webgl", "three.js", "gsap", "shaders", "hover"],
  // Empty until the effect ships in Alcide
  alcide: "",
};
