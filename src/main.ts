import "./style.css";
import { projects } from "./data";
import { renderList } from "./list";
import { Follower } from "./follower";

const list = document.querySelector<HTMLElement>("[data-list]");
const canHover = window.matchMedia("(hover: hover) and (min-width: 769px)");

if (list) {
  renderList(list, projects);

  if (canHover.matches) {
    new Follower(
      list,
      projects.map((project) => project.image),
    );
  }
}
