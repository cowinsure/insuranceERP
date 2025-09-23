"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Eye, FileText, Banknote, XCircle } from "lucide-react";
import { use, useEffect, useState } from "react";
import GenericModal from "./ui/GenericModal";
import useApi from "@/hooks/use_api";
import { json } from "stream/consumers";
import { DateUtils } from "./utils/DateUtils";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import TransactionDetailsDialog from "./dialogs/applications/TransactionDetailsDialog";
import ApplicationDetailsModal from "./ui/ApplicationDetailsModal";
import { formatDate } from "./claims-management-table";
import Pagination from "./utils/Pagination";
import { SearchFilter } from "./utils/SearchFilter"; // ✅ integrated search component

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

const statusOptions = [
  { value: "under-review", label: "Under Review", color: "text-blue-600" },
  {
    value: "pending-documents",
    label: "Pending Documents",
    color: "text-yellow-600",
  },
  { value: "approved", label: "Approved", color: "text-green-600" },
  { value: "rejected", label: "Rejected", color: "text-red-600" },
  { value: "on-hold", label: "On Hold", color: "text-orange-600" },
  {
    value: "requires-revision",
    label: "Requires Revision",
    color: "text-purple-600",
  },
];

const getStatusBadge = (status: string) => {
  const variants = {
    pending: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    under_review: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    approved: "bg-green-100 text-green-800 hover:bg-green-100",
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    rejected: "bg-red-100 text-red-800 hover:bg-red-100",
  };
  return (
    variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  );
};

