import { Card, CardContent } from "@/components/ui/card"
import { FileText, Eye, CheckCircle, Calendar } from "lucide-react"

const stats = [
  {
    title: "Pending Review",
    value: "12",
    icon: FileText,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    title: "Under Review",
    value: "5",
    icon: Eye,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Approved Today",
    value: "8",
    icon: CheckCircle,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "This Month",
    value: "156",
    icon: Calendar,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
]

export function ApplicationsStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">{stat.title}</span>
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
