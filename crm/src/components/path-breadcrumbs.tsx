import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PathBreadcrumbs() {
  const router = useRouterState()
  const pathname = router.location.pathname

  // Split pathname into segments
  const segments = pathname.split('/').filter(Boolean)

  // Build breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return { href, label }
  })

  // Don't show breadcrumbs on dashboard root
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return null
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link
        to="/dashboard"
        className="hover:text-foreground transition-colors"
      >
        Dashboard
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.href}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}


