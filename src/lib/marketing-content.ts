import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BellRing,
  BookOpen,
  Megaphone,
  QrCode,
  ShieldCheck,
  Store,
  TrendingUp,
  Users,
  Workflow,
} from 'lucide-react';

export const marketingNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/demo', label: 'Demo' },
  { href: '/contact', label: 'Contact' },
];

export const trustLogos = ['UrbanFork', 'Mosaic Cafe', 'TableCraft', 'NorthPlate', 'Mint Dining'];

export type MarketingFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const featureHighlights: MarketingFeature[] = [
  {
    title: 'QR Menu Ordering',
    description:
      'Turn every table into a self-serve ordering point with branded QR menus and real-time order capture.',
    icon: QrCode,
  },
  {
    title: 'Unified Order Dashboard',
    description:
      'Handle dine-in, takeaway, and online aggregator orders from one screen without juggling devices.',
    icon: Workflow,
  },
  {
    title: 'Customer CRM',
    description:
      'Track repeat guests, build segments, and keep customer history ready for better service and targeted growth.',
    icon: Users,
  },
  {
    title: 'Automated Promotions',
    description:
      'Launch campaigns to VIPs, regulars, inactive guests, or saved customer groups in a few clicks.',
    icon: Megaphone,
  },
  {
    title: 'Analytics and Insights',
    description:
      'See top-selling items, order trends, repeat customer metrics, and platform performance in one dashboard.',
    icon: BarChart3,
  },
  {
    title: 'Multi-Location Ready',
    description:
      'Run one restaurant or a growing portfolio with admin controls, subscriptions, and restaurant-level visibility.',
    icon: Store,
  },
];

export type CoreFeature = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

export const coreFeatures: CoreFeature[] = [
  {
    eyebrow: 'Ordering',
    title: 'QR Menu Ordering',
    description:
      'Restaurants upload menus once and instantly turn dine-in tables into fast, no-app ordering experiences.',
    bullets: ['Digital QR menus', 'Live availability updates', 'Dine-in and takeaway support'],
  },
  {
    eyebrow: 'Operations',
    title: 'Unified Order Dashboard',
    description:
      'See direct orders alongside Swiggy, Zomato, and Dineout in one structured workflow.',
    bullets: ['Single-screen order queue', 'Accept and reject actions', 'Realtime order movement'],
  },
  {
    eyebrow: 'CRM',
    title: 'Customer CRM',
    description:
      'Capture guest identity on checkout, track repeat visits, and group customers for retention plays.',
    bullets: ['Repeat-customer tracking', 'Customer groups', 'Lifetime spend and visit history'],
  },
  {
    eyebrow: 'Growth',
    title: 'Automated Promotions',
    description:
      'Build campaigns for VIPs, inactive guests, or custom groups and manage outreach from the dashboard.',
    bullets: ['Audience segmentation', 'Campaign scheduling', 'Delivery tracking'],
  },
  {
    eyebrow: 'Integrations',
    title: 'Online Ordering Integrations',
    description:
      'Bring aggregator orders into your operations flow instead of splitting teams across multiple tablets.',
    bullets: ['Swiggy support', 'Zomato support', 'Dineout support'],
  },
  {
    eyebrow: 'Visibility',
    title: 'Analytics and Insights',
    description:
      'Understand revenue, order volume, repeat behavior, and channel performance without external tools.',
    bullets: ['Sales snapshots', 'Customer trends', 'Performance monitoring'],
  },
];

export type FeatureShowcaseItem = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  stats: Array<{ label: string; value: string }>;
  previewTitle: string;
  previewBody: string;
  previewPoints: string[];
};

