import Link from 'next/link';
import MarketingContainer from './MarketingContainer';
import { marketingNavLinks, resourceNavLinks, socialLinks } from '@/lib/marketing-site-content';

// Inline SVGs for brand icons — lucide-react deprecated these in v0.3xx
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.264 5.632 5.9-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const SOCIAL_ICONS = { Twitter: XIcon, Linkedin: LinkedinIcon, Instagram: InstagramIcon, Youtube: YoutubeIcon } as const;

interface SocialIconLinkProps {
  icon: keyof typeof SOCIAL_ICONS;
  href: string;
  label: string;
}

function SocialIconLink({ icon, href, label }: SocialIconLinkProps) {
  const Icon = SOCIAL_ICONS[icon];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
    >
      <Icon size={16} />
    </a>
  );
}

export default function MarketingFooter() {
  return (
    <footer className="border-t border-emerald-900/8 bg-[rgba(255,252,247,0.82)] backdrop-blur">
      <MarketingContainer className="py-10 lg:py-12">
        <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(247,251,248,0.96)_100%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] ring-1 ring-emerald-900/8 sm:p-8">

          {/* Top row: brand + nav columns */}
          <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
            <div className="max-w-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#059669_0%,#0f766e_100%)] text-sm font-extrabold text-white shadow-[0_6px_16px_rgba(5,150,105,0.26)]">
                  S
                </div>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                  Servy
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A calm platform for billing, orders, inventory, and reporting.
              </p>
            </div>

            <div className="flex flex-wrap gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Platform</p>
                <div className="mt-3 flex flex-col gap-2">
                  {marketingNavLinks.slice(1).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-slate-600 transition hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Resources</p>
                <div className="mt-3 flex flex-col gap-2">
                  {resourceNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-slate-600 transition hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row: social icons + copyright */}
          <div className="mt-8 flex flex-col items-start gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <SocialIconLink
                  key={link.icon}
                  icon={link.icon}
                  href={link.href}
                  label={link.label}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Servy. All rights reserved.
              </p>
              <Link href="/privacy" className="text-xs text-slate-400 transition hover:text-slate-700">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-slate-400 transition hover:text-slate-700">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </MarketingContainer>
    </footer>
  );
}
