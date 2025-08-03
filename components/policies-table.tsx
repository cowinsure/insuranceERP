import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Wheat, Sprout } from "lucide-react"

const policies = [
  {
    policyNumber: "AC-2024-001",
    policyId: "POL001",
    farmer: "Rajesh Kumar",
    assetType: "Rice Crop",
    coverage: "$25,000",
    premium: "$1,250",
    duration: "6 months",
    dateRange: "2024-01-15 to 2024-07-15",
    status: "active",
    icon: Sprout,
  },
  {
    policyNumber: "AC-2024-002",
    policyId: "POL002",
    farmer: "Priya Patel",
    assetType: "Wheat Crop",
    coverage: "$18,000",
    premium: "$900",
    duration: "6 months",
    dateRange: "2024-02-01 to 2024-08-01",
    status: "active",
    icon: Wheat,
  },
  {
    policyNumber: "AC-2023-087",
    policyId: "POL003",
    farmer: "Amit Singh",
    assetType: "Cotton Crop",
    coverage: "$30,000",
    premium: "$1,800",
    duration: "6 months",
    dateRange: "2023-11-01 to 2024-05-01",
    status: "expired",
    icon: Sprout,
  },
  {
    policyNumber: "AC-2024-003",
    policyId: "POL004",
    farmer: "Sunita Devi",
    assetType: "Sugarcane",
    coverage: "$22,000",
    premium: "$1,100",
    duration: "6 months",
    dateRange: "2024-01-20 to 2024-07-20",
    status: "active",
    icon: Sprout,
  },
]

const getStatusBadge = (status: string) => {
  const variants = {
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    expired: "bg-red-100 text-red-800 hover:bg-red-100",
    pending: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    cancelled: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  }
  return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
}

export function PoliciesTable() {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Insurance Policies</CardTitle>
        <p className="text-sm text-gray-600">{policies.length} policies found</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Policy Details</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Farmer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Asset Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Coverage</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Premium</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.policyId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-blue-600">{policy.policyNumber}</div>
                      <div className="text-sm text-gray-500">{policy.policyId}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{policy.farmer}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <policy.icon className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-900">{policy.assetType}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">{policy.coverage}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{policy.premium}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm text-gray-900">{policy.duration}</div>
                      <div className="text-xs text-gray-500">{policy.dateRange}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusBadge(policy.status)}>{policy.status}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
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
