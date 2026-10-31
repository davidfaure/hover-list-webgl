export interface Project {
  year: string;
  title: string;
  client: string;
  image: string;
}

export const projects: Project[] = [
  {
    year: "2025",
    title: "Opaline",
    client: "Maison Verre",
    image: "/images/project-1.webp",
  },
  {
    year: "2024",
    title: "Sève",
    client: "Atelier Nord",
    image: "/images/project-2.webp",
  },
  {
    year: "2024",
    title: "Lumière",
    client: "Studio Cendre",
    image: "/images/project-3.webp",
  },
  {
    year: "2023",
    title: "Écrin",
    client: "Galerie Onde",
    image: "/images/project-4.webp",
  },
];
