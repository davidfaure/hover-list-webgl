import type { Project } from "./data";

export const renderList = (list: HTMLElement, projects: Project[]) => {
  list.innerHTML = projects
    .map(
      (project) => `
        <li class="works__item">
          <a href="#" class="works__link">
            <span class="works__year">${project.year}</span>
            <span class="works__text">
              <span class="works__name">${project.title}</span>
              <span class="works__client">${project.client}</span>
            </span>
            <span class="works__cta">View project →</span>
          </a>
        </li>
      `,
    )
    .join("");
};
