"use client";
import React, { useState } from "react";
import { GiCow } from "react-icons/gi";
import { PiFlowerTulipFill } from "react-icons/pi";
import { IoMdArrowRoundBack } from "react-icons/io";
import AddCrop from "@/components/AddCropDetailsModal";

const AssetManagement = () => {
  const [isCrop, setIsCrop] = useState(false);
  const [isLivestock, setIsLivestock] = useState(false);
  console.log(isCrop, isLivestock);
  return (
    // <div className="flex-1 space-y-6 p-6">
    //   {/* Page header */}
    //   <div className="flex items-center justify-between">
    //     <div>
    //       <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
    //       <p className="text-gray-600">
    //         Manage and monitor your assets efficiently
    //       </p>
    //     </div>
    //     {/* <div className="flex">
    //       <Button className="bg-blue-500 hover:bg-blue-600 text-white">
    //         <Plus className="w-4 h-4" />
    //         Add Farmer
    //       </Button>
    //     </div> */}
    //   </div>

    //   {/* Back button */}
    //   <div className={`${isCrop || isLivestock ? "block" : "hidden"}`}>
    //     <button
    //       onClick={() => {
    //         {
    //           setIsCrop(false);
    //         }
    //         {
    //           setIsLivestock(false);
    //         }
    //       }}
    //       className="text-md text-gray-600 flex items-center justify-center gap-1 cursor-pointer hover:underline"
    //     >
    //       <IoMdArrowRoundBack size={20} className="text-blue-600" /> Back
    //     </button>
    //   </div>

    //   {/* Choose asset type to manage */}
    //   {isCrop === false && isLivestock === false && (
    //     <div className="flex flex-col space-y-2 border bg-white py-6 px-5 rounded-lg animate__animated animate__fadeIn">
    //       <h3>Choose your asset: </h3>
    //       <div className="grid md:grid-cols-2 justify-center items-center gap-4">
    //         <button
    //           className="border border-blue-200 text-gray-700 text-lg hover:bg-blue-200 hover:text-blue-900 transition-all duration-300 ease-in-out rounded-md px-3 py-20 cursor-pointer flex items-center justify-center gap-2 font-bold"
    //           onClick={() => setIsLivestock(true)}
    //         >
    //           <GiCow size={25} /> Livestock
    //         </button>
    //         <button
    //           className="border border-blue-200 text-gray-700 text-lg hover:bg-blue-200 hover:text-blue-900 transition-all duration-300 ease-in-out rounded-md px-3 py-20 cursor-pointer flex items-center justify-center gap-2 font-bold"
    //           onClick={() => setIsCrop(true)}
    //         >
    //           <PiFlowerTulipFill size={20} /> Crop
    //         </button>
    //       </div>
    //     </div>
    //   )}

    //   {/* Render asset management components based on selection */}
    //   {/* Crop */}
    //   {isCrop && (
    //     <div className="flex flex-col space-y-2 border bg-white py-6 px-5 rounded-lg h-full animate__animated animate__fadeIn">
    //       <AddCrop />
    //     </div>
    //   )}

    //   {/* Livestock */}
    //   {isLivestock && (
    //     <div className="flex flex-col space-y-2 border bg-white py-6 px-5 rounded-lg animate__animated animate__fadeIn">
    //       <h1>This is Livestock section</h1>
    //     </div>
    //   )}
    // </div>
    null
  );
};

export default AssetManagement;
