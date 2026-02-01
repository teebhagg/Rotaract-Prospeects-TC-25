import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  ClipboardCheck,
  UserPlus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

const metrics = [
  {
    title: "Total Members",
    value: "125",
    description: "Active members",
    change: "+12%",
    trend: "up",
    icon: Users,
    footer: "Growing membership base",
    subfooter: "New members this quarter"
  },
  {
    title: "Meetings Held",
    value: "12",
    description: "Monthly meetings",
    change: "+8.3%",
    trend: "up",
    icon: Calendar,
    footer: "Consistent engagement",
    subfooter: "Project leads active"
  },
  {
    title: "Attendance Rate",
    value: "78%",
    description: "Average attendance",
    change: "+5.2%",
    trend: "up",
    icon: ClipboardCheck,
    footer: "High participation",
    subfooter: "Above target levels"
  },
  {
    title: "New Members",
    value: "15",
    description: "This month",
    change: "-2.1%",
    trend: "down",
    icon: UserPlus,
    footer: "Recruitment focus needed",
    subfooter: "Below monthly target"
  },
]

export function MetricsOverview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      {metrics.map((metric) => {
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown

        return (
          <Card key={metric.title} className="cursor-pointer">
            <CardHeader>
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metric.value}
              </CardTitle>
              <Badge variant="outline" className="w-fit">
                <TrendIcon className="h-4 w-4" />
                {metric.change}
              </Badge>
            </CardHeader>
            <CardContent className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {metric.footer} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                {metric.subfooter}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}