import {getLeadership} from '@/sanity/queries/leadership'
import {PageHeader} from '@/components/layout/page-header'
import {SectionContainer} from '@/components/layout/section-container'
import {LeadershipCard} from '@/components/cards/leadership-card'
import {AnimatedDiv} from '@/components/ui/animated-div'
import {staggerContainer} from '@/lib/animations'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  return {
    title: 'Leadership | Rotaract TC-25',
    description: 'Meet our leadership team',
  }
}

export default async function LeadershipPage() {
  const leaders = await getLeadership()

  return (
    <SectionContainer>
      <PageHeader
        title="Our Leadership"
        description="Meet the team leading Rotaract TC-25"
      />
      {leaders.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Leadership information is being set up. Check back soon!
        </p>
      ) : (
        <AnimatedDiv
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {leaders.map((leader, index) => (
            <LeadershipCard key={leader._id} leader={leader} index={index} />
          ))}
        </AnimatedDiv>
      )}
    </SectionContainer>
  )
}

