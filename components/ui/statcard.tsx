"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  AlertTriangle,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

interface StatCardProps {
  type: "unread" | "priority" | "messages" | "activities";
  count: number;
  label: string;
}

const statStyles = {
  unread: {
    icon: Bell,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  priority: {
    icon: AlertTriangle,
    iconColor: "text-red-600",
    bgColor: "bg-red-100",
  },
  messages: {
    icon: MessageSquare,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
  },
  activities: {
    icon: CheckCircle,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
};

export const StatCard = ({ type, count, label }: StatCardProps) => {
  const { icon: Icon, iconColor, bgColor } = statStyles[type] ?? statStyles.unread;

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900">{count}</div>
      </CardContent>
    </Card>
  );
};
