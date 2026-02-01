import { Link, useRouterState } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const router = useRouterState()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Meetings', href: '/meetings', icon: Calendar },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  // Add Settings for MAIN_ADMIN and ASSISTANT
  if (user?.role === 'MAIN_ADMIN' || user?.role === 'ASSISTANT') {
    navigation.push({ name: 'Settings', href: '/admin/settings', icon: Settings })
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <h1 className="text-xl font-bold text-sidebar-foreground">CRM Dashboard</h1>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = router.location.pathname === item.href || 
              router.location.pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

