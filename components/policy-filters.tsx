import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function PolicyFilters() {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search by policy number or farmer name..." className="pl-10 bg-white border-gray-200" />
          </div>
          {/* <div className="flex gap-4">
            <Select defaultValue="all-status">
              <SelectTrigger className="w-32 bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-assets">
              <SelectTrigger className="w-32 bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-assets">All Assets</SelectItem>
                <SelectItem value="rice">Rice Crop</SelectItem>
                <SelectItem value="wheat">Wheat Crop</SelectItem>
                <SelectItem value="cotton">Cotton Crop</SelectItem>
                <SelectItem value="sugarcane">Sugarcane</SelectItem>
                <SelectItem value="tomato">Tomato Crop</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
