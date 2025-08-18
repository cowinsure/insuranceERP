"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  AlertTriangle,
  X,
  FileText,
  ImageIcon,
  UserIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import GenericModal from "./ui/GenericModal";
import useApi from "@/hooks/use_api";
import { InsuranceClaim } from "./model/claim/InsuranceClaim";
import ClaimDetailsModal from "./ui/ClaimDetailsModal";

const claims = [
  {
    claimId: "CLM001",
    date: "2025-02-01",
    farmer: "Rahim Uddin",
    farmerId: "F001",
    asset: "Rice Crop - 5 acres",
    damage: "Flood",
    amount: "৳12,500",
    status: "pending",
    priority: "high",
    assessor: "Unassigned",
  },
  {
    claimId: "CLM002",
    date: "2025-01-30",
    farmer: "Fatema Begum",
    farmerId: "F002",
    asset: "Wheat Crop - 3 acres",
    damage: "Drought",
    amount: "৳8,200",
    status: "approved",
    priority: "medium",
    assessor: "Dr. Rezaul Karim",
  },
  {
    claimId: "CLM003",
    date: "2025-01-28",
    farmer: "Shahidul Islam",
    farmerId: "F003",
    asset: "Cotton Crop - 7 acres",
    damage: "Pest Attack",
    amount: "৳15,800",
    status: "under review",
    priority: "medium",
    assessor: "Dr. Nusrat Jahan",
  },
  {
    claimId: "CLM004",
    date: "2025-01-25",
    farmer: "Hasina Akhter",
    farmerId: "F004",
    asset: "Sugarcane - 4 acres",
    damage: "Hail Storm",
    amount: "৳9,600",
    status: "rejected",
    priority: "low",
    assessor: "Dr. Rezaul Karim",
  },
];

const getStatusBadge = (status: string) => {
  const variants = {
    pending: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    approved: "bg-green-100 text-green-800 hover:bg-green-100",
    "under review": "bg-blue-100 text-blue-800 hover:bg-blue-100",
    rejected: "bg-red-100 text-red-800 hover:bg-red-100",
  };
  return (
    variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  );
};

const getPriorityBadge = (priority: string) => {
  const variants = {
    high: "bg-red-100 text-red-800 hover:bg-red-100",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    low: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  };
  return (
    variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800"
  );
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const day = date.toLocaleDateString("en-GB", { day: "2-digit" });
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const year = date.toLocaleDateString("en-GB", { year: "2-digit" });

  return `${day}-${month}-${year}`;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ClaimsManagementTable() {
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(
    null
  );
  const [claimData, setClaimData] = useState<InsuranceClaim[]>([]);
  const { get, post, loading, error } = useApi();
  console.log(claimData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get("ims/insurance-claim-service/", {
          params: {
            start_record: 1,
            page_size: 10,
            asset_insurance_id: -1,
          },
        });
        console.log("Response from API:", response.status);

        if (response.status === "success") {
          setClaimData(response.data);
        }
        // console.log(response.data.length + " farmers found");

        // for (let index = 0; index < response.date.length; index++) {
        //   const element = response.data[index];

        //   console.log("Fetching applications from API..." + element);
        // }
        // console.log(
        //   "Fetching applications from API..." +
        //     response?.data[12]?.mobile_number
        // );
      } catch (error) {
        console.log("Error fetching applications from API...");
      }
    };

    fetchData();
  }, []);
  console.log(selectedClaim);
  return (
    <Card className="border border-gray-200 py-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Insurance Claims
        </CardTitle>
        <p className="text-sm text-gray-600">
          {claimData.length > 1
            ? `${claimData.length} claims`
            : `${claimData.length} claim`}{" "}
          found
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Claim Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Insurance No.
                </th>
                {/* <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Asset & Damage
                </th> */}
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Sum Insured
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Premium Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Period
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Insurance Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {claimData.map((claim, idx) => (
                <tr
                  key={claim.id}
                  className="border-b border-gray-100 hover:bg-gray-50 animate__animated animate__fadeIn"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <td className="py-4 px-4 text-sm">
                    <div className="font-medium text-blue-600">
                      {formatDate(claim.claim_date)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <div className=" text-gray-900">
                      {claim.insurance_number}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-sm">
                    <span className=" font-medium text-gray-900">
                      ৳ {formatMoney(claim.sum_insured)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    ৳ {formatMoney(claim.premium_amount)}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    {claim.period_name}
                    <p className="text-xs text-gray-500">
                      {formatDate(claim.insurance_start_date)} to{" "}
                      {formatDate(claim.insurance_end_date)}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span className=" text-gray-900">
                      {claim.insurance_type_name}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedClaim(claim)}
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
      {/* {selectedClaim && (
        <GenericModal closeModal={() => setSelectedClaim(null)}>
          <div className="w-full rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Claim Details - {selectedClaim.claimId}
                </h1>
                <p className="text-sm text-gray-500">
                  Review claim information and supporting documents
                </p>
              </div>
            </div>

            <div className="max-h-[65vh] pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Farmer</p>
                  <p className="text-base text-gray-900">
                    {selectedClaim.farmer}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Asset</p>
                  <p className="text-base text-gray-900">
                    {selectedClaim.asset}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Damage Type
                  </p>
                  <p className="text-base text-gray-900">
                    {selectedClaim.damage}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Claim Amount
                  </p>
                  <p className="text-base text-gray-900 font-semibold">
                    {selectedClaim.amount}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-500">
                  Description
                </p>
                <p className="text-base text-gray-900 mt-1">
                  No additional description provided.
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-500 mb-2">
                  Supporting Documents
                </p>
                <div className="space-y-3">
                  {[
                    { name: "assessment_report.pdf", type: "pdf" },
                    { name: "satellite_images.jpg", type: "image" },
                  ].map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3 bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        {doc.type === "pdf" ? (
                          <FileText className="w-4 h-4 text-blue-500" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="text-sm text-gray-800">
                          {doc.name}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sm px-4"
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2 mt-6 flex-wrap">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <UserIcon className="w-4 h-4" /> Assign Assessor
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-50"
              >
                <CheckCircle className="w-4 h-4 mr-1" /> Approve
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-red-600 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-1" /> Reject
              </Button>
            </div>
          </div>
        </GenericModal>
      )} */}
      {selectedClaim && (
        <GenericModal
          closeModal={() => setSelectedClaim(null)}
          title="Claim Details"
        >
          <ClaimDetailsModal data={selectedClaim} />
        </GenericModal>
      )}
    </Card>
  );
}
