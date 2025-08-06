import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MapPin } from "lucide-react"

const applications = [
  {
    applicationId: "APP001",
    farmer: "Ramesh Gupta",
    location: "Maharashtra, India",
    asset: "Onion Crop",
    acreage: "6 acres",
    coverage: "$35,000",
    status: "pending",
    dateSubmitted: "2024-02-10",
  },
  {
    applicationId: "APP002",
    farmer: "Lakshmi Nair",
    location: "Kerala, India",
    asset: "Coconut Trees",
    acreage: "4 acres",
    coverage: "$28,000",
    status: "under review",
    dateSubmitted: "2024-02-08",
  },
  {
    applicationId: "APP003",
    farmer: "Hardeep Singh",
    location: "Punjab, India",
    asset: "Basmati Rice",
    acreage: "8 acres",
    coverage: "$42,000",
    status: "approved",
    dateSubmitted: "2024-02-05",
  },
  {
    applicationId: "APP004",
    farmer: "Geeta Kumari",
    location: "Rajasthan, India",
    asset: "Mustard Crop",
    acreage: "3 acres",
    coverage: "$18,000",
    status: "rejected",
    dateSubmitted: "2024-02-03",
  },
]

const getStatusBadge = (status: string) => {
  const variants = {
    pending: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    "under review": "bg-blue-100 text-blue-800 hover:bg-blue-100",
    approved: "bg-green-100 text-green-800 hover:bg-green-100",
    rejected: "bg-red-100 text-red-800 hover:bg-red-100",
  }
  return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
}

export function ApplicationsTable() {
  return (
    <Card className="border border-gray-200 py-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Insurance Applications</CardTitle>
        <p className="text-sm text-gray-600">{applications.length} applications found</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Application ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Farmer Details</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Asset Information</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Coverage Requested</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date Submitted</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.applicationId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className="font-medium text-blue-600">{application.applicationId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{application.farmer}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{application.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm text-gray-900">{application.asset}</div>
                      <div className="text-sm text-gray-600">{application.acreage}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">{application.coverage}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusBadge(application.status)}>{application.status}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{application.dateSubmitted}</span>
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
