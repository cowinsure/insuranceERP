"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Eye, FileText, MapPin, XCircle } from "lucide-react";
import { useState } from "react";
import GenericModal from "./ui/GenericModal";

const applications = [
  {
    applicationId: "APP001",
    farmer: "Shafiqur Rahman",
    location: "Bogura, Bangladesh",
    asset: "cow63825657",
    acreage: "6 acres",
    coverage: "৳35,000",
    status: "pending",
    dateSubmitted: "2025-02-10",
  },
  {
    applicationId: "APP002",
    farmer: "Nasima Khatun",
    location: "Barisal, Bangladesh",
    asset: "cow6382538",
    acreage: "4 acres",
    coverage: "৳28,000",
    status: "under review",
    dateSubmitted: "2025-02-08",
  },
  {
    applicationId: "APP003",
    farmer: "Kamal Hossain",
    location: "Jessore, Bangladesh",
    asset: "cow6382453",
    acreage: "8 acres",
    coverage: "৳42,000",
    status: "approved",
    dateSubmitted: "2025-02-05",
  },
  {
    applicationId: "APP004",
    farmer: "Rekha Begum",
    location: "Rangpur, Bangladesh",
    asset: "cow6382100",
    acreage: "3 acres",
    coverage: "৳18,000",
    status: "rejected",
    dateSubmitted: "2025-02-03",
  },
];

const getStatusBadge = (status: string) => {
  const variants = {
    pending: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    "under review": "bg-blue-100 text-blue-800 hover:bg-blue-100",
    approved: "bg-green-100 text-green-800 hover:bg-green-100",
    rejected: "bg-red-100 text-red-800 hover:bg-red-100",
  };
  return (
    variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  );
};

export function ApplicationsTable() {
  const [selectedapplication, setSelectedApplication] = useState<
    (typeof applications)[0] | null
  >(null);

  return (
    <Card className="border border-gray-200 py-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Insurance Applications
        </CardTitle>
        <p className="text-sm text-gray-600">
          {applications.length} applications found
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Application ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Farmer Details
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Cattle Information
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Coverage Requested
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Date Submitted
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.applicationId}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <span className="font-medium text-blue-600">
                      {application.applicationId}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.farmer}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {application.location}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm text-gray-900">
                        {application.asset}
                      </div>
                      {/* <div className="text-sm text-gray-600">
                        {application.acreage}
                      </div> */}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">
                      {application.coverage}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusBadge(application.status)}>
                      {application.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {application.dateSubmitted}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      {selectedapplication && (
        <GenericModal closeModal={() => setSelectedApplication(null)}>
          <div className="w-full rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Application Review - {selectedapplication.applicationId}
                </h1>
                <p className="text-sm text-gray-500">
                  Review application details and supporting documents
                </p>
              </div>
            </div>

            <div className="max-h-[65vh] pr-2 space-y-6 overflow-auto">
              <div className="border rounded-md p-4">
                <p className="font-medium text-gray-800 mb-2">
                  👨‍🌾 Farmer Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="text-gray-900">
                      {selectedapplication.farmer}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="text-gray-900">
                      {selectedapplication.farmer
                        .toLowerCase()
                        .split(" ")
                        .join(".")}
                      @mail.com
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="text-gray-900">+8801XXXXXXXXX</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="text-gray-900">
                      {selectedapplication.location}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-gray-500">Experience</p>
                    <p className="text-gray-900">15 years farming experience</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <p className="font-medium text-gray-800 mb-2">
                  📋 Asset Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Asset Type</p>
                    <p className="text-gray-900">{selectedapplication.asset}</p>
                  </div>
                  {/* <div>
                    <p className="text-gray-500">Area</p>
                    <p className="text-gray-900">
                      {selectedapplication.acreage}
                    </p>
                  </div> */}
                  <div>
                    <p className="text-gray-500">Requested Coverage</p>
                    <p className="text-gray-900">
                      {selectedapplication.coverage}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Application Date</p>
                    <p className="text-gray-900">
                      {selectedapplication.dateSubmitted}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <p className="font-medium text-gray-800 mb-2">
                  📎 Supporting Documents
                </p>
                <div className="space-y-3">
                  {["land_records.pdf", "soil_test.pdf", "nid_card.pdf"].map(
                    (doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3 bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-800">{doc}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-sm px-4"
                          >
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-sm px-4"
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="border rounded-md p-4">
                <p className="font-medium text-gray-800 mb-2">
                  📝 Review Comments
                </p>
                <textarea
                  className="w-full border rounded-md p-2 text-sm min-h-[100px]"
                  placeholder="Add your review comments here..."
                />
              </div>
            </div>
            <div className="flex justify-between gap-2 mt-4 flex-wrap">
              <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="w-4 h-4 mr-2" /> Approve Application
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-red-600 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" /> Reject Application
              </Button>
            </div>
          </div>
        </GenericModal>
      )}
    </Card>
  );
}
