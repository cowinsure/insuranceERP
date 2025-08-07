"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Wheat, Sprout } from "lucide-react";
import { useState } from "react";
import GenericModal from "./ui/GenericModal";

const policies = [
  {
    policyNumber: "AC-2024-001",
    policyId: "POL001",
    farmer: "Rahim Uddin",
    assetType: "Cow",
    coverage: "৳25,000",
    premium: "৳1,250",
    duration: "6 months",
    dateRange: "2025-01-15 to 2025-07-15",
    status: "active",
  },
  {
    policyNumber: "AC-2025-002",
    policyId: "POL002",
    farmer: "Fatema Begum",
    assetType: "Cow",
    coverage: "৳18,000",
    premium: "৳900",
    duration: "6 months",
    dateRange: "2025-02-01 to 2025-08-01",
    status: "active",
  },
  {
    policyNumber: "AC-2023-087",
    policyId: "POL003",
    farmer: "Shahidul Islam",
    assetType: "Cow",
    coverage: "৳30,000",
    premium: "৳1,800",
    duration: "6 months",
    dateRange: "2023-11-01 to 2025-05-01",
    status: "expired",
  },
  {
    policyNumber: "AC-2025-003",
    policyId: "POL004",
    farmer: "Hasina Akhter",
    assetType: "Cow",
    coverage: "৳22,000",
    premium: "৳1,100",
    duration: "6 months",
    dateRange: "2025-01-20 to 2025-07-20",
    status: "active",
  },
];

const getStatusBadge = (status: string) => {
  const variants = {
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    expired: "bg-red-100 text-red-800 hover:bg-red-100",
    pending: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    cancelled: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };
  return (
    variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  );
};

export function PoliciesTable() {
  const [selectedPolicy, setSelectedPolicy] = useState<
    (typeof policies)[0] | null
  >(null);

  return (
    <Card className="border border-gray-200 py-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Insurance Policies
        </CardTitle>
        <p className="text-sm text-gray-600">
          {policies.length} policies found
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Policy Details
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Farmer
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Asset Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Coverage
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Premium
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Duration
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr
                  key={policy.policyId}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-blue-600">
                        {policy.policyNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {policy.policyId}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">
                      {policy.farmer}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {/* <policy.icon className="w-4 h-4 text-green-600" /> */}
                      <span className="text-sm text-gray-900">
                        {policy.assetType}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">
                      {policy.coverage}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">
                      {policy.premium}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm text-gray-900">
                        {policy.duration}
                      </div>
                      <div className="text-xs text-gray-500">
                        {policy.dateRange}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusBadge(policy.status)}>
                      {policy.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPolicy(policy)}
                      >
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
      {selectedPolicy && (
        <GenericModal closeModal={() => setSelectedPolicy(null)}>
          <div className="w-full rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Policy Details - {selectedPolicy.policyNumber}
                </h1>
                <p className="text-sm text-gray-500">
                  View policy information and coverage summary
                </p>
              </div>
            </div>

            <div className="max-h-[65vh] pr-2 space-y-6 overflow-auto">
              {/* 📄 Policy Info */}
              <div className="border rounded-md p-4">
                <p className="font-medium text-gray-800 mb-2">
                  📄 Basic Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Policy ID</p>
                    <p className="text-gray-900">{selectedPolicy.policyId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="text-gray-900">{selectedPolicy.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date Range</p>
                    <p className="text-gray-900">{selectedPolicy.dateRange}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <span
                      className={`text-sm px-2 py-1 rounded-full font-medium 
                ${getStatusBadge(selectedPolicy.status)}`}
                    >
                      {selectedPolicy.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* 👩‍🌾 Farmer Info */}
              <div className="border rounded-md p-4">
                <p className="font-medium text-gray-800 mb-2">👩‍🌾 Farmer Info</p>
                <div className="text-sm">
                  <p className="text-gray-500">Name</p>
                  <p className="text-gray-900">{selectedPolicy.farmer}</p>
                </div>
              </div>

              {/* 🐄 Asset Info */}
              <div className="border rounded-md p-4">
                <p className="font-medium text-gray-800 mb-2">
                  🐄 Asset Coverage
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Asset Type</p>
                    <p className="text-gray-900">{selectedPolicy.assetType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Coverage Amount</p>
                    <p className="text-gray-900">{selectedPolicy.coverage}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Premium</p>
                    <p className="text-gray-900">{selectedPolicy.premium}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional action buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedPolicy(null)}>
                Close
              </Button>
            </div>
          </div>
        </GenericModal>
      )}
    </Card>
  );
}
