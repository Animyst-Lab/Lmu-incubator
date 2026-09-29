export type NavItem = { label: string; href: string; external?: boolean };

export const REPO_URL = "https://github.com/Animyst-Lab/Lmu-incubator";

export const NAV_ITEMS: NavItem[] = [
  { label: "Find a match", href: "/#top" },
  { label: "Every cause", href: "/#causes" },
  { label: "How it works", href: "/#how" },
  { label: "By the numbers", href: "/#numbers" },
  { label: "Source code", href: REPO_URL, external: true },
];
