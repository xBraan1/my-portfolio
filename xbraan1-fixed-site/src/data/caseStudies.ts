export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  goal: string;
  hairType: string;
  services: string[];
  process: string;
  recommendations: string;
  aftercare: string;
  stylistId: string;
  beforeImage: string | null;
  afterImage: string;
  beforeImageAlt: string;
  afterImageAlt: string;
  isSample: boolean;
  sampleNote: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'cs1',
    slug: 'colour-correction-blonde',
    title: 'From Dark Box Dye to Honey Blonde',
    subtitle: 'A multi-session colour correction journey',
    goal: 'Client wanted to transition from dark box-dye brown to a warm honey blonde without compromising hair integrity.',
    hairType: 'Medium-density, previously colour-treated with box dye (level 3 dark brown)',
    services: ['colour-correction', 'colour-highlights', 'treatment-bond-building', 'treatment-deep-conditioning'],
    process: 'This transformation required three sessions over six weeks. Session one focused on lifting with a gentle lightener and bond builder. Session two added dimensional highlights to create depth. Session three refined the tone with a gloss and intensive treatment.',
    recommendations: 'We recommended spacing sessions to protect the hair, using bond-building treatments at home weekly, and scheduling gloss appointments every 4–6 weeks to maintain tone.',
    aftercare: 'Purple shampoo weekly, bond-building treatment weekly, heat protection always, sulfate-free products only.',
    stylistId: 'jordan-mitchell',
    beforeImage: null,
    afterImage: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80',
    beforeImageAlt: '',
    afterImageAlt: 'Final result: warm honey blonde with dimensional highlights',
    isSample: true,
    sampleNote: 'This is a sample case study layout. Before/after images and client details will be added when the business provides verified portfolio content with client consent.',
  },
  {
    id: 'cs2',
    slug: 'fade-transformation',
    title: 'Precision Mid Fade with Design',
    subtitle: 'Clean lines and creative detail work',
    goal: 'Client wanted a sharp mid skin fade with a custom geometric design on the side, clean line-up and styled textured top.',
    hairType: 'Type 4 hair, medium density, short-to-medium length on top',
    services: ['fade', 'design-lines', 'line-up'],
    process: 'Started with clipper work to establish the fade gradient from skin to a #2 on top. The design was mapped with a pencil before being executed with a detail trimmer. Finished with a precision line-up and styled with matte texture paste.',
    recommendations: 'Return every 2–3 weeks for fade maintenance. The design can be touched up between full haircuts.',
    aftercare: 'Apply moisturiser to faded areas daily. Avoid sleeping on rough surfaces to protect the design.',
    stylistId: 'alex-rivera',
    beforeImage: null,
    afterImage: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=800&q=80',
    beforeImageAlt: '',
    afterImageAlt: 'Completed mid skin fade with geometric design',
    isSample: true,
    sampleNote: 'This is a sample case study layout. Before/after images and client details will be added when the business provides verified portfolio content with client consent.',
  },
  {
    id: 'cs3',
    slug: 'bridal-styling-package',
    title: 'Bridal Party Styling — Garden Wedding',
    subtitle: 'Cohesive looks for a party of six',
    goal: 'Create individualised but cohesive bridal party hairstyles for an outdoor garden wedding with a romantic, natural aesthetic.',
    hairType: 'Mixed textures across the party — straight, wavy and curly hair types',
    services: ['formal-styling', 'blowdry-style'],
    process: 'A group trial was held 3 weeks before the wedding. Each member received an individualised look that complemented their hair type, dress neckline and personal preference while maintaining a unified aesthetic. On the day, styling began at 8am for a 1pm ceremony.',
    recommendations: 'We recommend a trial for every bridal client. For parties, a group trial ensures everyone is happy and timing is confirmed.',
    aftercare: 'Touch-up kits were provided. Hair was designed to hold through the ceremony and reception with minimal intervention.',
    stylistId: 'jordan-mitchell',
    beforeImage: null,
    afterImage: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80',
    beforeImageAlt: '',
    afterImageAlt: 'Bridal party with coordinated romantic updo styles',
    isSample: true,
    sampleNote: 'This is a sample case study layout. Details and images will be added when the business provides verified portfolio content with client consent.',
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(cs => cs.slug === slug);
}
