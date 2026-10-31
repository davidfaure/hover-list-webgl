import "./style.css";
import { projects } from "./data";
import { renderList } from "./list";

const list = document.querySelector<HTMLElement>("[data-list]");

if (list) {
  renderList(list, projects);
}
