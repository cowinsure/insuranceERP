"use client";
import { useState } from "react";
import {
  Bell,
  Search,
  Settings,
  User,
  Home,
  Users,
  FileText,
  AlertTriangle,
  Send,
  CheckCircle,
  Menu,
  Edit,
  Trash2,
  Plus,
  Shield,
  Star,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GenericModal from "@/components/ui/GenericModal";

export default function UserManagementPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Arefin Rahman",
      email: "arefin.rahman@agrocover.com.bd",
      role: "Admin",
      department: "Dhaka HQ",
      status: "active",
      lastLogin: "2024-02-10 14:30",
      avatar: "AR",
    },
    {
      id: 2,
      name: "Shanta Akter",
      email: "shanta.akter@agrocover.com.bd",
      role: "Claims Officer",
      department: "Rajshahi Division",
      status: "active",
      lastLogin: "2024-02-10 12:15",
      avatar: "SA",
    },
    {
      id: 3,
      name: "Rafiq Hossain",
      email: "rafiq.hossain@agrocover.com.bd",
      role: "Field Assessor",
      department: "Barisal Region",
      status: "active",
      lastLogin: "2024-02-09 16:45",
      avatar: "RH",
    },
    {
      id: 4,
      name: "Maliha Islam",
      email: "maliha.islam@agrocover.com.bd",
      role: "Policy Officer",
      department: "Chattogram Branch",
      status: "inactive",
      lastLogin: "2024-01-28 10:20",
      avatar: "MI",
    },
    {
      id: 5,
      name: "Kamrul Hasan",
      email: "kamrul.hasan@agrocover.com.bd",
      role: "Manager",
      department: "Sylhet Division",
      status: "active",
      lastLogin: "2024-02-10 09:00",
      avatar: "KH",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const rolePermissions = {
    Admin: {
      color: "text-red-600",
      permissions: [
        "Full Access",
        "User Management",
        "System Settings",
        "Reports",
      ],
    },
    Manager: {
      color: "text-blue-600",
      permissions: [
        "Team Management",
        "Reports",
        "Policy Approval",
        "Claims Review",
      ],
    },
    "Claims Officer": {
      color: "text-blue-600",
      permissions: [
        "Claims Processing",
        "Farmer Communication",
        "Document Review",
      ],
    },
    "Policy Officer": {
      color: "text-yellow-600",
      permissions: ["Policy Creation", "Risk Assessment", "Application Review"],
    },
    "Field Assessor": {
      color: "text-green-600",
      permissions: [
        "Field Inspection",
        "Damage Assessment",
        "Report Submission",
      ],
    },
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-700";
      case "Manager":
        return "bg-blue-100 text-blue-700";
      case "Claims Officer":
        return "bg-blue-100 text-blue-700";
      case "Policy Officer":
        return "bg-yellow-100 text-yellow-700";
      case "Field Assessor":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  return (
    // <div className="flex h-screen bg-gray-50">
    //   {/* Sidebar */}
    //   <div className="w-64 bg-white border-r border-gray-200">
    //     {/* Logo */}
    //     <div className="flex items-center gap-3 p-4 border-b border-gray-200">
    //       <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
    //         <div className="w-5 h-5 bg-white rounded-sm"></div>
    //       </div>
    //       <div>
    //         <h1 className="font-semibold text-gray-900">AgroCover</h1>
    //         <p className="text-xs text-gray-500">Insurance Portal</p>
    //       </div>
    //     </div>

    //     {/* Navigation */}
    //     <nav className="p-4">
    //       <div className="mb-6">
    //         <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
    //           MAIN MENU
    //         </h3>
    //         <div className="space-y-1">
    //           <Button
    //             variant="ghost"
    //             className="w-full justify-start text-gray-600 hover:text-gray-900"
    //           >
    //             <Home className="w-4 h-4 mr-3" />
    //             Dashboard
    //           </Button>
    //           <Button
    //             variant="ghost"
    //             className="w-full justify-start text-gray-600 hover:text-gray-900"
    //           >
    //             <Users className="w-4 h-4 mr-3" />
    //             Farmers
    //           </Button>
    //           <Button
    //             variant="ghost"
    //             className="w-full justify-start text-gray-600 hover:text-gray-900"
    //           >
    //             <FileText className="w-4 h-4 mr-3" />
    //             Policies
    //           </Button>
    //           <Button
    //             variant="ghost"
    //             className="w-full justify-start text-gray-600 hover:text-gray-900"
    //           >
    //             <AlertTriangle className="w-4 h-4 mr-3" />
    //             Claims
    //           </Button>
    //           <Button
    //             variant="ghost"
    //             className="w-full justify-start text-gray-600 hover:text-gray-900"
    //           >
    //             <Send className="w-4 h-4 mr-3" />
    //             Applications
    //           </Button>
    //           <Button
    //             variant="ghost"
    //             className="w-full justify-start text-gray-600 hover:text-gray-900"
    //           >
    //             <Bell className="w-4 h-4 mr-3" />
    //             Notifications
    //           </Button>
    //         </div>
    //       </div>

    //       <div>
    //         <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
    //           MANAGEMENT
    //         </h3>
    //         <div className="space-y-1">
    //           <Button
    //             variant="ghost"
    //             className="w-full justify-start text-gray-600 hover:text-gray-900"
    //           >
    //             <Settings className="w-4 h-4 mr-3" />
    //             Settings
    //           </Button>
    //           <Button
    //             variant="default"
    //             className="w-full justify-start bg-blue-500 hover:bg-blue-600"
    //           >
    //             <Users className="w-4 h-4 mr-3" />
    //             User Management
    //           </Button>
    //         </div>
    //       </div>
    //     </nav>
    //   </div>

    //   {/* Main Content */}
    //   <div className="flex-1 flex flex-col">
    //     {/* Header */}
    //     <header className="bg-white border-b border-gray-200 px-6 py-4">
    //       <div className="flex items-center justify-between">
    //         <Button variant="ghost" size="sm" className="md:hidden">
    //           <Menu className="w-4 h-4" />
    //         </Button>

    //         <div className="flex-1 max-w-md mx-4">
    //           <div className="relative">
    //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    //             <Input
    //               placeholder="Search farmers, policies, claims..."
    //               className="pl-10 bg-gray-50 border-gray-200"
    //             />
    //           </div>
    //         </div>

    //         <div className="flex items-center gap-4">
    //           <div className="relative">
    //             <Bell className="w-5 h-5 text-gray-600" />
    //             <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
    //               3
    //             </Badge>
    //           </div>
    //           <Avatar className="w-8 h-8 bg-blue-500">
    //             <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
    //               JD
    //             </AvatarFallback>
    //           </Avatar>
    //         </div>
    //       </div>
    //     </header>

    //   </div>
    // </div>
    <div>
      {/* Page Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                User Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage insurance officers and their access permissions
              </p>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={onOpen}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate__animated animate__fadeIn">
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    Active Users
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">24</div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    Administrators
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">3</div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    Field Officers
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">12</div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    Online Now
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">8</div>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filter */}
          <Card className="mb-6 py-6 animate__animated animate__fadeIn">
            <CardHeader>
              <CardTitle className="text-xl">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by name or email..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select defaultValue="all-roles">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-roles">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="claims-officer">
                      Claims Officer
                    </SelectItem>
                    <SelectItem value="policy-officer">
                      Policy Officer
                    </SelectItem>
                    <SelectItem value="field-assessor">
                      Field Assessor
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Users */}
            <div className="lg:col-span-2 animate__animated animate__fadeIn">
              <Card className="py-6">
                <CardHeader>
                  <CardTitle className="text-xl">System Users</CardTitle>
                  <p className="text-sm text-gray-600">5 users found</p>
                </CardHeader>
                <CardTitle>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">
                              User
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">
                              Role
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">
                              Department
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">
                              Last Login
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr
                              key={user.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8 bg-blue-500">
                                    <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                                      {user.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  className={`${getRoleBadgeColor(
                                    user.role
                                  )} text-xs`}
                                >
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-gray-700">
                                {user.department}
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  className={`${getStatusBadgeColor(
                                    user.status
                                  )} text-xs`}
                                >
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-gray-600 text-sm">
                                {user.lastLogin}
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
                </CardTitle>
              </Card>
            </div>

            {/* Role Permissions */}
            <div className="animate__animated animate__fadeIn">
              <Card className="py-6">
                <CardHeader>
                  <CardTitle className="text-xl">Role Permissions</CardTitle>
                  <p className="text-sm text-gray-600">
                    Access control for different user roles
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 grid grid-cols-2">
                    {Object.entries(rolePermissions).map(([role, config]) => (
                      <div key={role}>
                        <h4 className={`font-medium mb-2 ${config.color}`}>
                          {role}
                        </h4>
                        <ul className="space-y-1">
                          {config.permissions.map((permission, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-center gap-2"
                            >
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              {permission}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
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
