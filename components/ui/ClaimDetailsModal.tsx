"use client";

import React, { useState } from "react";
import {
  FaDollarSign,
  FaPercentage,
  FaStamp,
  FaRegCheckCircle,
  FaRegQuestionCircle,
  FaRegCommentDots,
  FaRegBuilding,
  FaRegUser,
} from "react-icons/fa";
import { MdOutlineCalendarToday } from "react-icons/md";
import { HiDocumentText, HiOutlineDocumentText } from "react-icons/hi";
import { RxIdCard } from "react-icons/rx";
import Image from "next/image";
import { InsuranceClaim } from "../model/claim/InsuranceClaim";
import { formatDate, formatMoney } from "../claims-management-table";
import { TbListDetails } from "react-icons/tb";
import { CgTimer } from "react-icons/cg";
import { AiOutlineNumber } from "react-icons/ai";
import placeholder from "../../public/document_placeholder.jpg";

interface ModalProps {
  data: InsuranceClaim;
}

export default function ClaimDetailsModal({ data }: ModalProps) {
  const [imgSrc, setImgSrc] = useState(
    `https://insuranceportal-backend.insurecow.com/media/${data.claim_doc_file}` ||
      placeholder
  );
  return (
    <div className="flex flex-col min-h-full items-center justify-center p-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 overflow-x-hidden overflow-y-auto md:overflow-y-hidden max-h-[80vh] md:max-h-auto w-full">
        {/* Left Sticky Panel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 md:col-span-2 shadow-xs md:sticky md:top-0 h-full md:self-start">
          <div className="flex flex-col gap-8 items-center">
            <div className=" bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden w-full">
              {data.claim_doc_file ? (
                <Image
                  src={imgSrc}
                  alt={data.claim_file_name}
                  width={256}
                  height={256}
                  className="object-contain w-32 h-full -rotate-90"
                  onError={() => setImgSrc(placeholder)}
                />
              ) : (
                <span className="text-sm text-gray-400">
                  No Document Available
                </span>
              )}
            </div>
            <div className="w-full space-y-3">
              <CowCardData
                label="Reference ID"
                value={data.reference_id}
                icon={<RxIdCard />}
              />
              <CowCardData
                label="Claim Status"
                value={
                  data.claim_status === "claim_pending"
                    ? "Pending"
                    : data.claim_status
                }
                icon={<FaRegCheckCircle />}
              />
              <CowCardData
                label="Reason"
                value={
                  data.reason.charAt(0).toUpperCase() + data.reason.slice(1)
                }
                icon={<FaRegQuestionCircle />}
              />
              <CowCardData
                label="Remarks"
                value={
                  data.remarks
                    ? data.remarks.charAt(0).toUpperCase() +
                      data.remarks.slice(1)
                    : "N/A"
                }
                icon={<FaRegCommentDots />}
              />
              <CowCardData
                label="Is Claimed"
                value={data.is_claimed ? "Yes" : "No"}
                icon={<FaStamp />}
                className={`${
                  data.is_claimed
                    ? "bg-green-100 text-green-600 border-green-300"
                    : "text-red-600 bg-red-100 border-red-300"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right Scrollable Content */}
        <div className="md:col-span-3 space-y-5 md:max-h-[80vh] md:overflow-y-auto">
          {/* Insurance Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<HiDocumentText className="text-purple-600" />}
              header="Insurance Details"
            />
            <div className="grid sm:grid-cols-2 gap-8 mt-4">
              <DetailBadge
                label="Insurance Number"
                value={data.insurance_number}
                icon={<AiOutlineNumber />}
                className="text-purple-600 bg-purple-100"
              />
              <DetailBadge
                label="Insurance Status"
                value={
                  data.insurance_status.charAt(0).toUpperCase() +
                  data.insurance_status.slice(1)
                }
                icon={<RxIdCard />}
                className="text-purple-600 bg-purple-100"
              />
              <DetailBadge
                label="Insurance Type"
                value={data.insurance_type_name}
                icon={<HiOutlineDocumentText />}
                className="text-purple-600 bg-purple-100"
              />
              <DetailBadge
                label="Insurance Category"
                value={data.insurance_category}
                icon={<HiOutlineDocumentText />}
                className="text-purple-600 bg-purple-100"
              />
              <DetailBadge
                label="Company Name"
                value={data.insurance_company_name}
                icon={<FaRegBuilding />}
                className="text-purple-600 bg-purple-100"
              />
              <DetailBadge
                label="Insurance Agent"
                value={data.insurance_agent || "N/A"}
                icon={<FaRegUser />}
                className="text-purple-600 bg-purple-100"
              />
              <DetailBadge
                label="Start Date"
                value={formatDate(data.insurance_start_date)}
                icon={<MdOutlineCalendarToday />}
                className="text-purple-600 bg-purple-100"
              />
              <DetailBadge
                label="End Date"
                value={formatDate(data.insurance_end_date)}
                icon={<MdOutlineCalendarToday />}
                className="text-purple-600 bg-purple-100"
              />
              <DetailBadge
                label="Period"
                value={data.period_name}
                icon={<CgTimer size={20} />}
                className="text-purple-600 bg-purple-100"
              />
              <DetailBadge
                label="Product Terms"
                value={data.product_terms || "N/A"}
                icon={<HiOutlineDocumentText />}
                className="text-purple-600 bg-purple-100"
              />
            </div>
          </div>

          {/* Financials */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<FaDollarSign className="text-green-600" />}
              header="Financials"
            />
            <div className="grid sm:grid-cols-2 gap-8 mt-4">
              <DetailBadge
                label="Sum Insured"
                value={formatMoney(data.sum_insured)}
                icon={<FaDollarSign />}
                className="text-green-600 bg-green-100"
              />
              <DetailBadge
                label="Premium Amount"
                value={formatMoney(data.premium_amount)}
                icon={<FaDollarSign />}
                className="text-green-600 bg-green-100"
              />
              <DetailBadge
                label="Premium Percentage"
                value={data.premium_percentage + "%"}
                icon={<FaPercentage />}
                className="text-green-600 bg-green-100"
              />
              <DetailBadge
                label="Amount Claimed"
                value={data.amount_claimed ?? "N/A"}
                icon={<FaDollarSign />}
                className="text-green-600 bg-green-100"
              />
              <DetailBadge
                label="Amount Approved"
                value={data.amount_approved ?? "N/A"}
                icon={<FaDollarSign />}
                className="text-green-600 bg-green-100"
              />
            </div>
          </div>

          {/* Asset Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<TbListDetails className="text-pink-600" />}
              header="Asset Details"
            />
            <div className="grid sm:grid-cols-2 gap-8 mt-4">
              <DetailBadge
                label="Asset ID"
                value={data.reference_id}
                icon={<RxIdCard />}
                className="text-pink-600 bg-pink-100"
              />
              {/* <DetailBadge
                label="Asset Insurance ID"
                value={data.asset_insurance_id}
                icon={<RxIdCard />}
                className="text-pink-600 bg-pink-100"
              /> */}
            </div>
          </div>

          {/* Metadata / Audit */}
          {/* <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<FaUser className="text-blue-600" />}
              header="Metadata / Audit"
            />
            <div className="grid sm:grid-cols-2 gap-8 mt-4">
              <DetailBadge
        label="Created At"
        value={data.created_at}
        icon={<MdOutlineCalendarToday />}
      />
              <DetailBadge
        label="Created By"
        value={data.created_by_id}
        icon={<FaUser />}
      />
              <DetailBadge
        label="Updated At"
        value={data.updated_at}
        icon={<MdOutlineCalendarToday />}
      />
              <DetailBadge
        label="Updated By"
        value={data.updated_by_id ?? "N/A"}
        icon={<FaUser />}
      />
              <DetailBadge
                label="View Count"
                value={data.view_count}
                icon={<RxIdCard />}
                className="text-blue-600 bg-blue-100"
              />
              <DetailBadge
                label="Renewal Reminder Sent"
                value={data.renewal_reminder_sent ? "Yes" : "No"}
                icon={<RxIdCard />}
                className="text-blue-600 bg-blue-100"
              />
            </div>
          </div> */}

          {/* Claim Document */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<HiDocumentText className="text-yellow-600" />}
              header="Claim Document"
            />
            <div className="mt-4 flex items-center justify-center">
              <Image
                src={imgSrc}
                alt={data.claim_doc_file}
                width={256}
                height={256}
                className="object-cover w-48 h-full rounded-lg"
                onError={() => setImgSrc(placeholder)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Sub Components --- */
interface BadgeProps {
  label: string;
  value: string | number | boolean;
  icon?: React.ReactNode;
  className?: string;
}
interface HeaderProps {
  icon: React.ReactNode;
  header: string;
}

const DetailBadge = ({ label, value, icon, className }: BadgeProps) => (
  <div className="flex items-center gap-2">
    {icon && (
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
          className ? className : "text-gray-600 bg-gray-100"
        }`}
      >
        {icon}
      </span>
    )}
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-bold text-[#4e4e4e]">{value}</span>
    </div>
  </div>
);

const ModalHeader = ({ icon, header }: HeaderProps) => (
  <div className="flex items-center gap-2 mb-8">
    <span className="text-xl text-gray-800">{icon}</span>
    <h4 className="font-semibold text-lg text-gray-800">{header}</h4>
  </div>
);

const CowCardData = ({ icon, label, value, className }: BadgeProps) => (
  <div className="flex items-center gap-2">
    {icon && (
      <span className="text-green-700 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        {icon}
      </span>
    )}
    <div className="flex justify-between items-center w-full px-1">
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <span className="font-semibold ">
        <span
          className={`px-3 py-1 border border-gray-200 text-gray-700 rounded-full ${className}`}
        >
          {value}
        </span>
      </span>
    </div>
  </div>
);
