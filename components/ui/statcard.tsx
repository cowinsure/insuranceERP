"use client"
import { Card } from "@/components/ui/card";
import { Bell, AlertTriangle, MessageSquare, CheckCircle } from "lucide-react";

interface StatCardProps {
  type: "unread" | "priority" | "messages" | "activities";
  count: number;
  label: string;
}

const getStatIcon = (type: string) => {
  switch (type) {
    case "unread":
      return <Bell className="h-5 w-5" />;
    case "priority":
      return <AlertTriangle className="h-5 w-5" />;
    case "messages":
      return <MessageSquare className="h-5 w-5" />;
    case "activities":
      return <CheckCircle className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const getStatColor = (type: string) => {
  switch (type) {
    case "unread":
      return "text-stat-unread";
    case "priority":
      return "text-stat-priority";
    case "messages":
      return "text-stat-messages";
    case "activities":
      return "text-stat-activities";
    default:
      return "text-muted-foreground";
  }
};

const getStatBg = (type: string) => {
  switch (type) {
    case "unread":
      return "bg-stat-unread/10";
    case "priority":
      return "bg-stat-priority/10";
    case "messages":
      return "bg-stat-messages/10";
    case "activities":
      return "bg-stat-activities/10";
    default:
      return "bg-muted/10";
  }
};

export const StatCard = ({ type, count, label }: StatCardProps) => {
  return (
    <Card className="p-6 hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${getStatBg(type)} ${getStatColor(type)}`}>
          {getStatIcon(type)}
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{count}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </Card>
  );
};