export function ApplicationsTable() {
  // =============================
  // State Management
  // =============================

  const [selectedapplication, setSelectedApplication] = useState<
    (typeof applications)[0] | null
  >(null);

  const [selectedApplicationDialog, setSelectedApplicationDialog] =
    useState<LivestockInsurance | null>(null);

  const [
    selectedApplicationDetailsDialog,
    setSelectedApplicationDetailsDialog,
  ] = useState<LivestockInsurance | null>(null);

  const [selectedapplications, setSelectedapplications] = useState<string>("");

  const [selectedapplicationView, setSelectedapplicationView] =
    useState<LivestockInsurance | null>(null);

  const [selectedapplicationsStatus, setSelectedapplicationsStatus] =
    useState<string>("");

  const [insuranceApplications, setInsuranceApplications] = useState<
    LivestockInsurance[]
  >([]);
  const [filteredApplications, setFilteredApplications] = useState<
    LivestockInsurance[]
  >([]); // ✅ for search filter

  const [insuranceStatus, setInsuranceStatus] = useState<InsuranceStatus[]>([]);

  const [formData, setFormData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [open, setOpen] = useState(false);

  // =============================
  // Pagination functions
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "All">(6);

  const totalPages =
    pageSize === "All"
      ? 1
      : Math.ceil(filteredApplications.length / (pageSize as number));

  const paginatedApplications =
    pageSize === "All"
      ? filteredApplications
      : filteredApplications.slice(
          (currentPage - 1) * (pageSize as number),
          currentPage * (pageSize as number)
        );
  // =============================

  // =============================
  // API Setup
  // =============================
  const { get: allapplication } = useApi();
  const { get: fetchStatus } = useApi();
  const {
    put: postData,
    loading: postDataLoading,
    error: postError,
  } = useApi();

  // =============================
  // Utility Functions
  // =============================

  const getStatusColor = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option?.color || "text-gray-600";
  };

  const handlesubmit = async () => {
    if (!selectedStatus) {
      alert("Please select a status to update.");
      return;
    }
    try {
      // ...
    } catch (error) {
      // ...
    }
  };

  // =============================
  // Fetch Data on Mount
  // =============================

  const fetchData = async () => {
    try {
      const response = await allapplication(
        "ims/insurance-application-service/",
        {
          params: { start_record: 1 },
        }
      );
      if (response.status === "success") {
        setInsuranceApplications(response.data);
        setFilteredApplications(response.data); // ✅ also set filtered data initially
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchInsuranceStatus = async () => {
    try {
      const response = await fetchStatus("ims/insurance-status-service/", {});
      if (response.status === "success") {
        setInsuranceStatus(response.data);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchInsuranceStatus();
  }, []);

  // Reset page if data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredApplications]);

  const refreshTable = () => {
    fetchData();
  };

  return (
    <>
      <div className="">
        <SearchFilter
          placeholder="Search by Insurance No., Name, Color or Type"
          data={insuranceApplications}
          setFilteredData={setFilteredApplications}
          searchKeys={[
            "insurance_number",
            "name",
            "color",
            "insurance_type_name",
          ]}
        />
      </div>

      <Card className="border border-gray-200 py-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Insurance Applications
          </CardTitle>
          <p className="text-sm text-gray-600">
            {filteredApplications.length} applications found
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
                  {/* <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Farmer Details
                </th> */}
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Asset Info
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
              <tbody className="overflow-hidden">
                {paginatedApplications.map((application, idx) => (
                  <tr
                    key={application.id}
                    className="border-b border-gray-100 hover:bg-gray-50  animate__animated animate__fadeIn"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium text-blue-600">
                        {application.insurance_number}
                      </span>
                    </td>
                    {/* <td className="py-4 px-4"> */}
                    {/* <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {application.location}
                        </span>
                      </div>
                    </div> */}
                    {/* </td> */}
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-sm text-gray-900">
                          {application.name}-{application.color}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-gray-900">
                        {application.insurance_type_name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        className={getStatusBadge(application.insurance_status)}
                      >
                        {application.insurance_status === "active"
                          ? "Active"
                          : application.insurance_status === "pending"
                          ? "Pending"
                          : "Under Review"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {formatDate(application.created_at)}
                        {/* {application.created_at} */}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedapplicationView(application);
                          setSelectedApplicationDetailsDialog(application);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setOpen(true);
                          setSelectedapplications(application.id.toString());
                          setSelectedapplicationsStatus(
                            application.insurance_status
                          );
                        }}
                      >
                        <Banknote className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={pageSize}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1); // reset page to 1
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
        {selectedApplicationDialog && (
          <GenericModal closeModal={() => setSelectedApplication(null)}>
            <div className="w-full rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Application Review - {selectedApplicationDialog.asset_id}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Review application details and supporting documents
                  </p>
                </div>
              </div>

              <div className="max-h-[65vh] pr-2 space-y-6 overflow-auto">
                {/* <div className="border rounded-md p-4">
                <p className="font-medium text-gray-800 mb-2">
                  👨‍🌾 Farmer Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="text-gray-900">
                      {selectedApplicationDialog.farmer}
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
              </div> */}

                <div className="border rounded-md p-4">
                  <p className="font-medium text-gray-800 mb-2">
                    📋 Asset Details
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Asset Type</p>
                      <p className="text-gray-900">
                        {selectedApplicationDialog.asset_type}
                      </p>
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
                        {selectedApplicationDialog.insurance_type_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Application Date</p>
                      <p className="text-gray-900">
                        {selectedApplicationDialog.insurance_start_date}
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
                <div className="border rounded-md p-4">
                  {/* Status Update Section */}
                  <div className="space-y-4  pt-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="status"
                        className="text-sm font-medium text-gray-900"
                      >
                        Update Application Status
                      </Label>
                      <Select
                        value={selectedStatus}
                        onValueChange={(value) => {
                          setSelectedStatus(value);
                          setFormData({
                            ...formData,
                            current_status_id: value,
                          });
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select new status..." />
                        </SelectTrigger>
                        <SelectContent>
                          {insuranceStatus.map((option) => (
                            <SelectItem
                              key={option.insurance_status_id}
                              value={option.insurance_status_id.toString()}
                            >
                              <span>{option.status_name}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedStatus && (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-sm text-gray-600">
                          Status will be updated to:{" "}
                          <span
                            className={`font-medium ${getStatusColor(
                              selectedStatus
                            )}`}
                          >
                            {
                              insuranceStatus.find(
                                (opt) =>
                                  opt.insurance_status_id.toString() ===
                                  selectedStatus
                              )?.status_name
                            }
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-2 mt-4 flex-wrap">
                <Button
                  onClick={() => {}}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Update Status
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedApplication(null)}
                  className="w-full sm:w-auto border-red-600 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Cancel
                </Button>
              </div>
            </div>
          </GenericModal>
        )}
        {selectedApplicationDetailsDialog && (
          <GenericModal
            closeModal={() => setSelectedApplicationDetailsDialog(null)}
            title="Application Details"
          >
            <ApplicationDetailsModal
              application={selectedApplicationDetailsDialog}
              onSuccess={refreshTable}
            />
          </GenericModal>
        )}

        {open && (
          <GenericModal closeModal={() => setOpen(false)}>
            <TransactionDetailsDialog
              isOpen={open}
              onClose={() => setOpen(false)}
              assetInsuranceId={selectedapplications?.toString()}
              applicationStatus={selectedapplicationsStatus}
            />
          </GenericModal>
        )}
      </Card>
    </>
  );
}
