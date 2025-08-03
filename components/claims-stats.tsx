import { Card, CardContent } from "@/components/ui/card"
import { Clock, Wrench, CheckCircle, XCircle } from "lucide-react"

const stats = [
  {
    title: "Pending Review",
    value: "23",
    icon: Clock,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    title: "Under Assessment",
    value: "8",
    icon: Wrench,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Approved",
    value: "142",
    icon: CheckCircle,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Rejected",
    value: "15",
    icon: XCircle,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
  },
]

export function ClaimsStats() {
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
