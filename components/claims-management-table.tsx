"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import GenericModal from "./ui/GenericModal";
import useApi from "@/hooks/use_api";
import { InsuranceClaim } from "./model/claim/InsuranceClaim";
import ClaimDetailsModal from "./ui/ClaimDetailsModal";
import Pagination from "./utils/Pagination";
import { SearchFilter } from "@/components/utils/SearchFilter"; // ✅ Import it

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
  const [filteredClaims, setFilteredClaims] = useState<InsuranceClaim[]>([]); // ✅
  const { get } = useApi();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "All">(6);

  // Pagination calculation based on filteredClaims
  const totalPages =
    pageSize === "All"
      ? 1
      : Math.ceil(filteredClaims.length / (pageSize as number));

  const paginatedClaims =
    pageSize === "All"
      ? filteredClaims
      : filteredClaims.slice(
          (currentPage - 1) * (pageSize as number),
          currentPage * (pageSize as number)
        );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get("ims/insurance-claim-service/", {
          params: {
            start_record: 1,
            asset_insurance_id: -1,
          },
        });

        if (response.status === "success") {
          setClaimData(response.data);
          setFilteredClaims(response.data); // ✅ Initialize filtered data
        }
      } catch (error) {
        console.error("Error fetching insurance claims:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="">
        <SearchFilter
          placeholder="Search by Insurance No., Type, or Period..."
          data={claimData}
          setFilteredData={setFilteredClaims}
          searchKeys={[
            "insurance_number",
            "insurance_type_name",
            "period_name",
          ]}
        />
      </div>
      <Card className="border border-gray-200 py-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Insurance Claims
          </CardTitle>
          <p className="text-sm text-gray-600">
            {filteredClaims.length > 1
              ? `${filteredClaims.length} claims`
              : `${filteredClaims.length} claim`}{" "}
            found
          </p>
        </CardHeader>
        <CardContent>
          {/* Table */}
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
                {paginatedClaims.map((claim, idx) => (
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
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {claim.insurance_number}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      ৳ {formatMoney(claim.sum_insured)}
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
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {claim.insurance_type_name}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>
        </CardContent>

        {/* Claim details modal */}
        {selectedClaim && (
          <GenericModal
            closeModal={() => setSelectedClaim(null)}
            title="Claim Details"
          >
            <ClaimDetailsModal data={selectedClaim} />
          </GenericModal>
        )}
      </Card>
    </>
  );
}

{
  // #001
  /* {selectedClaim && (
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
      )} */
}
