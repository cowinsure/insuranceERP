"use client";
import RegisterCrop from "@/components/addCropForms/RegisterCrop";
// import AddCrop from "@/components/AddCropDetailsModal";
import { Button } from "@/components/ui/button";
import GenericModal from "@/components/ui/GenericModal";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

const CropsPage = () => {
  const [isModal, setIsModal] = React.useState(false);
  const [crops, setCrops] = useState<
    Array<{
      crop_name: string;
      variety: string;
      plantation_date: string;
    }>
  >([]);
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Asset Management
            </h1>
            <IoIosArrowForward size={30} />
            <h1 className="text-2xl font-bold text-gray-800">
              Crop Registration
            </h1>
          </div>
          <p className="text-gray-500 mt-1">
            Register your crop details for tracking and management
          </p>
        </div>
        <div className="flex">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => setIsModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Crop
          </Button>
        </div>
      </div>
      {/* Body */}
      <div className="flex flex-col space-y-2 border bg-white py-6 px-5 rounded-lg animate__animated animate__fadeIn">
        <p>Crop details Page</p>
      </div>
      {/* Table */}
      <div className="flex flex-col space-y-2 border bg-white py-6 px-5 rounded-lg animate__animated animate__fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Crop Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Variety
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Plantation Date
                </th>
                {/* <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">action</th> */}
              </tr>
            </thead>
            <tbody>
              <>
                {crops &&
                  crops.map((crop, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 hover:bg-gray-50  animate__animated animate__fadeIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium text-gray-900">
                              {crop.crop_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {crop.email}
                        </div> */}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {crop.variety}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            {crop.plantation_date}
                          </div>
                          {/* <div className="text-sm text-gray-500 ml-6">
                          {crop.region}
                        </div> */}
                        </div>
                      </td>
                      {/* <td className="py-4 px-4">
                      <Badge className={getStatusBadge(crop.status)}>
                        {crop.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {crop.joinDate}
                      </span>
                    </td> */}
                      {/* <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCrop(crop)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td> */}
                    </tr>
                  ))}
              </>
            </tbody>
          </table>
          {/* {totalPages > 1 && (
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
          )} */}
          {/* Here was the commented code - #001 */}
        </div>
      </div>
      {isModal && (
        <GenericModal 
          closeModal={() => setIsModal(false)}
        >
          {/* <AddCrop /> */}
          <RegisterCrop
            setCropData={setCrops}
            closeModal={() => setIsModal(false)}
          />
        </GenericModal>
      )}
    </div>
  );
};

export default CropsPage;
