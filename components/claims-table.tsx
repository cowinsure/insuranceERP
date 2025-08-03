import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const claims = [
  {
    id: "CLM001",
    farmer: "Rajesh Kumar",
    asset: "Rice Crop - 5 acres",
    amount: "$12,500",
    status: "pending",
    priority: "high",
    date: "2024-02-01",
  },
  {
    id: "CLM002",
    farmer: "Priya Patel",
    asset: "Wheat Crop - 3 acres",
    amount: "$8,200",
    status: "approved",
    priority: "medium",
    date: "2024-01-30",
  },
  {
    id: "CLM003",
    farmer: "Amit Singh",
    asset: "Cotton Crop - 7 acres",
    amount: "$15,800",
    status: "under review",
    priority: "medium",
    date: "2024-01-28",
  },
  {
    id: "CLM004",
    farmer: "Sunita Devi",
    asset: "Sugarcane - 4 acres",
    amount: "$9,600",
    status: "rejected",
    priority: "low",
    date: "2024-01-25",
  },
  {
    id: "CLM005",
    farmer: "Vikram Reddy",
    asset: "Tomato Crop - 2 acres",
    amount: "$6,400",
    status: "approved",
    priority: "high",
    date: "2024-01-22",
  },
]

const getStatusBadge = (status: string) => {
  const variants = {
    pending: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    approved: "bg-green-100 text-green-800 hover:bg-green-100",
    "under review": "bg-blue-100 text-blue-800 hover:bg-blue-100",
    rejected: "bg-red-100 text-red-800 hover:bg-red-100",
  }
  return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
}

const getPriorityBadge = (priority: string) => {
  const variants = {
    high: "bg-red-100 text-red-800 hover:bg-red-100",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    low: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  }
  return variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800"
}

export function ClaimsTable() {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">Latest Claim Requests</CardTitle>
          <p className="text-sm text-gray-600">Recent insurance claims requiring your attention</p>
        </div>
        <Button variant="outline" size="sm">
          View All Claims
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Claim ID</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Farmer</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Asset</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Priority</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <span className="text-sm font-medium text-blue-600">{claim.id}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-900">{claim.farmer}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-600">{claim.asset}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm font-medium text-gray-900">{claim.amount}</span>
                  </td>
                  <td className="py-3 px-2">
                    <Badge className={getStatusBadge(claim.status)}>{claim.status}</Badge>
                  </td>
                  <td className="py-3 px-2">
                    <Badge className={getPriorityBadge(claim.priority)}>{claim.priority}</Badge>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-600">{claim.date}</span>
                  </td>
                  <td className="py-3 px-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
