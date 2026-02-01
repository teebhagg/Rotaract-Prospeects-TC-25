import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import { getUserById } from '@/server-fns/users'
import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'

export const Route = createFileRoute('/_authenticated/profile')({
  loader: async () => {
    const session = await authClient.getSession()
    const userId = session.data?.user?.id
    if (!userId) {
      throw new Error('Not authenticated')
    }
    const user = await getUserById({ data: { id: userId } })
    if (!user) {
      throw new Error('User not found')
    }
    return { user }
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Your CRM dashboard user profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>CRM dashboard access user details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p>{user.name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <Badge
              variant={
                user.role === 'MAIN_ADMIN'
                  ? 'default'
                  : user.role === 'ASSISTANT'
                    ? 'secondary'
                    : 'outline'
              }
            >
              {user.role}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">User Since</p>
            <p>{format(new Date(user.createdAt), 'PP')}</p>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Note: This is your CRM dashboard user account. Organization members and their attendance records are managed separately.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

