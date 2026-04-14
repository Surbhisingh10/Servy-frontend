import type { LucideIcon } from 'lucide-react';
import {
  Beer,
  BarChart3,
  Check,
  CreditCard,
  Coffee,
  Building2,
  Pizza,
  Package,
  Receipt,
  ShoppingCart,
  Sparkles,
  Store,
  UtensilsCrossed,
} from 'lucide-react';

export const marketingNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export const resourceNavLinks = [
  { href: '/resources/qr-ordering-playbook', label: 'QR Ordering Playbook' },
  { href: '/resources/repeat-customer-guide', label: 'Repeat Customer Guide' },
  { href: '/resources/centralize-online-orders', label: 'Centralize Online Orders' },
];

export const trustLogos: string[] = [];

export const socialLinks = [
  { href: 'https://www.linkedin.com/in/servy-world-26239b403?utm_source=share_via&utm_content=profile&utm_medium=member_ios', label: 'LinkedIn', icon: 'Linkedin' as const },
  { href: 'https://www.instagram.com/servyworld', label: 'Instagram', icon: 'Instagram' as const },
];

export type SupportedFormat = {
  label: string;
  tag: string;
  title: string;
  summary: string;
  bestFor: string[];
  platformFit: string[];
  note: string;
  icon: LucideIcon;
};

export const supportedFormats: SupportedFormat[] = [
  {
    label: 'Fine dine',
    tag: 'Full service',
    title: 'Fine dine',
    summary: 'Table service, premium guest experience, and staff-assisted ordering.',
    bestFor: ['QR table ordering', 'Waiter-led support', 'Guest CRM and repeat visits'],
    platformFit: ['Table-level order flow', 'Area and zone mapping', 'Customer notes'],
    note: 'If your outlet type is not listed, choose Other formats. We can still tailor the flow.',
    icon: UtensilsCrossed,
  },
  {
    label: 'QSR',
    tag: 'Fast moving',
    title: 'QSR',
    summary: 'Quick checkout, shorter menus, and clean peak-hour handling.',
    bestFor: ['Fast order capture', 'Counter billing', 'Rush-hour control'],
    platformFit: ['Simple POS flow', 'Order queue', 'Speed focused layout'],
    note: 'Built for service teams that need clarity at the counter.',
    icon: Receipt,
  },
  {
    label: 'Cafe',
    tag: 'Lifestyle',
    title: 'Cafe',
    summary: 'Coffee-first ordering with calm service and easy add-ons.',
    bestFor: ['Morning rush', 'Dine-in and takeaway', 'Repeat customer tracking'],
    platformFit: ['Lightweight menu flow', 'Guest history', 'Upsell prompts'],
    note: 'A clean fit for quieter service with steady repeat visits.',
    icon: Coffee,
  },
  {
    label: 'Food court',
    tag: 'Shared space',
    title: 'Food court',
    summary: 'Shared seating with clear order separation and outlet visibility.',
    bestFor: ['Multi-counter service', 'Pickup routing', 'Peak-hour coordination'],
    platformFit: ['Outlet-level tracking', 'Area-level routing', 'Order visibility'],
    note: 'Useful when multiple vendors share one busy customer area.',
    icon: Store,
  },
  {
    label: 'Cloud kitchen',
    tag: 'Delivery first',
    title: 'Cloud kitchen',
    summary: 'Delivery-first operations focused on throughput and clean tracking.',
    bestFor: ['Aggregator orders', 'Brand separation', 'Kitchen flow'],
    platformFit: ['Unified order queue', 'Kitchen screen', 'Delivery monitoring'],
    note: 'Made for teams that run on volume and fast fulfillment.',
    icon: Package,
  },
  {
    label: 'Bakery',
    tag: 'Fresh daily',
    title: 'Bakery',
    summary: 'Fresh-batch businesses with preorders, pickup, and repeat buyers.',
    bestFor: ['Morning pickup rush', 'Preorders', 'Daily specials'],
    platformFit: ['Pickup-friendly ordering', 'Customer groups', 'Day-part offers'],
    note: 'Works well for prepared items and simple advance ordering.',
    icon: Sparkles,
  },
  {
    label: 'Large chain',
    tag: 'Multi-location',
    title: 'Large chain',
    summary: 'Central control with outlet-level visibility and consistency.',
    bestFor: ['Central oversight', 'Multi-outlet reporting', 'Rollout control'],
    platformFit: ['Admin controls', 'Branch access', 'Outlet-zone management'],
    note: 'Best when you need one system across many locations.',
    icon: Building2,
  },
  {
    label: 'Pizzeria',
    tag: 'Pizza focused',
    title: 'Pizzeria',
    summary: 'Fast oven flow, simple modifiers, and delivery-friendly ordering.',
    bestFor: ['Custom pizza builds', 'Delivery dispatch', 'Quick table turns'],
    platformFit: ['Simple order builder', 'Kitchen prep flow', 'Pickup and delivery routing'],
    note: 'A good fit for crust, toppings, and high-volume night service.',
    icon: Pizza,
  },
  {
    label: 'Bar & brewery',
    tag: 'Drinks first',
    title: 'Bar & brewery',
    summary: 'Tabbed service, guest tabs, and smooth checks for drink-led operations.',
    bestFor: ['Running tabs', 'Happy hour flow', 'Taproom orders'],
    platformFit: ['Fast tab management', 'Table service', 'Promotions and upsells'],
    note: 'Useful for tasting rooms, taprooms, and late-evening service.',
    icon: Beer,
  },
  {
    label: 'Other formats',
    tag: 'Flexible',
    title: 'Other formats',
    summary: 'Different formats can still be supported with a tailored setup.',
    bestFor: ['Custom workflows', 'Specialty operations', 'Adapted onboarding'],
    platformFit: ['Flexible setup', 'Guided onboarding', 'Workflow customization'],
    note: 'If it is not listed, we can still shape the flow around it.',
    icon: Check,
  },
];

