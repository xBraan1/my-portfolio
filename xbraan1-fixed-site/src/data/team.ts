export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  speciality: string[];
  bio: string;
  experience: string;
  image: string;
  imageAlt: string;
  imageSource: string;
  imageLicense: string;
  services: string[];
  available: boolean;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'jordan-mitchell',
    name: 'Jordan Mitchell',
    slug: 'jordan-mitchell',
    role: 'Senior Stylist & Salon Manager',
    speciality: ['Colour Correction', 'Balayage', 'Bridal Styling', 'Precision Cuts'],
    bio: 'Jordan brings over 12 years of experience in precision cutting and advanced colour techniques. With a specialisation in balayage and colour correction, Jordan is known for creating natural-looking dimension and transformative colour results.',
    experience: '12 years',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80',
    imageAlt: 'Portrait of Jordan Mitchell, senior stylist',
    imageSource: 'Unsplash',
    imageLicense: 'Unsplash License — placeholder, awaiting real team photo',
    services: ['colour-colouring', 'colour-balayage', 'colour-correction', 'formal-styling', 'womens-cut'],
    available: true,
  },
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    slug: 'alex-rivera',
    role: 'Master Barber',
    speciality: ['Fades', 'Designs', 'Straight-Razor Shaves', 'Beard Sculpting'],
    bio: 'Alex is a master barber with 10 years of experience in precision fading, creative hair designs and traditional straight-razor shaving. Known for meticulous attention to detail and a calm, focused approach.',
    experience: '10 years',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80',
    imageAlt: 'Portrait of Alex Rivera, master barber',
    imageSource: 'Unsplash',
    imageLicense: 'Unsplash License — placeholder, awaiting real team photo',
    services: ['fade', 'mens-cut', 'beard-trim', 'hot-towel-shave', 'design-lines', 'line-up'],
    available: true,
  },
  {
    id: 'sam-okafor',
    name: 'Sam Okafor',
    slug: 'sam-okafor',
    role: 'Natural Hair & Braiding Specialist',
    speciality: ['Braids', 'Locs', 'Natural Hair', 'Sew-Ins', 'Silk Press'],
    bio: 'Sam specialises in natural hair care, protective styling and braiding. With expertise in all hair textures, Sam creates beautiful knotless braids, loc maintenance and silk presses while prioritising hair health.',
    experience: '8 years',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
    imageAlt: 'Portrait of Sam Okafor, natural hair specialist',
    imageSource: 'Unsplash',
    imageLicense: 'Unsplash License — placeholder, awaiting real team photo',
    services: ['braids', 'locs', 'natural-hair-styling', 'silk-press', 'sew-in-weave', 'wig-installation'],
    available: true,
  },
  {
    id: 'casey-thompson',
    name: 'Casey Thompson',
    slug: 'casey-thompson',
    role: 'Colourist & Stylist',
    speciality: ['Highlights', 'Vivid Colour', 'Keratin', 'Blow-Dry Styling'],
    bio: 'Casey is a creative colourist who loves working with both classic and fashion-forward colour. From subtle highlights to vivid fashion colours, Casey brings artistry and technical precision to every appointment.',
    experience: '6 years',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    imageAlt: 'Portrait of Casey Thompson, colourist',
    imageSource: 'Unsplash',
    imageLicense: 'Unsplash License — placeholder, awaiting real team photo',
    services: ['colour-highlights', 'colour-colouring', 'keratin-smoothing', 'blowdry-style', 'treatment-bond-building'],
    available: true,
  },
  {
    id: 'devon-wright',
    name: 'Devon Wright',
    slug: 'devon-wright',
    role: 'Barber & Stylist',
    speciality: ['Classic Cuts', 'Afro Shaping', 'Tapers', 'Children\'s Cuts'],
    bio: 'Devon combines classic barbering technique with modern style. Specialising in afro shaping, precision tapers and children\'s cuts, Devon creates a welcoming, patient environment for clients of all ages.',
    experience: '7 years',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    imageAlt: 'Portrait of Devon Wright, barber and stylist',
    imageSource: 'Unsplash',
    imageLicense: 'Unsplash License — placeholder, awaiting real team photo',
    services: ['mens-cut', 'afro-cut', 'fade', 'line-up', 'childrens-cut', 'cut-beard-combo'],
    available: true,
  },
  {
    id: 'mia-chen',
    name: 'Mia Chen',
    slug: 'mia-chen',
    role: 'Stylist & Treatment Specialist',
    speciality: ['Scalp Care', 'Deep Conditioning', 'Bridal', 'Formal Styling'],
    bio: 'Mia is passionate about hair health and specialises in scalp treatments, deep conditioning and restorative services. She also creates stunning bridal and formal updos with a keen eye for detail.',
    experience: '5 years',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
    imageAlt: 'Portrait of Mia Chen, stylist and treatment specialist',
    imageSource: 'Unsplash',
    imageLicense: 'Unsplash License — placeholder, awaiting real team photo',
    services: ['treatment-scalp', 'treatment-deep-conditioning', 'formal-styling', 'blowdry-style', 'womens-cut'],
    available: true,
  },
];

export function getTeamMemberBySlug(slug: string): TeamMember | undefined {
  return teamMembers.find(m => m.slug === slug);
}
