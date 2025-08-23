"use client";

import {
  FaBuilding,
  FaDollarSign,
  FaUser,
  FaRegUser,
  FaVenusMars,
  FaRegBuilding,
} from "react-icons/fa";
import {
  MdCalendarToday,
  MdOutlineCalendarToday,
  MdOutlineColorLens,
  MdOutlineHealthAndSafety,
} from "react-icons/md";
import { RxIdCard } from "react-icons/rx";
import { LuSyringe } from "react-icons/lu";
import { AiOutlineNumber } from "react-icons/ai";
import { BsTextIndentRight, BsInfoCircle } from "react-icons/bs";
import {
  HiDocumentText,
  HiOutlineCube,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { FaPercentage } from "react-icons/fa";
import Image from "next/image";
import { formatDate, formatMoney } from "../claims-management-table";
import { useState } from "react";
import placeholder from "/public/document_placeholder.jpg";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  application: LivestockInsurance;
}

export default function ApplicationDetailsModal({ application }: ModalProps) {
  const [imgSrc, setImgSrc] = useState(application.special_mark || placeholder);
  console.log(imgSrc);
  console.log(
    `${process.env.NEXT_PUBLIC_API_BASE_IMAGE_URL}/${application.special_mark}`
  );

  return (
    <div className="flex flex-col min-h-full items-center justify-center p-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 overflow-x-hidden overflow-y-auto md:overflow-y-hidden max-h-[80vh] md:max-h-auto w-full">
        {/* Left Sticky Panel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 md:col-span-2 shadow-xs md:sticky md:top-0 h-full md:self-start overflow-y-scroll md:max-h-[80vh]">
          <div className="flex flex-col gap-8 items-center h-full">
            {/* Image */}
            <div className="bg-gray-100 flex items-center justify-center rounded-lg w-full">
              {application.special_mark ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_IMAGE_URL}/${application.special_mark}`}
                  alt={"Image"}
                  width={256}
                  height={256}
                  className="object-contain w-32 h-72"
                  onError={() => setImgSrc(placeholder)}
                />
              ) : (
                <span className="text-sm text-gray-400">
                  No Image Available
                </span>
              )}
            </div>

            <div className="w-full space-y-3">
              <CowCardData
                label="Name"
                value={application.name}
                icon={<FaRegUser size={16} />}
              />
              <CowCardData
                label="Reference ID"
                value={application.reference_id}
                icon={<AiOutlineNumber size={20} />}
              />
              <CowCardData
                label="Asset Type"
                value={application.asset_type}
                icon={<HiOutlineCube size={20} />}
              />
              <CowCardData
                label="Color"
                value={application.color}
                icon={<MdOutlineColorLens size={20} />}
              />
              <CowCardData
                label="Gender"
                value={
                  application.gender.charAt(0).toUpperCase() +
                  application.gender.slice(1)
                }
                icon={<FaVenusMars size={20} />}
              />
              {/* <CowCardData
    label="Special Mark"
    value={application.special_mark}
    icon={<HiOutlineTag />} // Tag/size={20}Mark
  /> */}
              <CowCardData
                label="Health Issues"
                value={
                  application.health_issues === ""
                    ? "N/A"
                    : application.health_issues
                }
                icon={<MdOutlineHealthAndSafety size={20} />}
              />
              <CowCardData
                label="Current Status"
                value={application.current_status}
                icon={<BsInfoCircle size={18} />}
              />
            </div>
          </div>
        </div>

        {/* Right Scrollable Content */}
        <div className="md:col-span-3 space-y-5 md:max-h-[80vh] md:overflow-y-auto">
          {/* Ownership */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<FaUser className="text-blue-600" />}
              header="Ownership"
            />
            <div className="grid sm:grid-cols-2 gap-8 mt-8">
              <DetailsSection
                label="Owner ID"
                value={application.owner_id}
                icon={<FaRegUser />}
                className="text-blue-700 bg-blue-200"
              />
              {/* <DetailsSection
        label="Created By"
        value={application.created_by_id}
        icon={<FaUser />}
        className="text-blue-700 bg-blue-200"
      /> */}
              {/* <DetailsSection
        label="Updated By"
        value={application.updated_by_id || "N/A"}
        icon={<FaUser />}
        className="text-blue-700 bg-blue-200"
      /> */}
              <DetailsSection
                label="Insurance Agent"
                value={application.insurance_agent || "N/A"}
                icon={<FaRegUser />}
                className="text-blue-700 bg-blue-200"
              />
            </div>
          </div>

          {/* Location */}
          {/* <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
    <ModalHeader icon={<MdOutlineLocationOn className="text-green-600" />} header="Location" />
    <div className="grid sm:grid-cols-2 gap-8 mt-8">
      <DetailsSection
        label="Latitude"
        value={application.latitude}
        icon={<MdOutlineLocationOn />}
        className="text-green-700 bg-green-200"
      />
      <DetailsSection
        label="Longitude"
        value={application.longitude}
        icon={<MdOutlineLocationOn />}
        className="text-green-700 bg-green-200"
      />
    </div>
  </div> */}

          {/* Timestamps */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<MdCalendarToday className="text-yellow-600" />}
              header="Timestamps"
            />
            <div className="grid sm:grid-cols-2 gap-8 mt-8">
              {/* <DetailsSection
        label="Created At"
        value={application.created_at}
        icon={<MdOutlineCalendarToday />}
        className="text-yellow-700 bg-yellow-200"
      /> */}
              {/* <DetailsSection
        label="Updated At"
        value={application.updated_at}
        icon={<MdOutlineCalendarToday />}
        className="text-yellow-700 bg-yellow-200"
      /> */}
              {/* <DetailsSection
        label="Status Created At"
        value={application.status_created_at}
        icon={<MdOutlineCalendarToday />}
        className="text-yellow-700 bg-yellow-200"
      /> */}
              <DetailsSection
                label="Last Vaccination"
                value={formatDate(application.last_vaccination_date)}
                icon={<MdOutlineCalendarToday />}
                className="text-yellow-700 bg-yellow-200"
              />
              <DetailsSection
                label="Last Deworming"
                value={formatDate(application.last_deworming_date)}
                icon={<MdOutlineCalendarToday />}
                className="text-yellow-700 bg-yellow-200"
              />
              <DetailsSection
                label="Insurance Start Date"
                value={formatDate(application.insurance_start_date)}
                icon={<MdOutlineCalendarToday />}
                className="text-yellow-700 bg-yellow-200"
              />
              <DetailsSection
                label="Insurance End Date"
                value={formatDate(application.insurance_end_date)}
                icon={<MdOutlineCalendarToday />}
                className="text-yellow-700 bg-yellow-200"
              />
            </div>
          </div>

          {/* Health & Care */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<LuSyringe className="text-red-600" />}
              header="Health & Care"
            />
            <div className="grid sm:grid-cols-2 gap-8 mt-8">
              <DetailsSection
                label="Vaccine Status"
                value={application.vaccine_status}
                icon={<LuSyringe />}
                className="text-red-700 bg-red-200"
              />
              <DetailsSection
                label="Deworming Status"
                value={application.deworming_status}
                icon={<LuSyringe />}
                className="text-red-700 bg-red-200"
              />
            </div>
          </div>

          {/* Insurance Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<HiDocumentText className="text-purple-600" />}
              header="Insurance Details"
            />
            <div className="grid sm:grid-cols-2 gap-8 mt-8">
              <DetailsSection
                label="Insurance Number"
                value={application.insurance_number}
                icon={<AiOutlineNumber />}
                className="text-purple-700 bg-purple-200"
              />
              <DetailsSection
                label="Insurance Status"
                value={
                  application.insurance_status.charAt(0).toUpperCase() +
                  application.insurance_status.slice(1)
                }
                icon={<RxIdCard />}
                className="text-purple-700 bg-purple-200"
              />
              <DetailsSection
                label="Insurance Category"
                value={application.insurance_category}
                icon={<HiOutlineDocumentText />}
                className="text-purple-700 bg-purple-200"
              />
              {/* <DetailsSection
        label="Insurance Category ID"
        value={application.insurance_category_id}
        icon={<HiOutlineDocumentText />}
        className="text-purple-700 bg-purple-200"
      /> */}
              {/* <DetailsSection
        label="Insurance Type ID"
        value={application.insurance_type_id}
        icon={<HiOutlineDocumentText />}
        className="text-purple-700 bg-purple-200"
      /> */}
              <DetailsSection
                label="Insurance Type Name"
                value={application.insurance_type_name}
                icon={<HiOutlineDocumentText />}
                className="text-purple-700 bg-purple-200"
              />
              {/* <DetailsSection
        label="Insurance Period ID"
        value={application.insurance_period_id}
        icon={<HiOutlineDocumentText />}
        className="text-purple-700 bg-purple-200"
      /> */}
              <DetailsSection
                label="Period Name"
                value={application.period_name}
                icon={<HiOutlineDocumentText />}
                className="text-purple-700 bg-purple-200"
              />
              <DetailsSection
                label="Product Terms"
                value={application.product_terms || "N/A"}
                icon={<HiOutlineDocumentText />}
                className="text-purple-700 bg-purple-200"
              />
              {/* <DetailsSection
        label="Reference ID"
        value={application.reference_id}
        icon={<HiOutlineDocumentText />}
        className="text-purple-700 bg-purple-200"
      /> */}
              <DetailsSection
                label="Insurance Certificate"
                value={application.insurance_certificate || "N/A"}
                icon={<HiOutlineDocumentText />}
                className="text-purple-700 bg-purple-200"
              />
              {/* <DetailsSection
        label="Insurance Provider ID"
        value={application.insurance_provider_id}
        icon={<HiOutlineDocumentText />}
        className="text-purple-700 bg-purple-200"
      /> */}
            </div>
          </div>

          {/* Financials */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<FaDollarSign className="text-green-600" />}
              header="Financials"
            />
            <div className="grid sm:grid-cols-2 gap-8 mt-8">
              <DetailsSection
                label="Sum Insured"
                value={formatMoney(application.sum_insured)}
                icon={<FaDollarSign />}
                className="text-green-700 bg-green-200"
              />
              <DetailsSection
                label="Premium Amount"
                value={formatMoney(application.premium_amount)}
                icon={<FaDollarSign />}
                className="text-green-700 bg-green-200"
              />
              <DetailsSection
                label="Premium Percentage"
                value={application.premium_percentage}
                icon={<FaPercentage />}
                className="text-green-700 bg-green-200"
              />
            </div>
          </div>

          {/* Insurance Company */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<FaBuilding className="text-indigo-600" />}
              header="Insurance Company"
            />
            <div className="grid sm:grid-cols-2 gap-8 mt-8">
              {/* <DetailsSection
        label="Company ID"
        value={application.insurance_company_id}
        icon={<FaBuilding />}
        className="text-indigo-700 bg-indigo-200"
      /> */}
              <DetailsSection
                label="Company Name"
                value={application.insurance_company_name}
                icon={<FaRegBuilding />}
                className="text-indigo-700 bg-indigo-100"
              />
              {/* <DetailsSection
                label="Company User ID"
                value={application.insurance_company_user_id}
                icon={<FaBuilding />}
                className="text-indigo-700 bg-indigo-200"
              /> */}
              {/* <DetailsSection
        label="Insurance Product ID"
        value={application.insurance_product_id}
        icon={<FaBuilding />}
        className="text-indigo-700 bg-indigo-200"
      /> */}
            </div>
          </div>

          {/* Other Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<RxIdCard className="text-pink-600" />}
              header="Other Information"
            />
            <div className="grid sm:grid-cols-2 gap-8 mt-8">
              <DetailsSection
                label="Is Claimed"
                value={application.is_claimed ? "Yes" : "No"}
                icon={<RxIdCard />}
                className="text-pink-700 bg-pink-200"
              />
              {/* <DetailsSection
        label="View Count"
        value={application.view_count}
        icon={<RxIdCard />}
        className="text-pink-700 bg-pink-200"
      /> */}
              <DetailsSection
                label="Renewal Reminder Sent"
                value={application.renewal_reminder_sent ? "Yes" : "No"}
                icon={<RxIdCard />}
                className="text-pink-700 bg-pink-200"
              />
              <DetailsSection
                label="Remarks"
                value={application.remarks || "N/A"}
                icon={<RxIdCard />}
                className="text-pink-700 bg-pink-200"
              />
              {/* <DetailsSection
                label="Asset ID"
                value={application.asset_id}
                icon={<RxIdCard />}
                className="text-pink-700 bg-pink-200"
              /> */}
              {/* <DetailsSection
                           label="Asset Type"
                           value={application.asset_type}
                           icon={<RxIdCard />}
                           className="text-pink-700 bg-pink-200"
                            /> */}
            </div>
          </div>
          {/* Remarks
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <ModalHeader
              icon={<BsTextIndentRight className="text-yellow-600" />}
              header="Remarks"
            />
            <div className="grid sm:grid-cols-2 gap-8 mt-8">
              <DetailsSection
                label="Remarks"
                value={application.remarks || "N/A"}
                icon={<BsTextIndentRight />}
                className="text-yellow-700 bg-yellow-200"
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

/* --- Sub Components --- */
interface HeaderProps {
  icon: React.ReactNode;
  header: string;
}
interface DetailsProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number | undefined;
  text?: string;
  className?: string;
}

const ModalHeader = ({ icon, header }: HeaderProps) => (
  <div className="flex items-center gap-2">
    <span className="text-xl text-gray-800">{icon}</span>
    <h4 className="font-semibold text-lg text-gray-800">{header}</h4>
  </div>
);

const DetailsSection = ({
  icon,
  label,
  value,
  text,
  className,
}: DetailsProps) => (
  <div className="flex items-center gap-2">
    <div>
      {icon && (
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
            className ? className : "text-gray-600 bg-gray-100"
          }`}
        >
          {icon}
        </span>
      )}
    </div>
    <div className="flex flex-col justify-between w-full">
      <label className="text-sm text-gray-500">{label}</label>
      <span className="font-bold text-[#4e4e4e]">
        <span className="">{value}</span> {text}
      </span>
    </div>
  </div>
);

const CowCardData = ({ icon, label, value }: DetailsProps) => (
  <div className="flex items-center gap-2">
    {icon && (
      <span className="text-green-700 w-9 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        {icon}
      </span>
    )}
    <div className="flex justify-between items-center w-full px-1">
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <span className="font-semibold text-gray-700">
        <span className="px-3 py-1 border border-gray-200 rounded-full">
          {value}
        </span>
      </span>
    </div>
  </div>
);