export const featureShowcases: FeatureShowcaseItem[] = [
  {
    eyebrow: 'Fine-Dine Service',
    title: 'Keep table service, takeaway, and kitchen updates in one flow.',
    description:
      'Restaurants do not need separate screens for waiter-led service, customer QR orders, and takeaway requests. The platform keeps every ticket inside one live board.',
    bullets: [
      'Accept and reject orders from one unified queue',
      'See order source, customer details, and table status instantly',
      'Move teams from manual coordination to structured service flow',
    ],
    stats: [
      { label: 'Active tables', value: '28' },
      { label: 'Open orders', value: '41' },
      { label: 'Avg prep time', value: '14 min' },
    ],
    previewTitle: 'Service board',
    previewBody:
      'A single view for dine-in, takeaway, and online channels keeps the floor team aligned with the kitchen.',
    previewPoints: ['Direct QR', 'Swiggy', 'Zomato', 'Takeaway'],
  },
  {
    eyebrow: 'Customer Retention',
    title: 'Turn order capture into a CRM that restaurants can actually use.',
    description:
      'Customer name and phone details collected during checkout automatically build a reusable guest base for repeat marketing and segmentation.',
    bullets: [
      'Track visits, spend, and last order date',
      'Create lists like VIPs, inactive guests, and office lunch groups',
      'Give staff better context before the next visit',
    ],
    stats: [
      { label: 'Repeat rate', value: '42%' },
      { label: 'VIP guests', value: '126' },
      { label: 'Last 30 days', value: '+18%' },
    ],
    previewTitle: 'Guest profiles',
    previewBody:
      'The CRM is connected to real orders, so operators can act on actual visit history instead of spreadsheet exports.',
    previewPoints: ['Visit history', 'Customer groups', 'Lifetime spend', 'Campaign eligibility'],
  },
  {
    eyebrow: 'Promotion Engine',
    title: 'Launch campaigns without exporting customers to another tool.',
    description:
      'Operators can build lists, write a campaign, and trigger outreach from the same dashboard that runs daily service.',
    bullets: [
      'Target VIPs, inactive guests, or custom customer groups',
      'Personalize messages with customer context',
      'Review send counts and campaign delivery summaries',
    ],
    stats: [
      { label: 'Audience match', value: '126 guests' },
      { label: 'Open rate', value: '92%' },
      { label: 'Conversions', value: '31' },
    ],
    previewTitle: 'Campaign composer',
    previewBody:
      'Marketing can move faster because the customer list, message composer, and delivery tracking live together.',
    previewPoints: ['Saved audiences', 'Launch now', 'Delivery summary', 'Repeat automation'],
  },
  {
    eyebrow: 'Aggregator Control',
    title: 'Bring Swiggy, Zomato, and Dineout into one operational layer.',
    description:
      'Instead of splitting attention across multiple devices, outlet teams can respond to external orders from the same order board as direct business.',
    bullets: [
      'Review all order sources on one screen',
      'Accept and reject aggregator orders from the dashboard',
      'Reduce missed handoffs between online and in-store teams',
    ],
    stats: [
      { label: 'Channel mix', value: '4 sources' },
      { label: 'Missed orders', value: '-26%' },
      { label: 'Manager view', value: 'Realtime' },
    ],
    previewTitle: 'Unified channels',
    previewBody:
      'Operations stay cleaner when external integrations feed one queue instead of interrupting the service desk.',
    previewPoints: ['One queue', 'Realtime updates', 'Source visibility', 'Faster response'],
  },
];

export const benefits = [
  'Reduce staff dependency for order taking',
  'Increase repeat visits with customer tracking',
  'Run promotions without external CRM tools',
  'Unify direct and aggregator orders',
];

export const platformStats = [
  { label: 'Average order visibility', value: '100%' },
  { label: 'Service channels unified', value: '4' },
  { label: 'Repeat guest identification', value: '42%' },
  { label: 'Launch time for a new outlet', value: '< 1 day' },
];

export const proofPoints = [
  {
    title: 'Built for service speed',
    description:
      'Operators see cleaner order flow, faster handoffs, and less confusion between direct and online channels.',
    icon: BellRing,
  },
  {
    title: 'Designed for repeat business',
    description:
      'The platform captures customer identity at checkout so restaurants can market to real guests later.',
    icon: TrendingUp,
  },
  {
    title: 'Reliable for daily operations',
    description:
      'Menus, orders, CRM, campaigns, and admin controls stay connected in one operating system.',
    icon: ShieldCheck,
  },
];

