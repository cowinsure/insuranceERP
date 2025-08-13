"use client"

import { use, useEffect, useState } from "react"
import { Shield, Calendar, CreditCard, Hash, Building2, FileText, User, Receipt, Eye, Download, DollarSign, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "../../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import useApi from "@/hooks/use_api"
import { Transaction } from "@/components/model/applications/TransactionModel"
import InputField from "@/components/ui/InputField"
import { se } from "date-fns/locale"
import { on } from "events"
import { toast } from "sonner"

// Sample transaction data
const transactionData = {
  transactionId: "TXN-2024-001234",
  amount: "₹25,000.00",
  date: "2024-01-15",
  type: "Cheque",
  through: "State Bank of India",
  remarks: "Payment for land registration fees and processing charges",
  createdBy: "John Doe",
  receiptImage: "/placeholder.svg?height=400&width=300",
}

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assetInsuranceId: string;
  applicationStatus: string;
}
const statusOptions = [
  { value: "under-review", label: "Under Review", color: "text-blue-600" },
  { value: "pending-documents", label: "Pending Documents", color: "text-yellow-600" },
  { value: "approved", label: "Approved", color: "text-green-600" },
  { value: "rejected", label: "Rejected", color: "text-red-600" },
  { value: "on-hold", label: "On Hold", color: "text-orange-600" },
  { value: "requires-revision", label: "Requires Revision", color: "text-purple-600" },
]

interface FormData {
  id: string | number;
  current_status_id: string;
  remarks: string

}

