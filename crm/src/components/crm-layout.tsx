import { Link, Outlet } from "@tanstack/react-router";
import {
  Calendar,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { useSession } from "../lib/auth-client";
import { DynamicBreadcrumbs } from "./dynamic-breadcrumbs";
import { NavUser } from "./nav-user";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar";

const data = {
  user: {
    name: "Rotaract Member",
    email: "member@rotaract-tc25.com",
    avatar: "",
  },
  navGroups: [
    {
      label: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Members",
          url: "/members",
          icon: Users,
        },
        {
          title: "Meetings",
          url: "/meetings",
          icon: Calendar,
        },
        {
          title: "Attendance",
          url: "/attendance",
          icon: ClipboardCheck,
        },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
      ],
    },
  ],
};

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="font-bold">RT</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Rotaract</span>
                  <span className="truncate text-xs">TC-25 CRM</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3 py-2">
        {data.navGroups.map((group) => (
          <SidebarMenu key={group.label} className="mb-4">
            <SidebarMenuItem>
              <SidebarMenuButton className="h-8 px-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {group.label}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="h-9 px-2">
                  <Link
                    to={item.url}
                    activeProps={{
                      className:
                        "bg-sidebar-accent text-sidebar-accent-foreground",
                    }}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ))}
      </SidebarContent>
      <SidebarFooter className="px-4 py-4">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

export function CRMLayout() {
  const { data: session } = useSession();

  if (!session) {
    return <Outlet />;
  }

  data.user = {
    name: session.user?.name || '',
    email: session.user?.email || '',
    avatar: session.user?.image || '',
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
          <div className="flex w-full items-center gap-2 px-6 py-3">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex-1">
              <DynamicBreadcrumbs />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://rotaract-tc25.com"
                  rel="noopener noreferrer"
                  target="_blank">
                  Visit Website
                </a>
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 px-6 py-8 md:gap-8 md:py-10">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
