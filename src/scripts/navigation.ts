const menu = document.querySelector<HTMLDetailsElement>(".site-menu");
const toggle = menu?.querySelector<HTMLElement>(".menu-toggle");
if (menu && toggle) {
  menu.addEventListener("toggle", () =>
    toggle.setAttribute("aria-expanded", String(menu.open)),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.open) {
      menu.open = false;
      toggle.focus();
    }
  });
  menu.querySelector("nav")?.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a")) menu.open = false;
  });
}
document
  .querySelectorAll<HTMLAnchorElement>("[data-language]")
  .forEach((link) => {
    const update = () => {
      try {
        const id = decodeURIComponent(location.hash.slice(1));
        link.hash = document.getElementById(id || "journey")
          ? location.hash
          : "";
      } catch {
        link.hash = "";
      }
    };
    window.addEventListener("hashchange", update);
    update();
  });
document.querySelectorAll<HTMLElement>("[data-intent]").forEach((link) =>
  link.addEventListener("click", () => {
    const select = document.querySelector<HTMLSelectElement>("[name=intent]");
    if (select)
      select.value = link.dataset.intent === "trial" ? "trial" : "demo";
  }),
);
