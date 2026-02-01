import { Eye, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"

const projects = [
  {
    id: 1,
    name: "Community Clean-up",
    participants: 45,
    impact: "8.4k beneficiaries",
    growth: "+23%",
    rating: 4.8,
    progress: 85,
    category: "Environment",
  },
  {
    id: 2,
    name: "Youth Education Program",
    participants: 32,
    impact: "120 students",
    growth: "+18%",
    rating: 4.6,
    progress: 72,
    category: "Education",
  },
  {
    id: 3,
    name: "Blood Donation Drive",
    participants: 28,
    impact: "156 units",
    growth: "+12%",
    rating: 4.9,
    progress: 90,
    category: "Health",
  },
  {
    id: 4,
    name: "Digital Literacy Workshop",
    participants: 22,
    impact: "89 participants",
    growth: "+8%",
    rating: 4.7,
    progress: 65,
    category: "Technology",
  },
  {
    id: 5,
    name: "Cultural Exchange Event",
    participants: 38,
    impact: "200 attendees",
    growth: "+31%",
    rating: 4.4,
    progress: 78,
    category: "Culture",
  },
]

export function TopProducts() {
  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Top Projects</CardTitle>
          <CardDescription>Most impactful projects this quarter</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Eye className="h-4 w-4 mr-2" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project, index) => (
          <div key={project.id} className="flex items-center p-3 rounded-lg border gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                #{index + 1}
              </div>
            <div className="flex gap-2 items-center justify-between space-x-3 flex-1 flex-wrap">
              <div className="">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium truncate">{project.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {project.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{project.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{project.participants} participants</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">{project.impact}</p>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200 cursor-pointer"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {project.growth}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Progress: {project.progress}%</span>
                  <Progress
                    value={project.progress}
                    className="w-12 h-1"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}