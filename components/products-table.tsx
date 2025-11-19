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
import Pagination from "./utils/Pagination";
import { SearchFilter } from "./utils/SearchFilter";
import Loading from "./utils/Loading";

const getStatusBadge = (status: string) => {
  const variants = {
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    expired: "bg-red-100 text-red-800 hover:bg-red-100",
    pending: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    cancelled: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };
  return (
    variants[status as keyof typeof variants] || "bg_gray-100 text-gray-800"
  );
};

export function ProductsTable() {
  // const [selectedProduct, setSelectedProduct] = useState<
  //   (typeof policies)[0] | null
  // >(null);
  const [productData, setProductData] = useState<InsuranceProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<InsuranceProduct[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const { get, post, error } = useApi();

  // Pagination functions
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "All">(6);

  // Pick data to show: filtered if non-empty (or even empty if search but 0 matches), else full list
  const dataToPaginate =
    filteredProducts.length || filteredProducts.length === 0
      ? filteredProducts
      : productData;

  const totalPages =
    pageSize === "All"
      ? 1
      : Math.ceil(dataToPaginate.length / (pageSize as number));

  const paginatedProducts =
    pageSize === "All"
      ? dataToPaginate
      : dataToPaginate.slice(
          (currentPage - 1) * (pageSize as number),
          currentPage * (pageSize as number)
        );
  // =============================

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await get("ims/insurance-product-service/", {
          params: { start_record: 1 },
        });
        //("Response from API:", response.status);

        if (response.status === "success") {
          setProductData(response.data);
          setFilteredProducts(response.data); // initialize filtered
        }
        // //(response.data.length + " farmers found");

        // for (let index = 0; index < response.date.length; index++) {
        //   const element = response.data[index];

        //   //("Fetching applications from API..." + element);
        // }
      } catch (error) {
        //("Error fetching applications from API...");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="">
        <SearchFilter
          placeholder="Search products by Category, Company, Type or Period"
          data={productData}
          setFilteredData={setFilteredProducts}
          searchKeys={[
            "insurance_category",
            "insurance_company_name",
            "insurance_type_name",
            "period_name",
          ]}
        />
      </div>
      <Card className="border border-gray-200 py-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 pt-0">
            Insurance Products
          </CardTitle>
          <p className="text-sm text-gray-600">
            {dataToPaginate.length} product
            {dataToPaginate.length !== 1 ? "s" : ""} found
          </p>
        </CardHeader>
        <CardContent>
          {/* MOBILE / TABLET — CARD VIEW */}
          <div className="grid gap-4 lg:hidden">
            {loading ? (
              <Loading />
            ) : (
              paginatedProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="border rounded-xl p-5 bg-white shadow-sm animate__animated animate__fadeIn"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {product.insurance_category}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.insurance_company_name}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-[11px] text-gray-500">
                        Insurance Type
                      </p>
                      <p className="text-sm font-medium">
                        {product.insurance_type_name}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-[11px] text-gray-500">Period</p>
                      <p className="text-sm font-medium">
                        {product.period_name}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                      <p className="text-[11px] text-gray-500">Premium %</p>
                      <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
                        {product.premium_percentage}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}

            {dataToPaginate.length === 0 && !loading && (
              <p className="text-center text-sm text-gray-500">
                No products found.
              </p>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>

          {/* DESKTOP — ORIGINAL TABLE */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Insurance Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Insurance Company
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
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center">
                      <Loading />
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product, idx) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50 animate__animated animate__fadeIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-blue-600">
                          {product.insurance_category}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">
                          {product.insurance_company_name}
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
                          {product.premium_percentage}
                        </span>
                      </td>
                    </tr>
                  ))
                )}

                {dataToPaginate.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-4 text-center text-sm text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>
        </CardContent>

        {/* Comment code #001 */}
      </Card>
    </>
  );
}

{
  // #001
  /* {selectedProduct && (
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
      )} */
}

{
  // #002
  /* <td className="py-4 px-4">
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
                </td> */
  /* <td className="py-4 px-4">
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
                  </td> */
}

{
  // #003
  /* <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
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
                </th> */
}
