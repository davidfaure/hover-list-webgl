import "./style.css";
import { projects } from "./data";
import { renderList } from "./list";
import { Follower } from "./follower";
import { FollowerGL } from "./webgl/FollowerGL";

const list = document.querySelector<HTMLElement>("[data-list]");
const canHover = window.matchMedia("(hover: hover) and (min-width: 769px)");

if (list) {
  renderList(list, projects);

  if (canHover.matches) {
    const follower = new Follower(list, (index, forward, instant) =>
      gl.show(index, forward, instant),
    );
    const gl = new FollowerGL(
      follower,
      projects.map((project) => project.image),
    );
  }
}
