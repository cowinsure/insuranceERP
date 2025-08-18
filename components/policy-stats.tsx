import { Card, CardContent } from "@/components/ui/card"
import { FileText, Calendar, DollarSign, Tag, HandCoins } from "lucide-react"

const stats = [
  {
    title: "Active Policies",
    value: "156",
    icon: FileText,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Expiring Soon",
    value: "23",
    icon: Calendar,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    title: "Total Coverage",
    value: "৳2.1M",
    icon: HandCoins,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Cattle Types",
    value: "12",
    icon: Tag,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
  },
]

export function ProductStats() {
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
