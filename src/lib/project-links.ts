export const PROJECT_LINKS = [
  { slug: "bls-project", label: "The CPR Project" },
  { slug: "research-discourse", label: "Research Discourse / Journal Club" },
] as const;

const GOOGLE_FORM_URL = "https://forms.gle/";

const FORM_URLS: Record<string, string> = {
  "bls-project":
    "https://docs.google.com/forms/d/e/1FAIpQLSfvBsCOakZttAD-ti6hj-Q04AWTCN3a43cGDB6lU5kFatJBjQ/viewform?usp=dialog",
};

export function formUrlFor(slug: string): string {
  return FORM_URLS[slug] ?? GOOGLE_FORM_URL;
}
