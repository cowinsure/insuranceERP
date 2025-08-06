"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"

const data = [
  { month: "Jan", claims: 45000, premium: 185000 },
  { month: "Feb", claims: 52000, premium: 195000 },
  { month: "Mar", claims: 48000, premium: 205000 },
  { month: "Apr", claims: 58000, premium: 215000 },
  { month: "May", claims: 51000, premium: 235000 },
  { month: "Jun", claims: 49000, premium: 255000 },
]

export function ClaimsChart() {
  return (
    <Card className="border border-gray-200 py-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Claims vs Premium Trend</CardTitle>
        <p className="text-sm text-gray-600">Monthly comparison of claims processed and premium collected</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Line
                type="monotone"
                dataKey="claims"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                name="Claims (৳)"
              />
              <Line
                type="monotone"
                dataKey="premium"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="Premium (৳)"
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
