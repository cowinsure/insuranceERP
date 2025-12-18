import { Card, CardContent } from "@/components/ui/card";
import { useLocalization } from "@/core/context/LocalizationContext";
import {
  FileText,
  AlertCircle,
  Clock,
  DollarSign,
  HandCoins,
} from "lucide-react";

const stats = [
  {
    title: "Total Policies",
    value: "2,847",
    change: "+12% from last month",
    changeType: "positive" as const,
    icon: FileText,
    iconColor: "text-blue-500",
  },
  {
    title: "Active Claims",
    value: "156",
    change: "+3% from last week",
    changeType: "positive" as const,
    icon: AlertCircle,
    iconColor: "text-blue-500",
  },
  {
    title: "Pending Approvals",
    value: "23",
    change: "-8% from last week",
    changeType: "negative" as const,
    icon: Clock,
    iconColor: "text-blue-500",
  },
  {
    title: "Premium Collected",
    value: "৳1,247,390",
    change: "-18% from last month",
    changeType: "negative" as const,
    icon: HandCoins,
    iconColor: "text-blue-500",
  },
];

export function DashboardStats() {
  return (
    <>
      <div className="hidden lg:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">
                  {stat.title}
                </span>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div
                  className={`text-sm ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MOBILE: List-style stats */}
      <div className="lg:hidden rounded-xl border bg-white">
        <h3 className="ml-4 pt-2 text-lg font-semibold text-gray-400">Quick Stats</h3>
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="flex items-center justify-between px-4 py-3"
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-100`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">
                  {stat.title}
                </div>
                <div className="text-xs text-gray-500">{stat.change}</div>
              </div>
            </div>

            {/* Right */}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {stat.value}
              </div>
              <div
                className={`text-xs font-medium ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.changeType === "positive" ? "▲" : "▼"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
