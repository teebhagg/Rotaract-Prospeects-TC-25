// import { AppSidebar } from '@/components/app-sidebar'
// import { PathBreadcrumbs } from '@/components/path-breadcrumbs'
// import { UserNav } from '@/components/user-nav'
// import { authClient } from '@/lib/auth-client'
// import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

// export const Route = createFileRoute('/_authenticated')({
//   beforeLoad: async () => {
//     const session = await authClient.getSession()
//     if (!session.data?.user) {
//       throw redirect({
//         to: '/login',
//         search: {
//           redirect: location.href,
//         },
//       })
//     }
//   },
//   component: AuthenticatedLayout,
// })

// function AuthenticatedLayout() {
//   // Just render the outlet - let CRMLayout handle the layout
//   return <Outlet />
// }

