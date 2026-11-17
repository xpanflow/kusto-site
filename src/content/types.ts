export type SectionId =
  | "workflow"
  | "collaboration"
  | "finance"
  | "ai"
  | "tracking"
  | "mcp"
  | "deployment"
  | "contact";
export type SiteContent = Record<SectionId, { title: string; body: string }>;
export interface InterfaceContent {
  nav: string[];
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    demo: string;
    trial: string;
    scroll: string;
  };
  journey: string[];
  labels: Record<
    | "example"
    | "menu"
    | "skip"
    | "standard"
    | "multi"
    | "job"
    | "ocean"
    | "air"
    | "updated"
    | "eta"
    | "quote"
    | "cost"
    | "profit"
    | "pending"
    | "managed"
    | "self"
    | "draft"
    | "role",
    string
  >;
  roles: string[];
  tasks: string[];
  results: string[];
  mcpSteps: string[];
  faq: [string, string][];
  permissions: string;
  coverage: string;
  fileTools: string;
  hosting: string[];
  form: {
    labels: Record<
      "name" | "company" | "email" | "wechat" | "phone" | "intent" | "message",
      string
    >;
    group: string;
    disabled: string;
    unavailable: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    rate: string;
    required: string;
    invalid: string;
    long: string;
    privacy: string;
    noscript: string;
  };
  footer: string;
  backToTop: string;
}
