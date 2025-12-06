import Link from 'next/link'
import {getSiteSettings} from '@/sanity/queries/settings'
import {Facebook, Instagram, Linkedin} from 'lucide-react'

export async function Footer() {
  const settings = await getSiteSettings()

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold text-foreground">
              {settings?.siteTitle || 'Rotaract TC-25'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Building communities, creating impact.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="relative inline-block text-muted-foreground hover:text-primary-700 transition-all duration-300 hover:scale-110 group">
                  About Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-700 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link href="/projects" className="relative inline-block text-muted-foreground hover:text-primary-700 transition-all duration-300 hover:scale-110 group">
                  Projects
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-700 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link href="/events" className="relative inline-block text-muted-foreground hover:text-primary-700 transition-all duration-300 hover:scale-110 group">
                  Events
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-700 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="relative inline-block text-muted-foreground hover:text-primary-700 transition-all duration-300 hover:scale-110 group">
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-700 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Connect</h4>
            <ul className="space-y-3 text-sm">
              {settings?.socialLinks?.facebook && (
                <li>
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-2 text-muted-foreground hover:text-primary-700 transition-all duration-300 hover:scale-110 group"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-700 transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              )}
              {settings?.socialLinks?.instagram && (
                <li>
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-2 text-muted-foreground hover:text-primary-700 transition-all duration-300 hover:scale-110 group"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>Instagram</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-700 transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              )}
              {settings?.socialLinks?.linkedin && (
                <li>
                  <a
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-2 text-muted-foreground hover:text-primary-700 transition-all duration-300 hover:scale-110 group"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-700 transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Contact</h4>
            {settings?.contact?.email && (
              <p className="text-sm text-muted-foreground mb-2">
                📧 {settings.contact.email}
              </p>
            )}
            {settings?.contact?.phone && (
              <p className="text-sm text-muted-foreground">
                📞 {settings.contact.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {settings?.siteTitle || 'Rotaract TC-25'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