export type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const coreFeatures: FeatureItem[] = [
  {
    title: 'Billing / POS',
    description: 'Quick checkout, clean receipts, and less counter friction.',
    icon: CreditCard,
  },
  {
    title: 'Orders',
    description: 'One queue for dine-in, takeaway, and online orders.',
    icon: ShoppingCart,
  },
  {
    title: 'Inventory',
    description: 'Simple stock tracking for menu items and core ingredients.',
    icon: Package,
  },
  {
    title: 'Reports',
    description: 'Fast visibility into sales, items, and daily performance.',
    icon: BarChart3,
  },
];

export const allInOnePoints = [
  'One place for the front counter, the kitchen, and management.',
  'Less switching between tools during busy service hours.',
  'Cleaner handoffs with a shared view of what is happening now.',
];

export const benefits = ['Faster billing', 'Better control', 'Real-time insights'];

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: 'Who is this platform for?',
    answer: 'It fits restaurants, cafes, and small chains that want a simpler daily workflow.',
  },
  {
    question: 'Can I manage orders and billing together?',
    answer: 'Yes. Billing and order handling live in the same system.',
  },
  {
    question: 'Does it support basic inventory tracking?',
    answer: 'Yes. You can keep an eye on core stock, recipes, and ingredient usage.',
  },
  {
    question: 'How quickly can I get started?',
    answer: 'Most outlets go live in one onboarding session. We map your menu, train the team, and stay available for go-live day.',
  },
  {
    question: 'Is there a demo available?',
    answer: 'Yes. Use the demo page to request a guided walkthrough.',
  },
  {
    question: 'Is pricing and support clear up front?',
    answer: 'Yes. Pricing, support SLA, onboarding steps, and outlet-type coverage are all listed on this site before any sales conversation.',
  },
  {
    question: 'Does it support multi-outlet management?',
    answer: 'Yes. The platform is designed for single outlets, growing brands, and multi-location restaurant groups.',
  },
  {
    question: 'Can I manage customer reviews and feedback?',
    answer: 'Yes. Customer feedback and review signals are part of the CRM and reporting flow.',
  },
];

export type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '₹1,499',
    description: 'For single outlets getting organized.',
    features: ['Billing / POS', 'Orders', 'Basic reports', 'QR ordering'],
  },
  {
    name: 'Growth',
    price: '₹2,499',
    description: 'For teams that want more control.',
    features: ['Everything in Starter', 'Recipe inventory', 'CRM + reviews', 'Priority support'],
    featured: true,
  },
  {
    name: 'Scale',
    price: 'Custom',
    description: 'For multi-location operations.',
    features: ['Multiple outlets', 'Role control', 'Custom onboarding', 'Support SLA'],
  },
];

export const howItWorksSteps = [
  {
    step: '01',
    title: 'Set up the menu',
    description: 'Create items, pricing, and simple outlet settings.',
    icon: Receipt,
  },
  {
    step: '02',
    title: 'Take orders cleanly',
    description: 'Handle dine-in and takeaway orders in one shared flow.',
    icon: ShoppingCart,
  },
  {
    step: '03',
    title: 'Track what matters',
    description: 'See billing, stock, and reporting without switching tools.',
    icon: Check,
  },
];

export const demoHighlights = [
  'See the billing flow',
  'Review the order dashboard',
  'Explore reports and inventory',
  'Ask about rollout and support',
];

export const heroMetricCards = [
  { label: 'Daily orders', value: '128' },
  { label: 'Repeat guests', value: '31%' },
  { label: 'Prep time', value: '14 min' },
];

export const allInOneFeature = {
  title: 'All-in-one operations, without the clutter.',
  description:
    'A single interface keeps the restaurant team focused on service instead of switching between disconnected tools.',
  icon: Sparkles,
  accentPoints: ['Fewer screens', 'Faster decisions', 'Cleaner handoffs'],
};

export const finalCta = {
  title: 'Start managing your restaurant smarter.',
  description: 'Book a demo and see the workflow in a simple, calm interface.',
};

