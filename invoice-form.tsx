"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { InvoiceData, InvoiceItem } from "./invoice"

interface InvoiceFormProps {
  onSubmit: (data: InvoiceData) => void
}

export default function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  // Function to create test data with many items (to test 4-items-per-page)
  const createTestInvoiceWithManyItems = (): InvoiceData => {
    const items = [
      {
        description: "AI-Powered Web Application Development - Frontend React Components with TypeScript",
        quantity: 1,
        unitPrice: 5000,
        total: 5000,
      },
      {
        description: "Custom Neural Network Implementation - Deep Learning Model Training and Optimization",
        quantity: 2,
        unitPrice: 2500,
        total: 5000,
      },
      {
        description: "API Integration & Testing - RESTful Services and GraphQL Endpoints Development",
        quantity: 1,
        unitPrice: 1500,
        total: 1500,
      },
      {
        description: "Database Design and Optimization - PostgreSQL Schema Design with Performance Tuning",
        quantity: 1,
        unitPrice: 2000,
        total: 2000,
      },
      // Page 2 starts here (items 5-8)
      {
        description: "Cloud Infrastructure Setup - AWS/Azure Deployment Configuration and Auto-scaling",
        quantity: 1,
        unitPrice: 3000,
        total: 3000,
      },
      {
        description: "Mobile App Development - React Native Cross-Platform Application with Push Notifications",
        quantity: 1,
        unitPrice: 4500,
        total: 4500,
      },
      {
        description: "DevOps Pipeline Implementation - CI/CD with Docker, Kubernetes, and Automated Testing",
        quantity: 1,
        unitPrice: 2800,
        total: 2800,
      },
      {
        description: "Security Audit and Implementation - OAuth2, JWT Authentication, and Data Encryption",
        quantity: 1,
        unitPrice: 2200,
        total: 2200,
      },
      // Page 3 starts here (items 9-12)
      {
        description: "Performance Optimization - Code Review, Database Query Optimization, and Caching",
        quantity: 2,
        unitPrice: 1800,
        total: 3600,
      },
      {
        description: "User Experience Design - UI/UX Wireframes, Prototyping, and User Journey Mapping",
        quantity: 1,
        unitPrice: 2500,
        total: 2500,
      },
      {
        description: "Quality Assurance Testing - Automated Testing Suite Development with Jest and Cypress",
        quantity: 1,
        unitPrice: 2000,
        total: 2000,
      },
      {
        description: "Documentation and Training - Technical Documentation, User Manuals, and Team Training",
        quantity: 1,
        unitPrice: 1500,
        total: 1500,
      },
      // Page 4 starts here (items 13-16)
      {
        description: "Third-Party Integrations - Payment Gateways (Stripe, PayPal) and Social Media APIs",
        quantity: 1,
        unitPrice: 1800,
        total: 1800,
      },
      {
        description: "Data Analytics Implementation - Business Intelligence Dashboard with Real-time Metrics",
        quantity: 1,
        unitPrice: 3200,
        total: 3200,
      },
      {
        description: "Maintenance and Support - 6 Months Post-Launch Support Package with Bug Fixes",
        quantity: 1,
        unitPrice: 2400,
        total: 2400,
      },
      {
        description: "SEO Optimization - Search Engine Optimization and Content Strategy Implementation",
        quantity: 1,
        unitPrice: 1600,
        total: 1600,
      },
      // Page 5 starts here (items 17-20)
      {
        description: "Email Marketing Integration - Automated Email Campaigns Setup with Analytics Tracking",
        quantity: 1,
        unitPrice: 1200,
        total: 1200,
      },
      {
        description: "Social Media Integration - Facebook, Twitter, Instagram API Integration with Analytics",
        quantity: 1,
        unitPrice: 1400,
        total: 1400,
      },
      {
        description: "Content Management System - Custom CMS Development with Role-based Access Control",
        quantity: 1,
        unitPrice: 3500,
        total: 3500,
      },
      {
        description: "E-commerce Integration - Shopping Cart, Payment Processing, and Inventory Management",
        quantity: 1,
        unitPrice: 4000,
        total: 4000,
      },
    ]

    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const taxRate = 0.0822
    const tax = Math.round(subtotal * taxRate)
    const total = subtotal + tax

    return {
      // Company Info
      companyName: "Neural Script",
      companyAddress: "123 Innovation Drive",
      companyCity: "Tech City",
      companyState: "TC",
      companyZip: "12345",
      companyCountry: "United States",
      companyEmail: "hello@neuralscript.com",
      companyPhone: "+1 (555) 123-4567",
      companyWebsite: "www.neuralscript.com",

      // Invoice Details
      invoiceNumber: "INV-2024-001",
      invoiceDate: "2025-02-02",
      dueDate: "2025-02-17",
      paymentTerms: "Net 15",

      // Client Info
      clientName: "Acme Corporation",
      clientAddress: "456 Business Ave",
      clientCity: "Commerce City",
      clientState: "CC",
      clientZip: "67890",
      clientCountry: "United States",
      clientEmail: "billing@acme.com",

      // Items
      items,

      // Totals
      subtotal,
      taxRate,
      tax,
      total,

      // Payment Info
      bankName: "Tech Bank",
      accountNumber: "1234567890",
      routingNumber: "987654321",
      paypalEmail: "payments@neuralscript.com",

      // Notes
      notes:
        "Thank you for your business! We appreciate the opportunity to work with you. This comprehensive project includes all development phases from initial design to final deployment and ongoing support.",
      terms:
        "Payment is due within 15 days. Late payments may incur a 1.5% monthly service charge. All work is guaranteed for 90 days post-delivery. Changes to scope may result in additional charges.",
    }
  }

  const [formData, setFormData] = useState<InvoiceData>({
    // Company Info
    companyName: "Neural Script",
    companyAddress: "123 Innovation Drive",
    companyCity: "Tech City",
    companyState: "TC",
    companyZip: "12345",
    companyCountry: "United States",
    companyEmail: "hello@neuralscript.com",
    companyPhone: "+1 (555) 123-4567",
    companyWebsite: "www.neuralscript.com",

    // Invoice Details
    invoiceNumber: "INV-2024-001",
    invoiceDate: "2025-02-02",
    dueDate: "2025-02-17",
    paymentTerms: "Net 15",

    // Client Info
    clientName: "Acme Corporation",
    clientAddress: "456 Business Ave",
    clientCity: "Commerce City",
    clientState: "CC",
    clientZip: "67890",
    clientCountry: "United States",
    clientEmail: "billing@acme.com",

    // Items
    items: [
      { description: "AI-Powered Web Application Development", quantity: 1, unitPrice: 5000, total: 5000 },
      { description: "Custom Neural Network Implementation", quantity: 2, unitPrice: 2500, total: 5000 },
      { description: "API Integration & Testing", quantity: 1, unitPrice: 1500, total: 1500 },
    ],

    // Totals
    subtotal: 11500,
    taxRate: 0.0822,
    tax: 945,
    total: 12445,

    // Payment Info
    bankName: "Tech Bank",
    accountNumber: "1234567890",
    routingNumber: "987654321",
    paypalEmail: "payments@neuralscript.com",

    // Notes
    notes: "Thank you for your business! We appreciate the opportunity to work with you.",
    terms: "Payment is due within 15 days. Late payments may incur a 1.5% monthly service charge.",
  })

  const updateField = (field: keyof InvoiceData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setFormData((prev) => {
      const newItems = [...prev.items]
      newItems[index] = { ...newItems[index], [field]: value }

      // Recalculate total for this item
      if (field === "quantity" || field === "unitPrice") {
        newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
      }

      // Recalculate totals
      const subtotal = newItems.reduce((sum, item) => sum + item.total, 0)
      const tax = subtotal * prev.taxRate
      const total = subtotal + tax

      return {
        ...prev,
        items: newItems,
        subtotal,
        tax: Math.round(tax),
        total: Math.round(total),
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const loadTestData = () => {
    setFormData(createTestInvoiceWithManyItems())
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-6 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={loadTestData}
            className="bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200"
          >
            Load Test Data (20 Items - 4 Items Per Page)
          </Button>
        </div>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={(e) => updateField("companyEmail", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="companyAddress">Address</Label>
              <Input
                id="companyAddress"
                value={formData.companyAddress}
                onChange={(e) => updateField("companyAddress", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="companyPhone">Phone</Label>
              <Input
                id="companyPhone"
                value={formData.companyPhone}
                onChange={(e) => updateField("companyPhone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="companyCity">City</Label>
              <Input
                id="companyCity"
                value={formData.companyCity}
                onChange={(e) => updateField("companyCity", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="companyWebsite">Website</Label>
              <Input
                id="companyWebsite"
                value={formData.companyWebsite}
                onChange={(e) => updateField("companyWebsite", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="companyState">State</Label>
              <Input
                id="companyState"
                value={formData.companyState}
                onChange={(e) => updateField("companyState", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="companyZip">ZIP Code</Label>
              <Input
                id="companyZip"
                value={formData.companyZip}
                onChange={(e) => updateField("companyZip", e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="companyCountry">Country</Label>
              <Input
                id="companyCountry"
                value={formData.companyCountry}
                onChange={(e) => updateField("companyCountry", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => updateField("invoiceNumber", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input
                id="paymentTerms"
                value={formData.paymentTerms}
                onChange={(e) => updateField("paymentTerms", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => updateField("invoiceDate", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => updateField("clientEmail", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientAddress">Address</Label>
              <Input
                id="clientAddress"
                value={formData.clientAddress}
                onChange={(e) => updateField("clientAddress", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientCity">City</Label>
              <Input
                id="clientCity"
                value={formData.clientCity}
                onChange={(e) => updateField("clientCity", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientState">State</Label>
              <Input
                id="clientState"
                value={formData.clientState}
                onChange={(e) => updateField("clientState", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientZip">ZIP Code</Label>
              <Input
                id="clientZip"
                value={formData.clientZip}
                onChange={(e) => updateField("clientZip", e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="clientCountry">Country</Label>
              <Input
                id="clientCountry"
                value={formData.clientCountry}
                onChange={(e) => updateField("clientCountry", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900 flex justify-between items-center">
              Invoice Items ({formData.items.length} items)
              <div className="flex gap-2">
                {formData.items.length > 4 && (
                  <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded">
                    ~{Math.ceil(formData.items.length / 4)} pages
                  </span>
                )}
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                  <div className="col-span-5">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      placeholder="Service description"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Total</Label>
                    <Input value={`$${item.total.toLocaleString()}`} disabled className="bg-gray-50" />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tax Rate */}
            <div className="mt-6 flex justify-end">
              <div className="w-64">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={(formData.taxRate * 100).toFixed(2)}
                  onChange={(e) => {
                    const rate = Number.parseFloat(e.target.value) / 100 || 0
                    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0)
                    const tax = subtotal * rate
                    const total = subtotal + tax
                    setFormData((prev) => ({
                      ...prev,
                      taxRate: rate,
                      tax: Math.round(tax),
                      total: Math.round(total),
                    }))
                  }}
                />
              </div>
            </div>

            {/* Totals Display */}
            <div className="mt-4 flex justify-end">
              <div className="w-64 space-y-2 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${formData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-semibold">${formData.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-blue-900 pt-2 border-t border-blue-200">
                  <span>Total:</span>
                  <span>${formData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => updateField("bankName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => updateField("accountNumber", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                value={formData.routingNumber}
                onChange={(e) => updateField("routingNumber", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="paypalEmail">PayPal Email</Label>
              <Input
                id="paypalEmail"
                type="email"
                value={formData.paypalEmail}
                onChange={(e) => updateField("paypalEmail", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes and Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Thank you message or additional notes"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => updateField("terms", e.target.value)}
                placeholder="Payment terms and conditions"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" size="lg" className="bg-blue-900 hover:bg-blue-800">
            Generate Invoice
          </Button>
        </div>
      </form>
    </div>
  )
}
