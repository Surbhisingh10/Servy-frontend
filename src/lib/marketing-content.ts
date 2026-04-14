import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  CreditCard,
  ClipboardList,
  LayoutDashboard,
  Megaphone,
  QrCode,
  ShieldCheck,
  Store,
  WalletCards,
  Bell,
  ShoppingCart,
  Package,
  FileText,
  Users,
  Building2,
  Workflow,
  Star,
} from 'lucide-react';

export const marketingNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
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
    title: 'QR Scan and Pay',
    description:
      'Turn every table into a self-serve ordering point with branded QR menus, QR payments, and e-bill receipts.',
    icon: QrCode,
  },
  {
    title: 'Unified Order Dashboard',
    description:
      'Handle dine-in, takeaway, and online aggregator orders from one screen without juggling devices.',
    icon: Workflow,
  },
  {
    title: 'Aggregator Control',
    description:
      'Bring Swiggy, Zomato, and Dineout-style orders into one queue with menu sync, timed availability, packaging charges, and stock-based visibility.',
    icon: ShoppingCart,
  },
  {
    title: 'Multi-outlet Management',
    description:
      'Keep branches, outlet-level menus, roles, and reporting aligned while letting every location run cleanly on its own.',
    icon: Building2,
  },
  {
    title: 'Recipe-based Inventory',
    description:
      'Track stock from recipe portions and ingredient usage so the kitchen, prep team, and central store stay in sync.',
    icon: Package,
  },
  {
    title: 'Customer CRM',
    description:
      'Track repeat guests, build segments, and keep customer history ready for special-day campaigns, loyalty points, and feedback follow-up.',
    icon: Users,
  },
  {
    title: 'Reviews and Feedback',
    description:
      'Collect guest feedback, surface review signals, and keep service issues visible for the team that needs to act on them.',
    icon: Star,
  },
  {
    title: 'Inventory Automation',
    description:
      'Track raw materials, deduct ingredients item-wise, and keep central kitchen flows aligned with live consumption.',
    icon: Package,
  },
  {
    title: 'Reporting and Reconciliation',
    description:
      'See day-end summaries, sales trends, staff actions, commissions, taxes, cancellations, and payout differences in one place.',
    icon: BarChart3,
  },
  {
    title: 'Add-on Marketplace',
    description:
      'Extend the platform with kiosk, waiter-calling, reservations, loyalty, SMS marketing, analytics, and support tools.',
    icon: Megaphone,
  },
  {
    title: 'Table and Zone Management',
    description:
      'Manage tables, areas, and outlet zones so dine-in service stays organized across busy floor layouts.',
    icon: LayoutDashboard,
  },
  {
    title: 'Trust and Onboarding',
    description:
      'Show transparent pricing, a clear support SLA, fast onboarding time, and coverage for the outlet types you serve.',
    icon: ShieldCheck,
  },
];

export type PlatformCapability = {
  label: string;
  tag: string;
  title: string;
  summary: string;
  bullets: string[];
  note: string;
  icon: LucideIcon;
};

