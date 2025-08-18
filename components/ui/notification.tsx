import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  AlertTriangle,
  MessageSquare,
  CheckCircle,
  FileText,
  Shield,
  Clock,
} from "lucide-react";

interface NotificationCardProps {
  id: string;
  type: "claim" | "approval" | "payment" | "message" | "product";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
  isRead?: boolean;
}

const notificationStyles = {
  claim: {
    icon: <FileText className="h-5 w-5" />,
    iconColor: "text-red-600",
    bgColor: "bg-red-100",
  },
  approval: {
    icon: <CheckCircle className="h-5 w-5" />,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
  },
  payment: {
    icon: <AlertTriangle className="h-5 w-5" />,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  message: {
    icon: <MessageSquare className="h-5 w-5" />,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  product: {
    icon: <Shield className="h-5 w-5" />,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100",
  },
};

const priorityStyles = {
  high: "bg-red-500 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-blue-500 text-white",
};

export const NotificationCard = ({
  type,
  title,
  description,
  priority,
  timestamp,
  isRead = false,
}: NotificationCardProps) => {
  const { icon, iconColor, bgColor } = notificationStyles[type] ?? notificationStyles.message;
  const priorityColor = priorityStyles[priority] ?? "bg-gray-200 text-gray-600";

  return (
    <Card className={`p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 p-2 rounded-lg ${bgColor} ${iconColor}`}>
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-foreground leading-tight">{title}</h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className={`text-xs px-2 py-1 ${priorityColor}`}>
                {priority}
              </Badge>
              {/* {!isRead && <div className="w-2 h-2 bg-primary rounded-full" />} */}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {timestamp}
          </div>
        </div>
      </div>
    </Card>
  );
};
