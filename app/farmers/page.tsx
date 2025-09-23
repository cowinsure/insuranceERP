"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { FarmersFilters } from "@/components/farmers-filters";
import { FarmersTable } from "@/components/farmers-table";
import { Input } from "@/components/ui/input";
import { Bell, Search, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import GenericModal from "@/components/ui/GenericModal";

export default function FarmersPage() {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Farmers Management
          </h1>
          <p className="text-gray-600">
            Manage farmer registrations and view their insurance portfolios
          </p>
        </div>
        <div className="flex">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onOpen}
          >
            <Plus className="w-4 h-4" />
            Add Farmer
          </Button>
        </div>
      </div>

      <div className="animate__animated animate__fadeIn">
        {/* <FarmersFilters /> */}
      </div>
      <div className="animate__animated animate__fadeIn">
        <FarmersTable />
      </div>

      {/* Premium Modal */}
      {isOpen && (
        <GenericModal closeModal={onClose}>
          <div className="w-full mx-auto text-center p-6 space-y-5">
            {/* Icon */}
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900">
              Upgrade to Premium
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              Unlock the full power of the app with a{" "}
              <span className="font-bold text-gray-800">
                Premium subscription
              </span>
              . Enjoy exclusive features, faster performance, and tools designed
              to help you get the most out of your usage.
            </p>
          </div>
        </GenericModal>
      )}
    </div>
  );
}
