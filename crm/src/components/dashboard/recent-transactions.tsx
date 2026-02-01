import { Eye, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

const activities = [
  {
    id: "ACT-001",
    member: {
      name: "John Doe",
      email: "john@rotaract.org",
      avatar: "",
    },
    action: "Joined Meeting",
    status: "active",
    date: "2 hours ago",
  },
  {
    id: "ACT-002",
    member: {
      name: "Sarah Connor",
      email: "sarah@rotaract.org",
      avatar: "",
    },
    action: "New Member",
    status: "prospect",
    date: "5 hours ago",
  },
  {
    id: "ACT-003",
    member: {
      name: "Michael Scott",
      email: "michael@rotaract.org",
      avatar: "",
    },
    action: "Attended Event",
    status: "active",
    date: "1 day ago",
  },
  {
    id: "ACT-004",
    member: {
      name: "Lucy Heartfilia",
      email: "lucy@rotaract.org",
      avatar: "",
    },
    action: "Updated Profile",
    status: "active",
    date: "2 days ago",
  },
  {
    id: "ACT-005",
    member: {
      name: "Natsu Dragneel",
      email: "natsu@rotaract.org",
      avatar: "",
    },
    action: "Project Participation",
    status: "active",
    date: "3 days ago",
  },
]

export function RecentTransactions() {
  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest member activities</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Eye className="h-4 w-4 mr-2" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} >
            <div className="flex p-3 rounded-lg border gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{activity.member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 items-center flex-wrap justify-between gap-1">
                <div className="flex items-center space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{activity.member.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.member.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      activity.status === "active" ? "default" :
                      activity.status === "prospect" ? "secondary" : "outline"
                    }
                    className="cursor-pointer"
                  >
                    {activity.action}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">{activity.status}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">View Profile</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Contact Member</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">View History</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}