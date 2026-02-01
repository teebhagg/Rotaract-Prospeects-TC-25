import { useLocation, Link } from '@tanstack/react-router'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb'

export function DynamicBreadcrumbs() {
  const location = useLocation()

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null
  }

  // Generate breadcrumb items from pathname
  const pathSegments = location.pathname.split('/').filter((segment) => segment)

  // Define page titles for better UX
  const pageTitles: Record<string, string> = {
    '': 'Dashboard',
    'members': 'Members',
    'meetings': 'Meetings',
    'attendance': 'Attendance',
    'settings': 'Settings',
  }

  const breadcrumbs = [
    { label: 'Dashboard', href: '/', isActive: false },
    ...pathSegments.map((segment, index) => {
      // Handle dynamic routes like /members/:memberId
      const isDynamic = segment.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/) // UUID pattern
      const isLastSegment = index === pathSegments.length - 1

      let label = segment
      let href = '/' + pathSegments.slice(0, index + 1).join('/')

      // Use friendly names for known routes
      if (pageTitles[segment]) {
        label = pageTitles[segment]
      } else if (isDynamic) {
        // For dynamic routes, use a friendly name based on parent route
        const parentSegment = pathSegments[index - 1]
        if (parentSegment === 'members') {
          label = 'Member Details'
        } else if (parentSegment === 'meetings') {
          label = 'Meeting Details'
        } else {
          label = 'Details'
        }
      } else {
        // Convert kebab-case to Title Case
        label = segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }

      return {
        label,
        href,
        isActive: isLastSegment,
      }
    }),
  ];

  return (
    <div className="flex items-center gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <div key={item.href} className="flex items-center">
              <BreadcrumbItem className='px-2' >
                {index === 0 ? (
                  <Link to={item.href} className="flex items-center hover:text-primary transition-colors">
                    <Home className="h-4 w-4" />
                  </Link>
                ) : item.isActive ? (
                  <BreadcrumbPage className="font-semibold text-primary bg-muted px-2 py-1 rounded-md">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <Link
                    to={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}