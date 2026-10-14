import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, BarChart, DollarSign, Activity, Settings } from "lucide-react"

const stats = [
  { name: "Total Users", value: "2,543", change: "+12%", icon: Users, color: "text-blue-500" },
  { name: "Revenue", value: "$48,352", change: "+8%", icon: DollarSign, color: "text-green-500" },
  { name: "Active Sessions", value: "1,234", change: "+5%", icon: Activity, color: "text-purple-500" },
  { name: "Conversion Rate", value: "3.2%", change: "-2%", icon: BarChart, color: "text-orange-500" },
]

const recentActivity = [
  { user: "John Doe", action: "Created new project", time: "2 minutes ago" },
  { user: "Jane Smith", action: "Updated settings", time: "15 minutes ago" },
  { user: "Bob Wilson", action: "Completed onboarding", time: "1 hour ago" },
  { user: "Alice Brown", action: "Submitted feedback", time: "3 hours ago" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your platform.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.user}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.action}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start gap-1 text-left">
              <Users className="h-5 w-5" />
              <span className="font-medium">Manage Users</span>
              <span className="text-xs text-muted-foreground">View and edit user accounts</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start gap-1 text-left">
              <BarChart className="h-5 w-5" />
              <span className="font-medium">Analytics</span>
              <span className="text-xs text-muted-foreground">View detailed reports</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start gap-1 text-left">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
              <span className="text-xs text-muted-foreground">Configure platform options</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start gap-1 text-left">
              <Activity className="h-5 w-5" />
              <span className="font-medium">Activity Log</span>
              <span className="text-xs text-muted-foreground">Review recent actions</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Table Preview</CardTitle>
          <CardDescription>TanStack Table integration ready for server-side pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "John Doe", role: "Admin", status: "Active", lastActive: "2 min ago" },
                  { name: "Jane Smith", role: "Editor", status: "Active", lastActive: "15 min ago" },
                  { name: "Bob Wilson", role: "Viewer", status: "Inactive", lastActive: "2 days ago" },
                  { name: "Alice Brown", role: "Admin", status: "Active", lastActive: "1 hour ago" },
                ].map((row, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{row.name}</td>
                    <td className="p-4"><Badge variant="secondary">{row.role}</Badge></td>
                    <td className="p-4">
                      <Badge variant={row.status === "Active" ? "default" : "outline"}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{row.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            This is a static preview. Full TanStack Table implementation with sorting, filtering,
            and server-side pagination will be added when backend API is available.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}