export default function TransactionDetailsDialog({ isOpen, onClose, assetInsuranceId, applicationStatus }: PaymentDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const { get } = useApi();
  const { get: FetchPurchaseData, loading, error: fetchdataError } = useApi();
  const { put: postData, loading: postDataLoading, error: postError } = useApi();
  const [insuranceStatus, setInsuranceStatus] = useState<InsuranceStatus[]>([]);
  const [paymentData, setPaymentData] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState<FormData>({
    id: assetInsuranceId,
    current_status_id: selectedStatus,
    remarks: ""
  });

 


  const getStatusColor = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status)
    return option?.color || "text-gray-600"
  }



  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "cheque":
        return "bg-blue-100 text-blue-800"
      case "cash":
        return "bg-green-100 text-green-800"
      case "online":
        return "bg-purple-100 text-purple-800"
      case "dd":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
  }
  useEffect(() => {
    const fetchInsuranceStatus = async () => {

      try {
        const response = await get("ims/insurance-status-service/", {


        });
        console.log("Response from API:", response.status);

        if (response.status === "success") {
          setInsuranceStatus(response.data);
        }
        console.log("Fetching applications from API..." + response.data);

      } catch (error) {
        console.log("Error fetching applications from API...", error);
      }

    };


    fetchInsuranceStatus()
  }, [])

  useEffect(() => {
    const fetchPaymentData = async () => {

      try {
        const response = await FetchPurchaseData(`ims/insurance-payment-service/?start_record=${1}&page_size=${10}&asset_insurance_id=${assetInsuranceId}`, {


        });
        console.log("Response from API:", response.status);

        if (response.status === "success") {
          setPaymentData(response.data);
        }
        console.log("Fetching applications from API..." + JSON.stringify(response));

      } catch (error) {
        console.log("Error fetching applications from API...", error);
      }

    };
    fetchPaymentData()
  }, [])

  console.log(fetchdataError);

  const handleStatusChange = async () => {

    // Handle status change logic here  
    console.log("Form Data to be sent:", formData);
    try {
      const response = await postData("ims/insurance-status-history-service/", {
        id: assetInsuranceId,
        remarks: formData.remarks,
        current_status_id: selectedStatus
      } );
      console.log("Response from API:", JSON.stringify(response));

      if (response.status === "success") {
        onClose(); // Close the dialog on success
        toast.success("Status updated successfully!");
        // setInsuranceStatus(response.data);
      }
      console.log("Updating Status applications from API..." + response.data);

    } catch (error) {
      console.log("Error Updating Status applications from API...", error);
    }




  }

  return (

    <>
      {loading && <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>}
      {fetchdataError && <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Payment Data not available.</div>
      </div>}
      {!loading && !fetchdataError && (
        <>
          <div className="flex   justify-between gap-2 py-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Transaction Details</h2>
            </div>


            <div className="flex  items-center gap-2">
              {/* <p className="text-xs font-medium text-gray-500 uppercase ">Status</p> */}
              <Shield className="h-5 w-5 text-blue-600" />
              <Badge variant={"default"} className={`text-xs ${getStatusBadge(applicationStatus)}`}>{applicationStatus}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 pb-4">

            <h2 className="text-lg font-medium text-gray-600"> View complete transaction information and receipt</h2>
          </div>
          <div className="space-y-6 max-h-[500px] overflow-auto">
            {/* Transaction Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Transaction ID */}
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <Hash className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Transaction ID</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{paymentData[0]?.trx_id}</p>
                </div>
              </div>
              {/* insurance ID */}
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <Hash className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Insurance ID</p>
                  <p className="text-sm font-semibold text-gray-900">{paymentData[0]?.insurance_number}</p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</p>
                  {paymentData[0]?.amount && <p className="text-sm font-semibold text-green-600">{paymentData[0]?.amount}</p>}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {paymentData[0]?.trx_date
                      ? new Date(paymentData[0].trx_date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Type */}
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</p>
                  <Badge className={`text-xs ${getTypeColor(paymentData[0]?.trx_type ?? "")}`}>{paymentData[0]?.trx_type}</Badge>
                </div>
              </div>

              {/* Through */}
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Through</p>
                  <p className="text-sm font-semibold text-gray-900">{paymentData[0]?.trx_through}</p>
                </div>
              </div>

              {/* Created By */}
              {/* <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex-shrink-0">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created By</p>
                <p className="text-sm font-semibold text-gray-900">{transactionData.createdBy}</p>
              </div>
            </div> */}
            </div>

            {/* Remarks Section */}
            {paymentData[0]?.remarks && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <h3 className="text-sm font-medium text-gray-900">Remarks</h3>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-700">{paymentData[0]?.remarks}</p>
                </div>
              </div>
            )}


            {/* Money Receipt Image Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-900">Money Receipt</h3>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">receipt_image.jpg</span>
                    {/* <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div> */}
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <img
                    src={transactionData.receiptImage || "/placeholder.svg"}
                    alt="Money Receipt"
                    className="w-full max-w-md mx-auto rounded-lg shadow-sm border border-gray-200"
                  />
                </div>
              </div>
              <div className="border rounded-md p-4">
                {/* Status Update Section */}
                <div className="space-y-4  pt-4">
                  <div className="space-y-3">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-900">
                      Update Application Status
                    </Label>
                    <Select value={selectedStatus} 
                    onValueChange={(value) => {
                      setSelectedStatus(value);
                      setFormData({ ...formData, current_status_id: value });
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select new status..." />
                      </SelectTrigger>
                      <SelectContent>
                        {insuranceStatus?.map((option: InsuranceStatus) => (
                          <SelectItem key={option.insurance_status_id} value={option.insurance_status_id.toString()}>
                            <span >{option.status_name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedStatus && (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-600">
                        Status will be updated to:{" "}
                        <span className={`font-medium ${getStatusColor(selectedStatus)}`}>
                          {insuranceStatus.find((opt: InsuranceStatus) => opt.insurance_status_id.toString() === selectedStatus)?.status_name}
                        </span>
                      </p>
                    </div>
                  )}
                  <InputField
                    id="remarks"
                    label="remarks"
                    name="remarks"
                    onChange={(event) => {
                      setFormData({ ...formData, remarks: event.target.value })
                    }}
                    value={formData.remarks}
                    placeholder="Enter weight"
                    type="text"
                  />
                </div>
              </div>
            </div>


          </div>
          {/* Action Buttons */}
          <div className="flex justify-between gap-2 mt-4 flex-wrap">
            <Button onClick={
              () => {
                handleStatusChange();
              }
            }
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="w-4 h-4 mr-2" /> Update Status


            </Button>
            {postDataLoading && <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>}
            <Button
              variant="outline"
              className="w-full sm:w-auto border-red-600 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" /> Cancel
            </Button>
          </div>
        </>


      )}



    </>

  )
}
