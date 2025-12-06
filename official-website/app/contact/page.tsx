import {getSiteSettings} from '@/sanity/queries/settings'
import {PageHeader} from '@/components/layout/page-header'
import {SectionContainer} from '@/components/layout/section-container'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Button} from '@/components/ui/button'
import {AnimatedDiv} from '@/components/ui/animated-div'
import {fadeInUp} from '@/lib/animations'
import {Mail, Phone, MapPin, User, MessageSquare, Send, Facebook, Instagram, Linkedin} from 'lucide-react'

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
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-primary" />
                    Name
                  </label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Message
                  </label>
                  <Textarea id="message" name="message" rows={6} required />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </AnimatedDiv>

        <AnimatedDiv variants={fadeInUp} transition={{delay: 0.2}}>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings?.contact?.email && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-none bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">Email</h3>
                    <a
                      href={`mailto:${settings.contact.email}`}
                      className="text-primary hover:underline"
                    >
                      {settings.contact.email}
                    </a>
                  </div>
                </div>
              )}
              {settings?.contact?.phone && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-none bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">Phone</h3>
                    <a
                      href={`tel:${settings.contact.phone}`}
                      className="text-primary hover:underline"
                    >
                      {settings.contact.phone}
                    </a>
                  </div>
                </div>
              )}
              {settings?.contact?.address && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-none bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">Address</h3>
                    <p className="text-muted-foreground">{settings.contact.address}</p>
                  </div>
                </div>
              )}
              {settings?.socialLinks && (
                <div>
                  <h3 className="mb-4 font-semibold">Follow Us</h3>
                  <div className="flex gap-4">
                    {settings.socialLinks.facebook && (
                      <a
                        href={settings.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary transition-colors hover:bg-primary/20 hover:text-primary-600"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {settings.socialLinks.instagram && (
                      <a
                        href={settings.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary transition-colors hover:bg-primary/20 hover:text-primary-600"
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
                        className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary transition-colors hover:bg-primary/20 hover:text-primary-600"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedDiv>
      </div>
    </SectionContainer>
  )
}

