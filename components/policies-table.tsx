"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Wheat, Sprout } from "lucide-react";
import { useEffect, useState } from "react";
import GenericModal from "./ui/GenericModal";
import useApi from "@/hooks/use_api";
import { InsuranceProduct } from "./model/products/ProductsData";
import { TbPercentage } from "react-icons/tb";

const getStatusBadge = (status: string) => {
  const variants = {
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    expired: "bg-red-100 text-red-800 hover:bg-red-100",
    pending: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    cancelled: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };
  return (
    variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  );
};

export function PoliciesTable() {
  // const [selectedProduct, setSelectedProduct] = useState<
  //   (typeof policies)[0] | null
  // >(null);
  const [productData, setProductData] = useState<InsuranceProduct[]>([]);
  const { get, post, loading, error } = useApi();
  console.log(productData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get("ims/insurance-product-service/", {
          params: {
            start_record: 1,
            page_size: 10,
          },
        });
        console.log("Response from API:", response.status);

        if (response.status === "success") {
          setProductData(response.data);
        }
        // console.log(response.data.length + " farmers found");

        // for (let index = 0; index < response.date.length; index++) {
        //   const element = response.data[index];

        //   console.log("Fetching applications from API..." + element);
        // }
        // console.log(
        //   "Fetching applications from API..." +
        //     response?.data[12]?.mobile_number
        // );
      } catch (error) {
        console.log("Error fetching applications from API...");
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="border border-gray-200 py-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Insurance Products
        </CardTitle>
        <p className="text-sm text-gray-600">
          {productData.length} products found
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Insurance Category
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Insurance Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Insurance Period
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Premium Percentage
                </th>
                {/* <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Premium
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Duration
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody>
              {productData.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-blue-600">
                      {product.insurance_category}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">
                      {product.insurance_type_name}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">
                      {product.period_name}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-blue-600 flex items-center gap-1">
                      {product.premium_percentage}{" "}
                      <TbPercentage className="text-gray-500" />
                    </span>
                  </td>
                  {/* <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">
                      {product.premium}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm text-gray-900">
                        {product.duration}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.dateRange}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusBadge(product.status)}>
                      {product.status}
                    </Badge>
                  </td> */}
                  {/* <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      {/* {selectedProduct && (
        <GenericModal closeModal={() => setSelectedProduct(null)}>
          <div className="w-full rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Product Details - {selectedProduct.productNumber}
                </h1>
                <p className="text-sm text-gray-500">
                  View product information and coverage summary
                </p>
              </div>
            </div>

            <div className="max-h-[65vh] pr-2 space-y-6 overflow-auto">
        
              <div className="border rounded-md p-4">
                <p className="font-medium text-gray-800 mb-2">
                  📄 Basic Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Product ID</p>
                    <p className="text-gray-900">{selectedProduct.productId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="text-gray-900">{selectedProduct.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date Range</p>
                    <p className="text-gray-900">{selectedProduct.dateRange}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <span
                      className={`text-sm px-2 py-1 rounded-full font-medium 
                ${getStatusBadge(selectedProduct.status)}`}
                    >
                      {selectedProduct.status}
                    </span>
                  </div>
                </div>
              </div>

        
              <div className="border rounded-md p-4">
                <p className="font-medium text-gray-800 mb-2">👩‍🌾 Farmer Info</p>
                <div className="text-sm">
                  <p className="text-gray-500">Name</p>
                  <p className="text-gray-900">{selectedProduct.farmer}</p>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <p className="font-medium text-gray-800 mb-2">
                  🐄 Asset Coverage
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Asset Type</p>
                    <p className="text-gray-900">{selectedProduct.assetType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Coverage Amount</p>
                    <p className="text-gray-900">{selectedProduct.coverage}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Premium</p>
                    <p className="text-gray-900">{selectedProduct.premium}</p>
                  </div>
                </div>
              </div>
            </div>


            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
            </div>
          </div>
        </GenericModal>
      )} */}
    </Card>
  );
}
