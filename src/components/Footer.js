import Link from 'next/link'

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Attractions', href: '/attractions' },
      { label: 'Itinerary', href: '/itinerary' },
      { label: 'Home', href: '/' },
    ],
  },
  {
    title: 'Cultural',
    links: [
      { label: 'Food', href: '/cultural/food' },
      { label: 'Language', href: '/cultural/language' },
      { label: 'Manners', href: '/cultural/manners' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Login', href: '/login' },
      { label: 'Register', href: '/register' },
      { label: 'Reset password', href: '/reset-password' },
    ],
  },
]

const socials = [
  {
    name: 'X',
    href: 'https://x.com',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8zm6.246-10.135a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8z',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10 md:py-14 grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div className="col-span-3 sm:col-span-1">
          <Link href="/" className="inline-block font-display text-xl font-bold text-red">
            ChinaScape <span className="ml-1 text-xs font-body font-normal text-white/40">中国旅游</span>
          </Link>
          <p className="mt-4 text-sm text-white/55 leading-relaxed max-w-[280px]">
            Plan your perfect journey through China — iconic attractions, cultural guides, and day-by-day itineraries.
          </p>
        </div>

        {/* Link columns */}
        {columns.map(col => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">{col.title}</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-2.5">
              {col.links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-red transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">© {year} ChinaScape · Built for curious travelers</p>
          <div className="flex items-center gap-3">
            {socials.map(s => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-red hover:text-white transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
