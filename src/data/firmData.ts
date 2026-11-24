export interface SpotlightPartner {
  id: string;
  monogram: string;
  name: string;
  role: string;
  tenure: string;
  photoUrl: string;
}

export interface CoreValue {
  number: string;
  name: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  name: string;
  scope: string;
}

export interface PartnerProfile {
  id: string;
  monogram: string;
  name: string;
  role: string;
  tenure: string;
  practice: string;
  photoUrl: string;
  offsetClass: string;
}

export interface StoryMilestone {
  id: string;
  yearLabel: string;
  displayYear: string;
  lead: string;
}

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Partners', href: '#partners' },
  { label: 'Story', href: '#story' },
  { label: 'Contact', href: '#contact' },
] as const;

export const MANIFESTO_LINES = [
  'We enjoy the numbers,',
  'adore the detail, deadlines motivate us',
  'and change inspires us.',
  'Four partners. Forty-three years. One standard.',
] as const;

export const SPOTLIGHT_PARTNERS: readonly SpotlightPartner[] = [
  {
    id: 'kcp',
    monogram: 'KCP',
    name: 'CA (DR.) K. C. PARWAL',
    role: 'FOUNDER & SENIOR PARTNER',
    tenure: '40+ YEARS',
    photoUrl: 'https://www.parwalandassociates.com/KCParwalImg.png',
  },
  {
    id: 'bm',
    monogram: 'BM',
    name: 'BHUPESH MATHUR',
    role: 'SENIOR PARTNER',
    tenure: '24+ YEARS',
    photoUrl: 'https://www.parwalandassociates.com/BhupeshMathur.png',
  },
  {
    id: 'ms',
    monogram: 'MS',
    name: 'MAHESH SAINI',
    role: 'PARTNER',
    tenure: '10+ YEARS',
    photoUrl: 'https://www.parwalandassociates.com/MaheshSainiImg.png',
  },
  {
    id: 'ks',
    monogram: 'KS',
    name: 'KRISHAN K. SHARMA',
    role: 'PARTNER',
    tenure: '6+ YEARS',
    photoUrl: 'https://www.parwalandassociates.com/KrishanSharmaImg.png',
  },
];

export const ABOUT_STATS = [
  {
    id: 'years',
    target: 43,
    caption: 'years in practice',
    details: [
      'Founded 1983 as K. C. Parwal & Co.',
      'Renamed Parwal & Associates in 2003.',
    ],
  },
  {
    id: 'partners',
    target: 4,
    caption: 'partners',
    details: ['K. C. Parwal · Bhupesh Mathur · Mahesh Saini · Krishan K. Sharma'],
  },
  {
    id: 'practices',
    target: 6,
    caption: 'practices',
    details: [
      'Auditing · Direct Taxation · Indirect Taxation · Management Consultancy & CFO · Outsourcing & Back Office · Corporate Matters',
    ],
  },
] as const;

export const ABOUT_STORY_LINES = [
  'Founded in 1983 by CA (Dr.) Kailash Chandra Parwal as K. C. Parwal & Co.',
  'Renamed Parwal & Associates in 2003, to reflect the collaborative nature of the growing firm.',
] as const;

export const CORE_VALUES: readonly CoreValue[] = [
  {
    number: '01',
    name: 'LEADERSHIP',
    description: 'The courage to shape a better future.',
  },
  {
    number: '02',
    name: 'COLLABORATION',
    description: 'Leveraging collective strengths.',
  },
  {
    number: '03',
    name: 'INTEGRITY',
    description: 'Being real, fair, and accountable.',
  },
  {
    number: '04',
    name: 'PASSION',
    description: 'Committed in heart and mind.',
  },
  {
    number: '05',
    name: 'QUALITY',
    description: 'What we do, we do well.',
  },
];

