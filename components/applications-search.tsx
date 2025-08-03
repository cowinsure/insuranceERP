import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function ApplicationsSearch() {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search by application ID or farmer name..." className="pl-10 bg-white border-gray-200" />
        </div>
      </CardContent>
    </Card>
  )
}
