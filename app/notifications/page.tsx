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
    description: "Rahim Uddin has submitted a new claim for cattle (CLM001)",
    priority: "high" as const,
    timestamp: "2 hours ago",
    isRead: false,
  },
  {
    id: "2",
    type: "approval" as const,
    title: "Application Approved",
    description: "Wheat crop insurance application APP003 has been approved",
    priority: "medium" as const,
    timestamp: "4 hours ago",
    isRead: false,
  },
  {
    id: "3",
    type: "payment" as const,
    title: "Premium Payment Overdue",
    description: "3 farmers have overdue premium payments requiring follow-up",
    priority: "high" as const,
    timestamp: "6 hours ago",
    isRead: false,
  },
  {
    id: "4",
    type: "message" as const,
    title: "Message from Field Assessor",
    description: "Dr. Nusrat Jahan Field assessment completed for CLM002",
    priority: "low" as const,
    timestamp: "1 day ago",
    isRead: true,
  },
  {
    id: "5",
    type: "product" as const,
    title: "Product Renewal Reminder",
    description: "5 policies are due for renewal in the next 30 days",
    priority: "medium" as const,
    timestamp: "1 day ago",
    isRead: false,
  },
];

const mockStats = [
  { type: "unread" as const, count: 3, label: "Unread" },
  { type: "priority" as const, count: 3, label: "High Priority" },
  { type: "messages" as const, count: 8, label: "Messages" },
  { type: "activities" as const, count: 15, label: "Today's Activities" },
];

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("notifications");

  const handleMarkAllRead = () => {
    // Handle mark all as read logic
    //("Mark all as read");
  };

  const handleSettings = () => {
    // Handle settings logic
    //("Open settings");
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate__animated animate__fadeIn">
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
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full animate__animated animate__fadeIn"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="activity-logs">Activity Logs</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent
            value="notifications"
            className="animate__animated animate__fadeIn"
          >
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
                  <NotificationCard key={notification.id} {...notification} />
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="activity-logs"
            className="animate__animated animate__fadeIn"
          >
            <div className="bg-white p-6 rounded-xl shadow space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-1">
                  Recent Activity Logs
                </h2>
                <p className="text-muted-foreground">
                  Track of all user actions and system events
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    user: "Karim Uddin",
                    action: "approved claim",
                    item: "CLM002 - Cattle",
                    time: "Today at 10:30 AM",
                  },
                  {
                    user: "Nusrat Jahan",
                    action: "completed assessment",
                    item: "Field inspection for Shahida Begum",
                    time: "Yesterday at 2:15 PM",
                  },
                  {
                    user: "Md. Javed",
                    action: "created product",
                    item: "POL005 - Cattle Insurance",
                    time: "Yesterday at 4:45 PM",
                  },
                  {
                    user: "Shaidul Islam",
                    action: "updated settings",
                    item: "Premium calculation rules",
                    time: "Yesterday at 9:20 AM",
                  },
                ].map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.288.534 6.121 1.477M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text- text-foreground">
                        <span className="font-semibold">{log.user}</span>{" "}
                        {log.action}{" "}
                        <span className="font-semibold">{log.item}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {log.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="messages"
            className="animate__animated animate__fadeIn"
          >
            <div className="bg-white p-6 rounded-xl shadow space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-1">
                  Messages
                </h2>
                <p className="text-muted-foreground">
                  Communications from field assessors and farmers
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: "Dr. Nazmul Huda",
                    role: "Field Assessor",
                    subject: "Assessment Report - CCL021",
                    message:
                      "I've completed the field assessment for the cattle disease outbreak. The loss is confirmed at 70%...",
                    time: "2 hours ago",
                    unread: true,
                  },
                  {
                    name: "Abdul Karim",
                    role: "Farmer",
                    subject: "Supporting Documents for Cow Claim",
                    message:
                      "I'm submitting the vaccination records and veterinary reports as requested for my cow insurance claim...",
                    time: "5 hours ago",
                    unread: true,
                  },
                  {
                    name: "Fatema Begum",
                    role: "Field Assessor",
                    subject: "Weekly Cattle Health Summary",
                    message:
                      "Here's the summary of cattle health assessments completed this week. Total cases reviewed: 9...",
                    time: "1 day ago",
                    unread: false,
                  },
                ].map((msg, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start p-4 border rounded-lg bg-gray-50"
                  >
                    {/* Left section with icon and message content */}
                    <div className="flex space-x-4">
                      <svg
                        className="w-10 h-10 text-blue-600 bg-blue-100 p-2 rounded-md"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                        />
                      </svg>

                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">
                          {msg.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {msg.role}
                        </p>
                        <p className="font-medium text-sm text-foreground">
                          {msg.subject}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {msg.message}
                        </p>
                        <a
                          href="#"
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          View Full Message
                        </a>
                      </div>
                    </div>

                    {/* Right section: time and unread dot */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {msg.time}
                      </span>
                      {msg.unread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;
