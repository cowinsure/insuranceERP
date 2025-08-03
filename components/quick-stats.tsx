import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const quickStats = [
  {
    label: "Approval Rate",
    value: "92.3%",
    color: "text-green-600",
  },
  {
    label: "Avg. Claim Processing",
    value: "4.2 days",
    color: "text-gray-900",
  },
  {
    label: "Active Farmers",
    value: "1,856",
    color: "text-gray-900",
  },
  {
    label: "Total Coverage",
    value: "$12.4M",
    color: "text-blue-600",
  },
]

export function QuickStats() {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{stat.label}</span>
            <span className={`text-sm font-semibold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
