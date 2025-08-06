"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import GenericModal from "./ui/GenericModal";

const farmers = [
  {
    id: "F001",
    name: "Rahim Uddin",
    initials: "RU",
    email: "rahim.uddin@email.com.bd",
    phone: "+880 1711 123456",
    location: "Rangpur, Bangladesh",
    region: "North Bengal",
    assets: 3,
    policies: 2,
    status: "active",
    joinDate: "2023-03-15",
    avatarColor: "bg-blue-500",
  },
  {
    id: "F002",
    name: "Fatema Begum",
    initials: "FB",
    email: "fatema.begum@email.com.bd",
    phone: "+880 1812 654321",
    location: "Rajshahi, Bangladesh",
    region: "Northwest Region",
    assets: 5,
    policies: 4,
    status: "active",
    joinDate: "2023-01-22",
    avatarColor: "bg-purple-500",
  },
  {
    id: "F003",
    name: "Shahidul Islam",
    initials: "SI",
    email: "shahidul.islam@email.com.bd",
    phone: "+880 1911 223344",
    location: "Mymensingh, Bangladesh",
    region: "Central Region",
    assets: 2,
    policies: 0,
    status: "inactive",
    joinDate: "2022-11-08",
    avatarColor: "bg-blue-600",
  },
  {
    id: "F004",
    name: "Hasina Akhter",
    initials: "HA",
    email: "hasina.akhter@email.com.bd",
    phone: "+880 1611 334455",
    location: "Barisal, Bangladesh",
    region: "Southern Region",
    assets: 4,
    policies: 3,
    status: "active",
    joinDate: "2023-06-12",
    avatarColor: "bg-blue-500",
  },
  {
    id: "F005",
    name: "Jahirul Haque",
    initials: "JH",
    email: "jahirul.haque@email.com.bd",
    phone: "+880 1515 998877",
    location: "Sylhet, Bangladesh",
    region: "Northeast Region",
    assets: 1,
    policies: 0,
    status: "pending",
    joinDate: "2024-01-30",
    avatarColor: "bg-purple-600",
  },
];


const getStatusBadge = (status: string) => {
  const variants = {
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    inactive: "bg-red-100 text-red-800 hover:bg-red-100",
    pending: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  };
  return (
    variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  );
};

export function FarmersTable() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Card className="border border-gray-200 py-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Registered Farmers
          </CardTitle>
          <p className="text-sm text-gray-600">
            {farmers.length} farmers found
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Farmer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Assets
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Policies
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Join Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {farmers.map((farmer) => (
                  <tr
                    key={farmer.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className={`w-10 h-10 ${farmer.avatarColor}`}>
                          <AvatarFallback className="text-white font-medium">
                            {farmer.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {farmer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {farmer.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {farmer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {farmer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {farmer.location}
                        </div>
                        <div className="text-sm text-gray-500 ml-6">
                          {farmer.region}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-gray-900">
                        {farmer.assets}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-sm font-medium ${
                          farmer.policies > 0
                            ? "text-blue-600"
                            : "text-gray-900"
                        }`}
                      >
                        {farmer.policies}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusBadge(farmer.status)}>
                        {farmer.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {farmer.joinDate}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(true)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isOpen && (
              <GenericModal
                closeModal={() => setIsOpen(false)}
                title="Confirm Action"
              >
                <p>Are you sure you want to proceed?</p>
              </GenericModal>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
