import {getSiteSettings} from '@/sanity/queries/settings'
import {PageHeader} from '@/components/layout/page-header'
import {SectionContainer} from '@/components/layout/section-container'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Button} from '@/components/ui/button'
import {AnimatedDiv} from '@/components/ui/animated-div'
import {fadeInUp} from '@/lib/animations'
import {Mail, Phone, MapPin, User, MessageSquare, Send, Instagram, Linkedin} from 'lucide-react'
import {FaTiktok} from 'react-icons/fa6'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  return {
    title: 'Contact Us | Rotaract TC-25',
    description: 'Get in touch with Rotaract TC-25',
  }
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <SectionContainer>
      <PageHeader
        title="Contact Us"
        description="We'd love to hear from you"
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <AnimatedDiv variants={fadeInUp}>
          <div className="bg-warm-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-charcoal-900 mb-6">Get in Touch</h2>
            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-medium text-charcoal-700">
                  <User className="h-4 w-4 text-coral-600" />
                  Name
                </label>
                <Input id="name" name="name" required className="bg-white border-charcoal-200" />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-medium text-charcoal-700">
                  <Mail className="h-4 w-4 text-coral-600" />
                  Email
                </label>
                <Input id="email" name="email" type="email" required className="bg-white border-charcoal-200" />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 flex items-center gap-2 text-sm font-medium text-charcoal-700">
                  <MessageSquare className="h-4 w-4 text-coral-600" />
                  Message
                </label>
                <Textarea id="message" name="message" rows={6} required className="bg-white border-charcoal-200" />
              </div>
              <Button type="submit" size="lg" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>
        </AnimatedDiv>

        <AnimatedDiv variants={fadeInUp} transition={{delay: 0.2}}>
          <div className="bg-warm-100 p-6 md:p-8 space-y-8">
            <h2 className="text-xl font-bold text-charcoal-900">Contact Information</h2>

            {settings?.contact?.email && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center bg-coral-100 text-coral-600 flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-charcoal-900">Email</h3>
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="text-coral-600 hover:text-coral-700 transition-colors"
                  >
                    {settings.contact.email}
                  </a>
                </div>
              </div>
            )}
            {settings?.contact?.phone && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center bg-coral-100 text-coral-600 flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-charcoal-900">Phone</h3>
                  <a
                    href={`tel:${settings.contact.phone}`}
                    className="text-coral-600 hover:text-coral-700 transition-colors"
                  >
                    {settings.contact.phone}
                  </a>
                </div>
              </div>
            )}
            {settings?.contact?.address && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center bg-coral-100 text-coral-600 flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-charcoal-900">Address</h3>
                  <p className="text-charcoal-500">{settings.contact.address}</p>
                </div>
              </div>
            )}
            {settings?.socialLinks && (
              <div>
                <h3 className="mb-4 font-semibold text-charcoal-900">Follow Us</h3>
                <div className="flex gap-3">
                  {settings.socialLinks.facebook && (
                    <a
                      href={settings.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center bg-coral-100 text-coral-600 hover:bg-coral-500 hover:text-white transition-all duration-200"
                      aria-label="TikTok"
                    >
                      <FaTiktok className="h-5 w-5" />
                    </a>
                  )}
                  {settings.socialLinks.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center bg-coral-100 text-coral-600 hover:bg-coral-500 hover:text-white transition-all duration-200"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {settings.socialLinks.linkedin && (
                    <a
                      href={settings.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center bg-coral-100 text-coral-600 hover:bg-coral-500 hover:text-white transition-all duration-200"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </AnimatedDiv>
      </div>
    </SectionContainer>
  )
}