export const pricingPlans = [
  {
    name: 'Starter',
    price: 'Rs 2,499',
    cadence: '/month',
    description: 'For single-outlet restaurants launching digital ordering.',
    cta: 'Start Free Trial',
    href: '/auth/register',
    featured: false,
    features: [
      'QR-based ordering',
      'Dine-in and takeaway orders',
      'Basic analytics dashboard',
      'Menu management',
    ],
  },
  {
    name: 'Growth',
    price: 'Rs 5,999',
    cadence: '/month',
    description: 'For restaurants ready to grow repeat revenue and automate outreach.',
    cta: 'Book Demo',
    href: '/demo',
    featured: true,
    features: [
      'Everything in Starter',
      'Customer CRM and groups',
      'Promotions and campaigns',
      'Unified online order view',
      'Priority onboarding',
    ],
  },
  {
    name: 'Scale',
    price: 'Custom',
    cadence: '',
    description: 'For multi-location brands and operators with custom workflows.',
    cta: 'Contact Sales',
    href: '/contact',
    featured: false,
    features: [
      'Everything in Growth',
      'Admin panel and subscriptions',
      'Multi-restaurant control',
      'Custom onboarding support',
      'Enterprise reporting',
    ],
  },
];

export const comparisonRows = [
  {
    label: 'QR Menu Ordering',
    values: ['Yes', 'Yes', 'Yes'],
  },
  {
    label: 'Unified Order Management',
    values: ['Basic', 'Advanced', 'Advanced'],
  },
  {
    label: 'Customer CRM',
    values: ['No', 'Yes', 'Yes'],
  },
  {
    label: 'Campaign Automation',
    values: ['No', 'Yes', 'Yes'],
  },
  {
    label: 'Admin Controls',
    values: ['No', 'No', 'Yes'],
  },
];

export const testimonials = [
  {
    quote:
      'We moved direct orders, aggregator orders, and retention campaigns into one system. The team finally stopped chasing updates across devices.',
    name: 'Aarav Mehta',
    role: 'Founder',
    company: 'Mint Dining',
  },
  {
    quote:
      'The CRM piece is what made the difference for us. We are not just taking orders faster, we are actually reactivating guests now.',
    name: 'Sana Kapoor',
    role: 'Operations Head',
    company: 'UrbanFork',
  },
  {
    quote:
      'For outlet managers, the unified order board is the biggest win. It gives us one command center during peak service.',
    name: 'Rohit Desai',
    role: 'Regional Manager',
    company: 'NorthPlate',
  },
];

export const resourceCards = [
  {
    title: 'Playbook: Launch QR ordering in one day',
    description:
      'A practical checklist for menu upload, table QR setup, staff training, and go-live preparation.',
    href: '/demo',
    cta: 'Request walkthrough',
    icon: BookOpen,
  },
  {
    title: 'Guide: Build a repeat-customer engine',
    description:
      'How restaurants can collect guest data at checkout and turn it into segments that drive return visits.',
    href: '/features',
    cta: 'Explore CRM',
    icon: Users,
  },
  {
    title: 'Checklist: Centralize online orders',
    description:
      'See how to bring Swiggy, Zomato, and Dineout into a single operational queue without extra hardware clutter.',
    href: '/how-it-works',
    cta: 'See workflow',
    icon: Workflow,
  },
];

export const faqs = [
  {
    title: 'Who is this platform for?',
    body: 'Independent restaurants, cafes, cloud kitchens, and growing food brands that want cleaner operations and stronger repeat business.',
  },
  {
    title: 'Do I need separate tools for CRM or campaigns?',
    body: 'No. Customer tracking, segmentation, and campaign workflows are built into the platform.',
  },
  {
    title: 'Can I use this alongside Swiggy and Zomato?',
    body: 'Yes. The platform is designed to bring aggregator orders into one management screen.',
  },
];
