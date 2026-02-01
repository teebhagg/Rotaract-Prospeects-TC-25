import { Plus, Settings, FileText, Download, Calendar, Target } from "lucide-react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

export function QuickActions() {
  return (
    <div className="flex items-center space-x-2">
      <Button className="cursor-pointer">
        <Plus className="h-4 w-4 mr-2" />
        Add Member
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Target className="h-4 w-4 mr-2" />
            Create Project
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}