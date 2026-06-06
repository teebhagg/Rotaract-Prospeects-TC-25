import Link from 'next/link'
import {getSiteSettings} from '@/sanity/queries/settings'
import {getBlogPosts} from '@/sanity/queries/blog'
import {Instagram, Linkedin, ArrowUpRight} from 'lucide-react'
import {FaTiktok, FaFacebook, FaXTwitter, FaYoutube} from 'react-icons/fa6'

export async function Footer() {
  const settings = await getSiteSettings()
  const recentPosts = await getBlogPosts().then((posts) => posts.slice(0, 3))

  return (
    <footer className="relative bg-charcoal-900 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer area */}
        <div className="py-16 md:py-24">
          {/* Brand statement - large, bold */}
          <div className="mb-16 md:mb-24">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-balance max-w-4xl">
              {settings?.siteTitle || 'Rotaract TC-25'}
            </h2>
            <p className="mt-6 text-lg md:text-xl text-white/50 max-w-xl leading-relaxed">
              Building communities, creating impact. Young professionals serving
              Tema and beyond through service, leadership, and fellowship.
            </p>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            {/* Navigation */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">
                Navigate
              </h4>
              <ul className="space-y-3">
                {[
                  { href: '/about', label: 'About' },
                  { href: '/projects', label: 'Projects' },
                  { href: '/events', label: 'Events' },
                  { href: '/gallery', label: 'Gallery' },
                  { href: '/contact', label: 'Contact' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-cranberry-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Stories */}
            <div className="md:col-span-5">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">
                Recent Stories
              </h4>
              {recentPosts.length > 0 ? (
                <ul className="space-y-5">
                  {recentPosts.map((post) => (
                    <li key={post._id}>
                      <Link
                        href={`/blog/${post.slug.current}`}
                        className="group flex items-center gap-2"
                      >
                        <span className="text-white/80 group-hover:text-cranberry-400 transition-colors duration-200 line-clamp-1">
                          {post.title}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-cranberry-400 transition-all duration-300 flex-shrink-0 rotate-0 group-hover:rotate-45" />
                      </Link>
                      <span className="block mt-1 text-xs text-white/30">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/30 text-sm">No stories yet.</p>
              )}
            </div>

            {/* Connect */}
            <div className="md:col-span-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">
                Connect
              </h4>
              <div className="space-y-4">
                {settings?.contact?.email && (
                  <p>
                    <a
                      href={`mailto:${settings.contact.email}`}
                      className="text-white/70 hover:text-cranberry-400 transition-colors duration-200"
                    >
                      {settings.contact.email}
                    </a>
                  </p>
                )}
                {settings?.contact?.phone && (
                  <p>
                    <a
                      href={`tel:${settings.contact.phone}`}
                      className="text-white/70 hover:text-cranberry-400 transition-colors duration-200"
                    >
                      {settings.contact.phone}
                    </a>
                  </p>
                )}
                {settings?.contact?.address && (
                  <p className="text-white/50">{settings.contact.address}</p>
                )}
              </div>

              <div className="mt-8">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                  Follow
                </h4>
                <div className="flex gap-3 flex-wrap">
                  {([
                    {key: 'facebook', icon: FaFacebook, label: 'Facebook'},
                    {key: 'twitter', icon: FaXTwitter, label: 'Twitter'},
                    {key: 'instagram', icon: Instagram, label: 'Instagram'},
                    {key: 'linkedin', icon: Linkedin, label: 'LinkedIn'},
                    {key: 'youtube', icon: FaYoutube, label: 'YouTube'},
                    {key: 'tiktok', icon: FaTiktok, label: 'TikTok'},
                  ] as const).map(({key, icon: Icon, label}) => {
                    const url = settings?.socialLinks?.[key as keyof typeof settings.socialLinks]
                    if (!url) return null
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-cranberry-500 hover:text-white transition-all duration-200"
                        aria-label={label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()}{' '}
            {settings?.siteTitle || 'Rotaract TC-25'}.
          </p>
          <p className="text-xs text-white/20">
            Service Above Self
          </p>
        </div>
      </div>
    </footer>
  )
}
