import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, AlertTriangle } from "lucide-react"

const claims = [
  {
    claimId: "CLM001",
    date: "2024-02-01",
    farmer: "Rajesh Kumar",
    farmerId: "F001",
    asset: "Rice Crop - 5 acres",
    damage: "Flood",
    amount: "$12,500",
    status: "pending",
    priority: "high",
    assessor: "Unassigned",
  },
  {
    claimId: "CLM002",
    date: "2024-01-30",
    farmer: "Priya Patel",
    farmerId: "F002",
    asset: "Wheat Crop - 3 acres",
    damage: "Drought",
    amount: "$8,200",
    status: "approved",
    priority: "medium",
    assessor: "Dr. Sarah Johnson",
  },
  {
    claimId: "CLM003",
    date: "2024-01-28",
    farmer: "Amit Singh",
    farmerId: "F003",
    asset: "Cotton Crop - 7 acres",
    damage: "Pest Attack",
    amount: "$15,800",
    status: "under review",
    priority: "medium",
    assessor: "Dr. Mike Chen",
  },
  {
    claimId: "CLM004",
    date: "2024-01-25",
    farmer: "Sunita Devi",
    farmerId: "F004",
    asset: "Sugarcane - 4 acres",
    damage: "Hail Storm",
    amount: "$9,600",
    status: "rejected",
    priority: "low",
    assessor: "Dr. Sarah Johnson",
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

export function ClaimsManagementTable() {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Insurance Claims</CardTitle>
        <p className="text-sm text-gray-600">{claims.length} claims found</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Claim Details</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Farmer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Asset & Damage</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Priority</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Assessor</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.claimId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-blue-600">{claim.claimId}</div>
                      <div className="text-sm text-gray-500">{claim.date}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm text-gray-900">{claim.farmer}</div>
                      <div className="text-sm text-gray-500">{claim.farmerId}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm text-gray-900">{claim.asset}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                        <span className="text-sm text-gray-600">{claim.damage}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">{claim.amount}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusBadge(claim.status)}>{claim.status}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getPriorityBadge(claim.priority)}>{claim.priority}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{claim.assessor}</span>
                  </td>
                  <td className="py-4 px-4">
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
