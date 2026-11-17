import type { SiteContent } from "./types";
export const en = {
  workflow: {
    title: "Your business has its own way of working.",
    body: "Start with a standard version. Our team works with you to adapt workflows, fields, documents and responsibilities to the way your company operates.",
  },
  collaboration: {
    title: "Keep every party connected.",
    body: "Customers, factories, shippers, consignees, importers, exporters and agents play different roles. Connect their relationships, cargo details and documents within one job to reduce repeated work and missed handovers.",
  },
  finance: {
    title: "Understand the costs and returns of every job.",
    body: "Bring quotes, costs, receivables, payables and settlement records together. Separate confirmed and pending costs to understand each job’s estimated profit and payment progress.",
  },
  ai: {
    title: "AI integrated into everyday freight operations.",
    body: "Work with AI in conversation and directly within documents and job pages. Organize information, check discrepancies and find outstanding tasks so your team can move work forward.",
  },
  tracking: {
    title: "Shipment updates, in one place.",
    body: "Connect ocean and air freight tracking services to bring the latest shipment and container milestones together. Spend less time checking separate websites and keep exceptions and next steps in view.",
  },
  mcp: {
    title: "Keep your familiar tools. Connect new capabilities.",
    body: "Connect AI assistants such as WorkBuddy, Codex and Claude Code to KustoCargo through MCP. Keep working with local Excel files while querying job records, comparing changes and applying updates within your permissions.",
  },
  deployment: {
    title: "Choose your deployment. Stay in control of your data.",
    body: "Choose managed hosting or self-hosting to suit your team.",
  },
  contact: {
    title: "See how KustoCargo could fit your business.",
    body: "Request a demo or trial access. Explore the system, then talk through your requirements with us.",
  },
} satisfies SiteContent;

import type { InterfaceContent } from "./types";
export const enUI = {
  nav: ["Capabilities", "AI assistant", "Tracking", "Get in touch"],
  hero: {
    eyebrow: "Built for small freight teams",
    accent: "AI-native",
    title: "International freight forwarding TMS",
    body: "AI integrated into bookings, documents, shipments and costs. Organize information, check discrepancies and follow up on jobs. Tailor workflows to your team and connect your preferred AI assistants through MCP.",
    demo: "Request a demo",
    trial: "Request trial access",
    scroll: "Follow a shipment. Discover KustoCargo.",
  },
  journey: [
    "China → Europe",
    "Start with a packing list",
    "Connect every party",
    "Bring shipment updates together",
    "Keep every step traceable",
  ],
  labels: {
    example: "Illustrative data",
    menu: "Menu",
    skip: "Skip to content",
    standard: "Standard forwarding",
    multi: "Multi-party coordination",
    job: "Shipment job",
    ocean: "Ocean",
    air: "Air",
    updated: "Example update",
    eta: "Estimated arrival",
    quote: "Customer quote",
    cost: "Estimated cost",
    profit: "Estimated gross profit",
    pending: "Includes pending costs",
    managed: "Managed hosting",
    self: "Self-hosted",
    draft: "Draft ready for review",
    role: "Export operations",
  },
  roles: [
    "Customer · Customer B",
    "Supplies · Factory A",
    "Exports · Exporter C",
    "Imports · Importer D",
    "Receives · Consignee E",
    "Coordinates · Agent F",
  ],
  tasks: [
    "Turn this packing list into a booking draft.",
    "Compare the packing list with the booking details.",
    "Which shipments need my attention today?",
  ],
  results: [
    "Organized 20 cartons / 400 kg. Delivery address is missing.",
    "Packing list: 20 cartons. Booking draft: 18 cartons. Review the source documents.",
    "Next steps: review carton count, add delivery address, confirm delivery costs.",
  ],
  assistantExamples: "Choose the AI assistant you know",
  mcpSteps: ["Read your worksheet", "Compare job records", "Review and update"],
  faq: [
    [
      "Is it suitable for small teams?",
      "Designed for freight teams of around 2–20 people. Start with the standard version and adapt it to your way of working.",
    ],
    [
      "Who tailors the workflows?",
      "Our team works with you on requirements and custom development. The scope is agreed together.",
    ],
    [
      "Can we keep using Excel?",
      "We can design around your existing spreadsheets and connect the system through compatible agents and MCP. The setup depends on your tools and workflows.",
    ],
    [
      "How do we arrange a demo or trial?",
      "Leave your email or WeChat ID and select your interest. We will contact you to arrange access and discuss your workflow.",
    ],
  ],
  permissions: "AI works within the current user’s business permissions.",
  coverage:
    "Update frequency and coverage depend on the connected data provider.",
  fileTools:
    "Use an assistant version that supports MCP, then configure the KustoCargo connection and permissions. Reading and editing local Excel files depends on the assistant’s file tools.",
  hosting: [
    "We help deploy and maintain the system so your team can focus on operations.",
    "Run the system in your own environment and manage data and operations to suit your company.",
  ],
  form: {
    labels: {
      name: "Name",
      company: "Company",
      email: "Email",
      wechat: "WeChat ID",
      phone: "Phone (optional)",
      intent: "Interest",
      message: "Requirements (optional)",
    },
    group: "Provide an email address or WeChat ID",
    disabled: "Online requests are not available yet. Please check back later.",
    unavailable: "Currently unavailable",
    submit: "Send request",
    sending: "Sending…",
    success:
      "Your request has been received. We will contact you to arrange a demo or trial.",
    error: "Unable to send. Please retry. Your details have been retained.",
    rate: "Too many requests. Please try again later.",
    required: "Please complete this field.",
    invalid: "Please check this value.",
    long: "This value exceeds the length limit.",
    privacy:
      "Your details are sent through Formspree to the KustoCargo team to contact you and arrange a demo or trial.",
    noscript: "Enable JavaScript to submit an online request.",
  },
  footer: "Connect every step of your business.",
  backToTop: "Back to top",
} satisfies InterfaceContent;
