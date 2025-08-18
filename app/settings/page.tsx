"use client";

import { useState } from "react";
import { FileText, Settings, Edit, Trash2, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const [premiumRules, setPremiumRules] = useState([
    {
      factor: "Basic Livestock Coverage",
      description: "Standard rate for cattle insurance",
      rate: "6.0%",
    },
    {
      factor: "Disease-Prone Area",
      description: "High disease risk regions like floodplains",
      rate: "+3.0%",
    },
    {
      factor: "Vaccinated Cattle",
      description: "Discount for properly vaccinated cattle",
      rate: "-1.5%",
    },
    {
      factor: "Multiple Cattle Product",
      description: "Discount for insuring 3 or more cows",
      rate: "-1.0%",
    },
    {
      factor: "Early Renewal",
      description: "Discount for renewing before expiry",
      rate: "-0.8%",
    },
  ]);

  const [assetCategories, setAssetCategories] = useState([
    {
      category: "Deshi Cow",
      baseRate: "6.5%",
      riskFactor: "Low",
      description: "Locally bred cows with moderate risk profile",
    },
    {
      category: "Sahiwal Cow",
      baseRate: "7.2%",
      riskFactor: "Medium",
      description: "Popular dairy breed with moderate maintenance",
    },
    {
      category: "Holstein Friesian",
      baseRate: "9.0%",
      riskFactor: "High",
      description: "High milk-yielding breed, sensitive to climate",
    },
    {
      category: "Jersey Cow",
      baseRate: "8.0%",
      riskFactor: "Medium",
      description: "Smaller breed, suited for small farms",
    },
    {
      category: "Bull (Breeding)",
      baseRate: "7.8%",
      riskFactor: "High",
      description: "Valuable breeding bull with higher market risk",
    },
  ]);

  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Pashu Bima Limited",
    contactEmail: "support@pashubima.com.bd",
    contactPhone: "+880 9612-123456",
    address: "34, Motijheel Commercial Area, Dhaka-1000, Bangladesh",
    defaultCurrency: "BDT - Bangladeshi Taka",
  });

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "High":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6 overflow-auto">
        <div>
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage premium rules and livestock product categories for cattle
              insurance
            </p>
          </div>

          {/* Top Section: Premium Rules & General Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Premium Rules */}
            <Card className="py-6 animate__animated animate__fadeIn">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <CardTitle className="text-2xl">
                    Premium Calculation Rules
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-600">
                  Define how cattle premiums are determined based on risk
                  factors
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
                    <div>Factor</div>
                    <div className="text-right">Rate</div>
                    <div></div>
                  </div>
                  {premiumRules.map((rule, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {rule.factor}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rule.description}
                        </div>
                      </div>
                      <div className="font-medium text-gray-900 text-right">
                        {rule.rate}
                      </div>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Rule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* General Settings */}
            <Card className="py-6 animate__animated animate__fadeIn">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <CardTitle className="text-2xl">General Settings</CardTitle>
                </div>
                <p className="text-sm text-gray-600">
                  Company information and system preferences
                </p>
              </CardHeader>
              <CardContent className="h-full">
                <div className="space-y-4 flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <Input
                        value={generalSettings.companyName}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <Input
                        value={generalSettings.contactEmail}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            contactEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Phone
                      </label>
                      <Input
                        value={generalSettings.contactPhone}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            contactPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <Textarea
                        value={generalSettings.address}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            address: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Currency
                      </label>
                      <Input
                        value={generalSettings.defaultCurrency}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            defaultCurrency: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex items-end">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Livestock Categories */}
          <Card className="py-6 animate__animated animate__fadeIn">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Cattle Categories & Templates
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Define and manage different cattle types for insurance
                  </p>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Cattle Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Base Rate
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Risk Factor
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetCategories.map((asset, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {asset.category}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {asset.baseRate}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={`${getRiskBadgeColor(
                              asset.riskFactor
                            )} text-xs`}
                          >
                            {asset.riskFactor}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {asset.description}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