export const supportLogos = trustLogos;

export type IntegrationLogo = {
  name: string;
  src: string;
  alt: string;
  category: 'Payments' | 'Orders' | 'Accounting' | 'Support';
  note: string;
};

export type IntegrationGroup = {
  key: 'payments' | 'other';
  label: string;
  title: string;
  description: string;
  logos: IntegrationLogo[];
};

export const paymentIntegrationLogos: IntegrationLogo[] = [
  {
    name: 'UPI',
    src: '/images/UPI-Logo.png',
    alt: 'UPI logo',
    category: 'Payments',
    note: 'Fast scan-first checkout.',
  },
  {
    name: 'Razorpay',
    src: '/images/Razorpay-Logo.png',
    alt: 'Razorpay logo',
    category: 'Payments',
    note: 'Gateway support for cards and wallets.',
  },
  {
    name: 'Google Pay',
    src: '/images/Googlepay-Logo.png',
    alt: 'Google Pay logo',
    category: 'Payments',
    note: 'Trusted UPI flow for quick approvals.',
  },
  {
    name: 'PhonePe',
    src: '/images/Phonepe-Logo.png',
    alt: 'PhonePe logo',
    category: 'Payments',
    note: 'Instant payments at the counter.',
  },
  {
    name: 'BHIM',
    src: '/images/BHIM-Logo.png',
    alt: 'BHIM logo',
    category: 'Payments',
    note: 'Simple UPI handling for guests.',
  },
];

export const otherIntegrationLogos: IntegrationLogo[] = [
  {
    name: 'AWS',
    src: '/images/AWS-Logo.png',
    alt: 'AWS logo',
    category: 'Support',
    note: 'Reliable cloud infrastructure.',
  },
  {
    name: 'Google Cloud',
    src: '/images/Googlecloud-Logo.png',
    alt: 'Google Cloud logo',
    category: 'Support',
    note: 'Scalable hosting and services.',
  },
  {
    name: 'OpenAI',
    src: '/images/Open-ai-Logo.png',
    alt: 'OpenAI logo',
    category: 'Support',
    note: 'Smarter automation workflows.',
  },
  {
    name: 'Tally',
    src: '/images/Tally-Logo.jfif',
    alt: 'Tally logo',
    category: 'Accounting',
    note: 'Accounting handoff and bookkeeping.',
  },
  {
    name: 'Twilio',
    src: '/images/Twillio-Logo.png',
    alt: 'Twilio logo',
    category: 'Support',
    note: 'Alerts, messages, and notifications.',
  },
  {
    name: 'WhatsApp Business',
    src: '/images/whatsapp_business-Logo.png',
    alt: 'WhatsApp Business logo',
    category: 'Support',
    note: 'Guest updates and quick communication.',
  },
  {
    name: 'Google Analytics',
    src: '/images/Googleanalytics-Logo.png',
    alt: 'Google Analytics logo',
    category: 'Support',
    note: 'Track engagement and reach.',
  },
  {
    name: 'Dineout',
    src: '/images/Dineout-Log.jpg',
    alt: 'Dineout logo',
    category: 'Orders',
    note: 'Reservation and discovery flow.',
  },
  {
    name: 'Swiggy',
    src: '/images/Swiggy-Logo.png',
    alt: 'Swiggy logo',
    category: 'Orders',
    note: 'Aggregator orders in one queue.',
  },
  {
    name: 'Zomato',
    src: '/images/Zomato-Logo.png',
    alt: 'Zomato logo',
    category: 'Orders',
    note: 'One view for delivery flow.',
  },
  {
    name: 'Zoho Books',
    src: '/images/Zoho-Books-logo.png',
    alt: 'Zoho Books logo',
    category: 'Accounting',
    note: 'Cleaner reporting and handoff.',
  },
];

export const integrationGroups: IntegrationGroup[] = [
  {
    key: 'payments',
    label: 'Payment integration',
    title: 'Payments your team can trust.',
    description:
      'Show the payment methods restaurants use every day, with a clean layout that keeps checkout simple.',
    logos: paymentIntegrationLogos,
  },
  {
    key: 'other',
    label: 'Other integration',
    title: 'Everything around the core flow.',
    description:
      'Show the supporting tools that help operations, communication, reporting, and backend workflows.',
    logos: otherIntegrationLogos,
  },
];

export const demoFormOptions = [
  'Single outlet',
  'Multi-location',
  'Cafe or QSR',
];

export const pricingFaqItems = faqItems;

export const howItWorksBenefits = benefits;

export const featureDetailBullets = [
  'Billing and orders stay together.',
  'Stock changes stay easy to follow.',
  'Reports are quick to scan.',
];

export const featureDetailTitle = 'Four essentials, one calm dashboard.';

export const featureDetailDescription =
  'The product stays focused on what teams actually use every day: billing, orders, inventory, and reporting.';

export const marketingAccent = 'indigo';
