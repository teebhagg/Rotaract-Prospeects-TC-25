import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import { getUserById } from '@/server-fns/users'

export const Route = createFileRoute('/_authenticated/admin/settings')({
  beforeLoad: async () => {
    const session = await authClient.getSession()
    const userId = session.data?.user?.id
    const role = userId ? (await getUserById({ data: { id: userId } }))?.role : null
    if (role !== 'MAIN_ADMIN' && role !== 'ASSISTANT') {
      throw new Error('Unauthorized')
    }
  },
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage system settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure system-wide settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Settings configuration will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

