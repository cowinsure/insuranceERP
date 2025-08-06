import { AppSidebar } from "@/components/app-sidebar";
import { FarmersFilters } from "@/components/farmers-filters";
import { FarmersTable } from "@/components/farmers-table";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function FarmersPage() {
  return (
    // <SidebarProvider>
    //   <AppSidebar />
    //   <SidebarInset>
    //     <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-6">
    //       <SidebarTrigger className="-ml-1" />
    //       <div className="flex-1 flex items-center gap-4">
    //         <div className="relative max-w-md flex-1">
    //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    //           <Input placeholder="Search farmers, policies, claims..." className="pl-10 bg-gray-50 border-gray-200" />
    //         </div>
    //       </div>
    //       <div className="flex items-center gap-3">
    //         <Button variant="ghost" size="sm" className="relative">
    //           <Bell className="w-5 h-5" />
    //           <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
    //             3
    //           </span>
    //         </Button>
    //         <Avatar className="w-8 h-8">
    //           <AvatarFallback className="bg-blue-500 text-white text-sm">JD</AvatarFallback>
    //         </Avatar>
    //       </div>
    //     </header>

    //     <div className="flex-1 space-y-6 p-6 bg-gray-50">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <h1 className="text-2xl font-bold text-gray-900">Farmers Management</h1>
    //           <p className="text-gray-600">Manage farmer registrations and view their insurance portfolios</p>
    //         </div>
    //         <Button className="bg-blue-500 hover:bg-blue-600 text-white">
    //           <Plus className="w-4 h-4 mr-2" />
    //           Add Farmer
    //         </Button>
    //       </div>

    //       <FarmersFilters />
    //       <FarmersTable />
    //     </div>
    //   </SidebarInset>
    // </SidebarProvider>

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
        {/* <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Farmer
        </Button> */}
      </div>
      <div className="animate__animated animate__fadeIn">
        <FarmersFilters />
      </div>
      <div className="animate__animated animate__fadeIn">
        <FarmersTable />
      </div>
    </div>
  );
}