export const SERVICES_LIST: readonly ServiceItem[] = [
  {
    id: 'auditing',
    number: '01',
    name: 'AUDITING',
    scope:
      'Statutory, internal, tax, bank, GST and forensic audits, IND AS/IFRS support and due diligence.',
  },
  {
    id: 'direct-taxation',
    number: '02',
    name: 'DIRECT TAXATION',
    scope:
      'Representations before the Assessing Officer, Appellate Authorities and ITAT; tax planning, ITR/TDS filing, international tax and NRI taxation.',
  },
  {
    id: 'indirect-taxation',
    number: '03',
    name: 'INDIRECT TAXATION',
    scope:
      'GST registration, returns, refunds and scrutiny; representations before GST authorities.',
  },
  {
    id: 'management-consultancy',
    number: '04',
    name: 'MANAGEMENT CONSULTANCY & CFO',
    scope:
      'Virtual CFO, MIS design, risk advisory, business process improvement and valuation support.',
  },
  {
    id: 'outsourcing',
    number: '05',
    name: 'OUTSOURCING & BACK OFFICE',
    scope:
      'Accounting and bookkeeping, payroll, regulatory filings and secretarial support.',
  },
  {
    id: 'corporate-matters',
    number: '06',
    name: 'CORPORATE MATTERS',
    scope:
      'Incorporation, LLPs, secretarial and ROC compliance, M&A support, IPO-readiness and trademark advisory.',
  },
];

export const PARTNER_PROFILES: readonly PartnerProfile[] = [
  {
    id: 'kcp',
    monogram: 'KCP',
    name: 'CA (DR.) K. C. PARWAL',
    role: 'Founder & Senior Partner',
    tenure: '40+ years',
    practice: 'Cooperative sector and corporate law (ex-MD of a cooperative bank).',
    photoUrl: 'https://www.parwalandassociates.com/KCParwalImg.png',
    offsetClass: 'lg:mt-0 lg:ml-0',
  },
  {
    id: 'bm',
    monogram: 'BM',
    name: 'FCA BHUPESH MATHUR',
    role: 'Senior Partner',
    tenure: '24+ years',
    practice: 'With the firm since 2002; direct tax and investment advisory.',
    photoUrl: 'https://www.parwalandassociates.com/BhupeshMathur.png',
    offsetClass: 'lg:mt-9 lg:ml-4',
  },
  {
    id: 'ms',
    monogram: 'MS',
    name: 'CA MAHESH SAINI',
    role: 'Partner',
    tenure: '10+ years',
    practice: 'Since 2015; statutory, tax, internal and bank audits, company law.',
    photoUrl: 'https://www.parwalandassociates.com/MaheshSainiImg.png',
    offsetClass: 'lg:mt-2 lg:ml-5',
  },
  {
    id: 'ks',
    monogram: 'KS',
    name: 'CA KRISHAN K. SHARMA',
    role: 'Partner',
    tenure: '6+ years',
    practice:
      'Audit, taxation and regulatory advisory; real estate, manufacturing, IT, healthcare, aviation; FCA, M.Com, DISA, FAFD, UGC NET.',
    photoUrl: 'https://www.parwalandassociates.com/KrishanSharmaImg.png',
    offsetClass: 'lg:mt-10 lg:ml-2',
  },
];

export const STORY_MILESTONES: readonly StoryMilestone[] = [
  {
    id: '1983',
    yearLabel: '1983',
    displayYear: '1983',
    lead: 'K. C. Parwal & Co. is founded in Jaipur by CA (Dr.) Kailash Chandra Parwal.',
  },
  {
    id: '2003',
    yearLabel: '2003',
    displayYear: '2003',
    lead: 'Renamed Parwal & Associates, to reflect the collaborative nature of the growing firm.',
  },
  {
    id: 'today',
    yearLabel: 'TODAY',
    displayYear: 'TODAY',
    lead: 'Four partners, six practices, forty-three years of trust.',
  },
];

export const CONTACT_INFO = {
  heading: 'Start a conversation.',
  addressLabel: 'FIND US',
  addressValue: 'D-54, Siddhi Vinayak, Ashok Marg, C-Scheme, Jaipur-302 001',
  phoneLabel: 'CALL US',
  phoneValue: '+91 141 4006702',
  phoneHours: 'Mon–Sat, 10:00 AM–6:00 PM',
  phoneHref: 'tel:+911414006702',
  emailLabel: 'EMAIL US',
  emailValue: 'parwalandassociates@gmail.com',
  emailHref: 'mailto:parwalandassociates@gmail.com',
  ctaLabel: '[ SEND MAIL ↗]',
} as const;

export const FOOTER_META = {
  copyright: 'Parwal & Associates — Chartered Accountants © 2026 All Rights Reserved',
  icaiDisclaimer:
    'Disclaimer: As per the guidelines of the Institute of Chartered Accountants of India (ICAI), Chartered Accountants are not permitted to solicit work or advertise. This preview is strictly for informational purposes and does not constitute solicitation, invitation, or professional advice.',
  credit: 'Preview — built for Parwal & Associates by Divyansh Khandal',
} as const;
