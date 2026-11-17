document.querySelectorAll<HTMLElement>("[data-switch]").forEach((root) => {
  const buttons = [
    ...root.querySelectorAll<HTMLButtonElement>("[data-choice]"),
  ];
  const panels = [...root.querySelectorAll<HTMLElement>("[data-panel]")];
  const select = (id: string) => {
    buttons.forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.choice === id)),
    );
    panels.forEach((p) => (p.hidden = p.dataset.panel !== id));
  };
  root.querySelector<HTMLElement>("[data-controls]")!.hidden = false;
  buttons.forEach((b) =>
    b.addEventListener("click", () => select(b.dataset.choice!)),
  );
  if (buttons[0]) select(buttons[0].dataset.choice!);
});
