import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, MessageSquare, CheckCircle, FileText, Shield, Clock, AlertCircle } from "lucide-react";

interface NotificationCardProps {
  id: string;
  type: "claim" | "approval" | "payment" | "message" | "policy";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
  isRead?: boolean;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "claim":
      return <FileText className="h-5 w-5" />;
    case "approval":
      return <CheckCircle className="h-5 w-5" />;
    case "payment":
      return <AlertTriangle className="h-5 w-5" />;
    case "message":
      return <MessageSquare className="h-5 w-5" />;
    case "policy":
      return <Shield className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-notification-high text-white";
    case "medium":
      return "bg-notification-medium text-white";
    case "low":
      return "bg-notification-low text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case "claim":
      return "text-notification-high";
    case "approval":
      return "text-notification-success";
    case "payment":
      return "text-notification-high";
    case "message":
      return "text-notification-low";
    case "policy":
      return "text-notification-medium";
    default:
      return "text-muted-foreground";
  }
};

export const NotificationCard = ({
  type,
  title,
  description,
  priority,
  timestamp,
  isRead = false
}: NotificationCardProps) => {
  return (
    <Card className={`p-4 transition-all hover:shadow-md ${
      !isRead ? "" : ""
    }`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 p-2 rounded-lg bg-muted/50 ${getIconColor(type)}`}>
          {getNotificationIcon(type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-foreground leading-tight">{title}</h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className={`text-xs px-2 py-1 ${getPriorityColor(priority)}`}>
                {priority}
              </Badge>
              {!isRead && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
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