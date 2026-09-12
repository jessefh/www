export const themeInitScript = `
  try {
    if (localStorage.getItem("theme") === "light") {
      document.documentElement.dataset.theme = "light";
    }
  } catch (e) {}
`;

export function persistTheme(next: 'light'|'dark') {
  try {
    localStorage.setItem('theme', next);
    if (next === 'light') document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
  } catch {}
}
