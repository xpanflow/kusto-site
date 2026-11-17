import {
  validateContact,
  type ContactValues,
  type FieldErrors,
} from "../lib/contact-validation";
import { sendContact } from "../lib/contact-transport";
import type { InterfaceContent } from "../content/types";
import type { SiteConfig } from "../lib/site-config";
const form = document.querySelector<HTMLFormElement>("[data-contact]");
if (form) {
  const config = JSON.parse(form.dataset.config!) as SiteConfig["form"];
  const messages = JSON.parse(
    form.dataset.messages!,
  ) as InterfaceContent["form"];
  const status = form.querySelector<HTMLElement>("[data-status]")!;
  const fieldset = form.querySelector<HTMLFieldSetElement>("fieldset")!;
  const button = form.querySelector<HTMLButtonElement>("[type=submit]")!;
  const successPanel = document.querySelector<HTMLElement>(
    "[data-contact-success]",
  );
  successPanel
    ?.querySelector<HTMLButtonElement>("[data-success-again]")
    ?.addEventListener("click", () => {
      successPanel.hidden = true;
      form.hidden = false;
      form.dataset.state = "idle";
      status.textContent = "";
      form.querySelector<HTMLInputElement>("[name=name]")?.focus();
    });
  let busy = false,
    lastPayload = "",
    requestId = "";
  const showErrors = (errors: FieldErrors) => {
    form
      .querySelectorAll("[aria-invalid]")
      .forEach((e) => e.removeAttribute("aria-invalid"));
    form.querySelectorAll(".field-error").forEach((e) => (e.textContent = ""));
    let first: HTMLElement | undefined;
    for (const [key, code] of Object.entries(errors)) {
      const field = form.elements.namedItem(key) as HTMLElement | null;
      const target = form.querySelector(`#error-${key}`);
      if (field && target) {
        field.setAttribute("aria-invalid", "true");
        target.textContent = messages[code];
        first ??= field;
      }
    }
    first?.focus();
    return Boolean(first);
  };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy || config.mode !== "remote") return;
    form.dataset.state = "validating";
    const input = Object.fromEntries(new FormData(form)) as ContactValues;
    const checked = validateContact(input);
    showErrors(checked.errors);
    if (!checked.valid) {
      form.dataset.state = "idle";
      return;
    }
    const fingerprint = JSON.stringify(checked.values);
    if (lastPayload !== fingerprint || !requestId) {
      lastPayload = fingerprint;
      requestId = crypto.randomUUID();
    }
    busy = true;
    form.dataset.state = "submitting";
    fieldset.disabled = true;
    status.textContent = messages.sending;
    button.textContent = messages.sending;
    const result = await sendContact(
      config.endpoint,
      {
        schemaVersion: 1,
        requestId,
        ...checked.values,
        locale: form.dataset.locale,
        source: "kusto-cargo-site",
      },
      config.timeoutMs,
      fetch,
      config.transport,
    );
    busy = false;
    fieldset.disabled = false;
    button.textContent = messages.submit;
    if (result.ok) {
      form.reset();
      lastPayload = "";
      requestId = "";
      form.dataset.state = "success";
      status.textContent = messages.success;
      if (successPanel) {
        form.hidden = true;
        successPanel.hidden = false;
        successPanel.focus();
      } else status.focus();
    } else {
      form.dataset.state = "error";
      status.textContent = messages[result.kind];
      if (!showErrors(result.fields ?? {})) status.focus();
    }
  });
  if (config.mode === "remote") {
    fieldset.disabled = false;
    status.textContent = "";
    form.dataset.state = "idle";
  } else {
    form.dataset.state = "disabled";
  }
}
