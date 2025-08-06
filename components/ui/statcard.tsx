"use client";
import { Card } from "@/components/ui/card";
import { Bell, AlertTriangle, MessageSquare, CheckCircle } from "lucide-react";

interface StatCardProps {
  type: "unread" | "priority" | "messages" | "activities";
  count: number;
  label: string;
}

const statStyles = {
  unread: {
    icon: <Bell className="h-5 w-5" />,
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  priority: {
    icon: <AlertTriangle className="h-5 w-5" />,
    bg: "bg-red-100",
    text: "text-red-600",
  },
  messages: {
    icon: <MessageSquare className="h-5 w-5" />,
    bg: "bg-green-100",
    text: "text-green-600",
  },
  activities: {
    icon: <CheckCircle className="h-5 w-5" />,
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
};

export const StatCard = ({ type, count, label }: StatCardProps) => {
  const { icon, bg, text } = statStyles[type] ?? statStyles.unread;

  return (
    <Card className="p-6 hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${bg} ${text}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{count}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </Card>
  );
};
