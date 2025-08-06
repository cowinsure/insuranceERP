"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { StatCard } from "@/components/ui/statcard";
import { Card } from "@/components/ui/card";
import { NotificationCard } from "@/components/ui/notification";

const mockNotifications = [
  {
    id: "1",
    type: "claim" as const,
    title: "New Claim Submitted",
    description: "Rajesh Kumar has submitted a new claim for flood damage (CLM001)",
    priority: "high" as const,
    timestamp: "2 hours ago",
    isRead: false
  },
  {
    id: "2",
    type: "approval" as const,
    title: "Application Approved",
    description: "Wheat crop insurance application APP003 has been approved",
    priority: "medium" as const,
    timestamp: "4 hours ago",
    isRead: false
  },
  {
    id: "3",
    type: "payment" as const,
    title: "Premium Payment Overdue",
    description: "3 farmers have overdue premium payments requiring follow-up",
    priority: "high" as const,
    timestamp: "6 hours ago",
    isRead: false
  },
  {
    id: "4",
    type: "message" as const,
    title: "Message from Field Assessor",
    description: "Dr. Sarah Johnson: Field assessment completed for CLM002",
    priority: "low" as const,
    timestamp: "1 day ago",
    isRead: true
  },
  {
    id: "5",
    type: "policy" as const,
    title: "Policy Renewal Reminder",
    description: "5 policies are due for renewal in the next 30 days",
    priority: "medium" as const,
    timestamp: "1 day ago",
    isRead: false
  }
];

const mockStats = [
  { type: "unread" as const, count: 3, label: "Unread" },
  { type: "priority" as const, count: 3, label: "High Priority" },
  { type: "messages" as const, count: 8, label: "Messages" },
  { type: "activities" as const, count: 15, label: "Today's Activities" }
];

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("notifications");

  const handleMarkAllRead = () => {
    // Handle mark all as read logic
    console.log("Mark all as read");
  };

  const handleSettings = () => {
    // Handle settings logic
    console.log("Open settings");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Notifications Center
            </h1>
            <p className="text-muted-foreground">
              Stay updated with recent activities and messages
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleMarkAllRead}>
              Mark All as Read
            </Button>
            <Button variant="outline" size="icon" onClick={handleSettings}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockStats.map((stat, index) => (
            <StatCard
              key={index}
              type={stat.type}
              count={stat.count}
              label={stat.label}
            />
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="activity-logs">Activity Logs</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-6">
            <div className="space-y-6 bg-white p-6 rounded-xl shadow">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  System Notifications
                </h2>
                <p className="text-muted-foreground mb-4">
                  Important updates and alerts from the system
                </p>
              </div>

              <div className="space-y-4">
                {mockNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    {...notification}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity-logs" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground">
                Activity Logs
              </h3>
              <p className="text-muted-foreground mt-2">
                Activity logs will be displayed here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground">
                Messages
              </h3>
              <p className="text-muted-foreground mt-2">
                Messages will be displayed here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;