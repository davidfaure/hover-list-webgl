import { execSync } from "node:child_process";
import { defineConfig } from "vite";

// The frame shows the branch. demo:add builds a detached checkout, so it passes the name in BRANCH.
const branch = () => {
  if (process.env.BRANCH) return process.env.BRANCH;

  try {
    const name = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();

    return name === "HEAD" ? "" : name;
  } catch {
    // Downloaded as a zip: no git, no branch
    return "";
  }
};

export default defineConfig({
  define: {
    __BRANCH__: JSON.stringify(branch()),
  },
});