export const platformCapabilities: PlatformCapability[] = [
  {
    label: 'Dashboard',
    tag: 'Command center',
    title: 'A dashboard that keeps the whole restaurant visible.',
    summary:
      'See orders, billing, payments, inventory, guests, and outlet activity in one calm view.',
    bullets: [
      'Live order queue and counter status',
      'Performance snapshots for managers',
      'Quick access to the busiest operations',
    ],
    note: 'Built for owners and operators who want a single daily control panel.',
    icon: LayoutDashboard,
  },
  {
    label: 'Order Status',
    tag: 'Live flow',
    title: 'Track every order from placed to ready.',
    summary:
      'Guests and staff can see what is pending, in progress, ready, or completed without guessing.',
    bullets: [
      'Clear order stages for dine-in and takeaway',
      'Kitchen-friendly status updates',
      'Less confusion during rush hours',
    ],
    note: 'Useful when every table and channel needs fast visibility.',
    icon: ClipboardList,
  },
  {
    label: 'QR Scan and Pay',
    tag: 'Self-serve',
    title: 'Let guests order, pay, and receive e-bills from the table.',
    bullets: [
      'QR menu ordering for tables and counters',
      'Scan-to-pay with instant digital receipts',
      'Cleaner handoff between guest and staff',
    ],
    summary:
      'Use a QR flow for ordering and checkout so service teams spend less time on repetitive capture.',
    note: 'Built for dine-in and takeaway teams that want less friction at the table.',
    icon: QrCode,
  },
  {
    label: 'Aggregator Control',
    tag: 'Channel control',
    title: 'Keep Swiggy, Zomato, and Dineout-style orders in one queue.',
    summary:
      'Sync menus, manage stock-based visibility, and keep channel-specific charges and timings aligned.',
    bullets: [
      'Menu sync across delivery channels',
      'Packaging charges and timed availability',
      'Fewer missed online order handoffs',
    ],
    note: 'Useful when delivery channels need to behave like one operating surface.',
    icon: Workflow,
  },
  {
    label: 'Recipe Inventory',
    tag: 'Stock control',
    title: 'Track ingredients from recipe portions to kitchen consumption.',
    summary:
      'Keep raw material counts, recipe usage, item-wise deductions, and central kitchen flows aligned with live consumption.',
    bullets: [
      'Ingredient-level tracking and recipe mapping',
      'Menu availability based on stock',
      'Central kitchen and outlet-level visibility',
    ],
    note: 'Designed for restaurants that want practical stock control, not spreadsheet chaos.',
    icon: Package,
  },
  {
    label: 'CRM & Reviews',
    tag: 'Guest data',
    title: 'Build profiles, loyalty, reviews, and better follow-up from real orders.',
    summary:
      'Keep customer profiles, purchase history, labels, loyalty points, special-day campaigns, feedback, and review signals in one place.',
    bullets: [
      'Customer history and segment labels',
      'Loyalty points and repeat-guest tracking',
      'Feedback collection, review signals, and follow-up prompts',
    ],
    note: 'Helps teams turn everyday orders into long-term customer relationships.',
    icon: Users,
  },
  {
    label: 'Reporting',
    tag: 'Insights',
    title: 'See sales, staff activity, and payout differences at a glance.',
    summary:
      'Track day-end summaries, sales trends, outlet performance, and reconciliation items in one dashboard.',
    bullets: [
      'Commission, tax, and cancellation reporting',
      'Staff actions and outlet comparisons',
      'Payout difference visibility',
    ],
    note: 'Built for operators who want faster decisions and fewer accounting surprises.',
    icon: BarChart3,
  },
  {
    label: 'Marketplace',
    tag: 'Add-ons',
    title: 'Extend the core platform with the tools your outlet needs.',
    summary:
      'Add kiosk, waiter-calling, reservations, loyalty, SMS marketing, analytics, and support tools as needed.',
    bullets: [
      'Modular add-ons instead of one rigid setup',
      'Grow the stack without changing the core flow',
      'Pick tools by outlet type and service model',
    ],
    note: 'Good for teams that want flexibility without a messy tool stack.',
    icon: Store,
  },
  {
    label: 'Multi-outlet Management',
    tag: 'Floor plan',
    title: 'Manage outlets, tables, areas, and zones with less chaos on the floor.',
    summary:
      'Organize branch-level operations, dining areas, sections, and service zones so teams can route orders clearly.',
    bullets: [
      'Table and area mapping',
      'Branch-level controls and visibility',
      'Better dine-in handoffs',
    ],
    note: 'Helpful for restaurants with multiple outlets or structured floor plans.',
    icon: Building2,
  },
  {
    label: 'Trust',
    tag: 'Onboarding',
    title: 'Make the buying decision easier with clearer support promises.',
    summary:
      'Show transparent pricing, support SLA, onboarding time, and outlet-type coverage on the site.',
    bullets: [
      'Clear pricing and rollout expectations',
      'Defined support commitments',
      'Coverage for multiple outlet formats',
    ],
    note: 'Trust content helps restaurants move from interest to action faster.',
    icon: ShieldCheck,
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

export type DashboardFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

export const dashboardFeatures: DashboardFeature[] = [
  {
    title: 'Billing & POS',
    description: 'Fast billing, QR pay, e-bills, and cleaner counter operations.',
    icon: FileText,
    accent: 'bg-primary-50 text-primary-700',
  },
  {
    title: 'Orders Dashboard',
    description: 'View dine-in, takeaway, and aggregator orders in one live queue.',
    icon: ShoppingCart,
    accent: 'bg-primary-50 text-primary-700',
  },
  {
    title: 'Recipe Inventory',
    description: 'Track raw materials, recipe portions, deductions, and menu availability.',
    icon: Package,
    accent: 'bg-highlight-50 text-highlight-700',
  },
  {
    title: 'CRM & Reviews',
    description: 'Track customer history, loyalty points, feedback, and review signals in one place.',
    icon: Users,
    accent: 'bg-primary-50 text-primary-700',
  },
  {
    title: 'Multi-outlet Control',
    description: 'Manage branches, outlet-level roles, and reporting without losing local flexibility.',
    icon: Building2,
    accent: 'bg-highlight-50 text-highlight-700',
  },
  {
    title: 'Reports & Analytics',
    description: 'See revenue, repeat customers, channel performance, and reconciliation gaps.',
    icon: BarChart3,
    accent: 'bg-highlight-50 text-highlight-700',
  },
  {
    title: 'Campaigns',
    description: 'Launch promotions, follow-ups, and special-day campaigns from the dashboard.',
    icon: Megaphone,
    accent: 'bg-highlight-50 text-highlight-700',
  },
  {
    title: 'QR Codes',
    description: 'Generate QR menus and table-level ordering access for each outlet zone.',
    icon: QrCode,
    accent: 'bg-primary-50 text-primary-700',
  },
  {
    title: 'Outlets & Staff',
    description: 'Manage branches, tables, areas, zones, roles, and access across locations.',
    icon: Building2,
    accent: 'bg-highlight-50 text-highlight-700',
  },
  {
    title: 'Notifications',
    description: 'Stay updated on orders, requests, low stock, and operational alerts in real time.',
    icon: Bell,
    accent: 'bg-primary-50 text-primary-700',
  },
  {
    title: 'Multi-location Control',
    description: 'Keep every restaurant location visible without losing local flexibility.',
    icon: LayoutDashboard,
    accent: 'bg-highlight-50 text-highlight-700',
  },
];

export type PaymentBenefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const paymentBenefits: PaymentBenefit[] = [
  {
    title: 'Faster checkout',
    description: 'Reduce payment friction with quick, scan-first checkout flows.',
    icon: CreditCard,
  },
  {
    title: 'Multi-mode support',
    description: 'Accept UPI, cards, wallets, and gateway-based online payments.',
    icon: WalletCards,
  },
  {
    title: 'Seamless settlement',
    description: 'Match payment activity with orders and keep finance workflows tidy.',
    icon: ShieldCheck,
  },
  {
    title: 'Actionable insights',
    description: 'See payment performance, settlement status, and channel trends at a glance.',
    icon: BarChart3,
  },
];

export const paymentAppLogos = [
  'UPI',
  'Razorpay',
  'Paytm',
  'PhonePe',
  'Google Pay',
  'BHIM',
];

export type PaymentIntegrationTool = {
  name: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  badge?: string;
};

export const paymentIntegrationTools: PaymentIntegrationTool[] = [
  {
    name: 'UPI',
    description: 'Fast scan-first payments for dine-in, takeaway, and counter service.',
    imageSrc: '/images/UPI-Logo.png',
    imageAlt: 'UPI payment app logo',
    badge: 'Payments',
  },
  {
    name: 'Razorpay',
    description: 'Gateway support for card, wallet, and online payment workflows.',
    imageSrc: '/images/Razorpay-Logo.png',
    imageAlt: 'Razorpay logo',
    badge: 'Gateway',
  },
  {
    name: 'Paytm',
    description: 'Familiar checkout option for customers already using mobile payments.',
    imageSrc: '/images/Paytm-Logo.png',
    imageAlt: 'Paytm logo',
    badge: 'Wallet',
  },
  {
    name: 'PhonePe',
    description: 'Popular UPI option that feels instant at high-volume outlets.',
    imageSrc: '/images/Phonepe-Logo.png',
    imageAlt: 'PhonePe logo',
    badge: 'UPI',
  },
  {
    name: 'Google Pay',
    description: 'Clean payment handoff for guests who prefer quick UPI approvals.',
    imageSrc: '/images/Googlepay-Logo.png',
    imageAlt: 'Google Pay logo',
    badge: 'UPI',
  },
  {
    name: 'BHIM',
    description: 'Reliable UPI support across branded restaurant payment flows.',
    imageSrc: '/images/BHIM-Logo.png',
    imageAlt: 'BHIM logo',
    badge: 'UPI',
  },
  
];

export const paymentAnalytics = [
  { label: 'Avg. confirmation time', value: '< 10 sec' },
  { label: 'UPI share', value: '68%' },
  { label: 'Settlement visibility', value: 'Realtime' },
  { label: 'Reconciliation errors', value: '-24%' },
];

export type SupportedOutletType = {
  name: string;
  shortDescription: string;
  useCases: string[];
  features: string[];
  tag: string;
  image?: string;
};

export const supportedOutletTypes: SupportedOutletType[] = [
  {
    name: 'Fine dine',
    shortDescription: 'Table service, premium guest experience, and staff-assisted ordering.',
    useCases: ['QR table ordering', 'Waiter-led support', 'Guest CRM and repeat visits'],
    features: ['Table-level order flow', 'Customer notes', 'Promotion targeting'],
    tag: 'Full service',
    image: '/images/fine-dining-restaurants.png',
  },
  {
    name: 'QSR',
    shortDescription: 'Fast-moving counters that need speed, consistency, and low-friction ordering.',
    useCases: ['Quick order capture', 'Rush-hour queue handling', 'Repeat customer tracking'],
    features: ['Fast checkout', 'Unified order board', 'Real-time kitchen updates'],
    tag: 'High velocity',
  },
  {
    name: 'Cafe',
    shortDescription: 'Coffee-first spaces that balance dine-in comfort with takeaway convenience.',
    useCases: ['Counter service', 'Loyalty offers', 'Morning and evening rush handling'],
    features: ['Simple menu setup', 'Customer history', 'Combo and upsell campaigns'],
    tag: 'Lifestyle',
  },
  {
    name: 'Food court',
    shortDescription: 'Shared seating environments that need clear ordering and outlet separation.',
    useCases: ['Multi-counter service', 'Fast pickup routing', 'Busy peak-hour coordination'],
    features: ['Outlet-level tracking', 'Channel separation', 'Order visibility'],
    tag: 'Shared space',
  },
  {
    name: 'Cloud kitchen',
    shortDescription: 'Delivery-first operations focused on throughput and clean operational tracking.',
    useCases: ['Delivery-first workflow', 'Multi-brand handling', 'Order source visibility'],
    features: ['Aggregator control', 'Kitchen queues', 'Brand-level reporting'],
    tag: 'Delivery first',
  },
  {
    name: 'Ice cream & desserts',
    shortDescription: 'Impulse-friendly dessert counters with seasonal demand and upsell potential.',
    useCases: ['Fast order capture', 'Seasonal promotions', 'Combo bundles'],
    features: ['Quick menu browsing', 'Seasonal campaign support', 'Popular item highlights'],
    tag: 'Sweet sales',
  },
  {
    name: 'Bakery',
    shortDescription: 'Fresh-batch businesses that need preorders, pickup planning, and repeat buyers.',
    useCases: ['Morning pickup rush', 'Preorders and takeaway', 'Regular customer retention'],
    features: ['Pickup-friendly ordering', 'Customer groups', 'Daily specials'],
    tag: 'Fresh daily',
    image: '/images/bakery.jpeg',
  },
  {
    name: 'Brewery',
    shortDescription: 'Craft beer and taproom operations with tab management, tasting flights, and event-driven service.',
    useCases: ['Running guest tabs', 'Tasting flight orders', 'Happy hour and event promos'],
    features: ['Tab management', 'Table service flow', 'Event campaigns'],
    tag: 'Craft & tap',
    image: '/images/Brewry.jpg',
  },
  {
    name: 'Bar & brewery',
    shortDescription: 'Drink-led experiences with table service, events, and engagement campaigns.',
    useCases: ['Table service', 'Event promos', 'VIP guest management'],
    features: ['Guest segmentation', 'Event campaigns', 'Table support'],
    tag: 'Evening crowd',
  },
  {
    name: 'Pizzeria',
    shortDescription: 'Structured order flows for custom toppings, combos, and takeaway timing.',
    useCases: ['Custom pizzas', 'Delivery and takeaway', 'Family combo orders'],
    features: ['Customization notes', 'Order grouping', 'Delivery timing visibility'],
    tag: 'Custom orders',
  },
  {
    name: 'Large chain',
    shortDescription: 'Multi-location brands that need centralized control with outlet-level flexibility.',
    useCases: ['Central oversight', 'Multi-outlet reporting', 'Consistent rollout'],
    features: ['Admin controls', 'Outlet-wise access', 'Scaled reporting'],
    tag: 'Multi-location',
    image: '/images/multioutlet.jpeg',
  },
  {
    name: 'Other formats',
    shortDescription: 'If your format is different, the system can still be adapted to your workflow.',
    useCases: ['Custom ordering flow', 'Specialized operations', 'Tailored onboarding'],
    features: ['Flexible setup', 'Guided onboarding', 'Workflow customization'],
    tag: 'Custom fit',
  },
];

export const platformStats = [
  { label: 'Average order visibility', value: '100%' },
  { label: 'Outlet groups managed', value: '12' },
  { label: 'Recipe mappings', value: '85' },
  { label: 'Launch time for a new outlet', value: '< 1 day' },
];

export const pricingPlans = [
  {
    name: 'Starter',
    price: '₹1,499',
    cadence: '/month',
    description: 'For single-outlet restaurants launching digital ordering and QR payments.',
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
    price: '₹2,499',
    cadence: '/month',
    description: 'For restaurants ready to grow repeat revenue, CRM, and reporting.',
    cta: 'Contact Sales',
    href: '/contact',
    featured: true,
    features: [
      'Everything in Starter',
      'Customer CRM and groups',
      'Promotions and campaigns',
      'Unified online order view',
      'Reconciliation reporting',
      'Priority onboarding',
    ],
  },
  {
    name: 'Scale',
    price: 'Custom',
    cadence: '',
    description: 'For multi-location brands, outlet zones, and custom workflows.',
    cta: 'Contact Sales',
    href: '/contact',
    featured: false,
    features: [
      'Everything in Growth',
      'Admin panel and subscriptions',
      'Multi-restaurant control',
      'Outlet-level support coverage',
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
    href: '/resources/qr-ordering-playbook',
    cta: 'Read the playbook',
    icon: BookOpen,
  },
  {
    title: 'Guide: Build a repeat-customer engine',
    description:
      'How restaurants can collect guest data at checkout and turn it into segments that drive return visits.',
    href: '/resources/repeat-customer-guide',
    cta: 'Read the guide',
    icon: Users,
  },
  {
    title: 'Checklist: Centralize online orders',
    description:
      'See how to bring Swiggy, Zomato, and Dineout into a single operational queue without extra hardware clutter.',
    href: '/resources/centralize-online-orders',
    cta: 'View checklist',
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
    body: 'No. Customer tracking, segmentation, loyalty, and campaign workflows are built into the platform.',
  },
  {
    title: 'Can I use this alongside Swiggy and Zomato?',
    body: 'Yes. The platform is designed to bring aggregator orders into one management screen with menu sync and timing controls.',
  },
  {
    title: 'How clear is pricing and support?',
    body: 'Plans are presented transparently, with support commitments and onboarding guidance spelled out so operators know what to expect.',
  },
  {
    title: 'Does it work for different outlet types?',
    body: 'Yes. The product is built to support fine dine, QSR, cafes, cloud kitchens, food courts, and other restaurant formats.',
  },
];
