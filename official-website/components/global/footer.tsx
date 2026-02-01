import Link from 'next/link'
import {getSiteSettings} from '@/sanity/queries/settings'
import {Facebook, Instagram, Linkedin} from 'lucide-react'

export async function Footer() {
  const settings = await getSiteSettings()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {settings?.siteTitle || 'Rotaract TC-25'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Building communities, creating impact.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Connect</h4>
            <ul className="space-y-3 text-sm">
              {settings?.socialLinks?.facebook && (
                <li>
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </a>
                </li>
              )}
              {settings?.socialLinks?.instagram && (
                <li>
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Instagram</span>
                  </a>
                </li>
              )}
              {settings?.socialLinks?.linkedin && (
                <li>
                  <a
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Contact</h4>
            {settings?.contact?.email && (
              <p className="text-sm text-muted-foreground mb-2">
                {settings.contact.email}
              </p>
            )}
            {settings?.contact?.phone && (
              <p className="text-sm text-muted-foreground">
                {settings.contact.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {settings?.siteTitle || 'Rotaract TC-25'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

