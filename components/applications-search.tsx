"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Example data
const applications = [
  { id: "APP001", farmerName: "John Doe" },
  { id: "APP002", farmerName: "Jane Smith" },
  { id: "APP003", farmerName: "Ali Khan" },
];

export function ApplicationsSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApplications = applications.filter((app) =>
    `${app.id} ${app.farmerName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by application ID or farmer name..."
            className="pl-10 bg-white border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {searchTerm && (
          <ul className="space-y-2">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <li key={app.id} className="text-gray-800">
                  <strong>{app.id}</strong> - {app.farmerName}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No applications found.</li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
