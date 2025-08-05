import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface InvoiceData {
  // Company Info
  companyName: string
  companyAddress: string
  companyCity: string
  companyState: string
  companyZip: string
  companyCountry: string
  companyEmail: string
  companyPhone: string
  companyWebsite: string

  // Invoice Details
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  paymentTerms: string

  // Client Info
  clientName: string
  clientAddress: string
  clientCity: string
  clientState: string
  clientZip: string
  clientCountry: string
  clientEmail: string

  // Items
  items: InvoiceItem[]

  // Totals
  subtotal: number
  taxRate: number
  tax: number
  total: number

  // Payment Info
  bankName: string
  accountNumber: string
  routingNumber: string
  paypalEmail: string

  // Notes
  notes: string
  terms: string
}

interface InvoiceProps {
  data: InvoiceData
}

export default function Invoice({ data }: InvoiceProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-4">{data.companyName}</h1>
              <div className="text-gray-600 space-y-1">
                <p>{data.companyAddress}</p>
                <p>
                  {data.companyCity}, {data.companyState} {data.companyZip}
                </p>
                <p>{data.companyCountry}</p>
                <p className="mt-3">{data.companyEmail}</p>
                <p>{data.companyPhone}</p>
                <p>{data.companyWebsite}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-blue-900 text-white px-6 py-2 text-lg font-semibold mb-4">INVOICE</Badge>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-semibold">Invoice #:</span> {data.invoiceNumber}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {data.invoiceDate}
                </p>
                <p>
                  <span className="font-semibold">Due Date:</span> {data.dueDate}
                </p>
                <p className="mt-2 text-right font-semibold">{data.paymentTerms}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">Bill To:</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">{data.clientName}</h3>
              <div className="text-gray-600 space-y-1">
                <p>{data.clientAddress}</p>
                <p>
                  {data.clientCity}, {data.clientState} {data.clientZip}
                </p>
                <p>{data.clientCountry}</p>
                <p className="mt-2">{data.clientEmail}</p>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8">
            <div className="bg-blue-900 text-white rounded-t-lg">
              <div className="grid grid-cols-4 gap-4 p-4 font-semibold">
                <div>Description</div>
                <div className="text-center">Quantity</div>
                <div className="text-center">Unit Price</div>
                <div className="text-right">Total</div>
              </div>
            </div>

            <div className="border-x border-gray-200">
              {data.items.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200">
                  <div>{item.description}</div>
                  <div className="text-center">{item.quantity}</div>
                  <div className="text-center">${item.unitPrice.toLocaleString()}</div>
                  <div className="text-right font-semibold">${item.total.toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-blue-50 rounded-b-lg p-4">
              <div className="flex justify-end space-y-2">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${data.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({(data.taxRate * 100).toFixed(1)}%):</span>
                    <span className="font-semibold">${data.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-blue-900 pt-2 border-t border-blue-200">
                    <span>Total Amount Due:</span>
                    <span>${data.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information and Notes */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Payment Information</h3>
              <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-1">
                <p>
                  <span className="font-semibold">Bank:</span> {data.bankName}
                </p>
                <p>
                  <span className="font-semibold">Account:</span> {data.accountNumber}
                </p>
                <p>
                  <span className="font-semibold">Routing:</span> {data.routingNumber}
                </p>
                <p>
                  <span className="font-semibold">PayPal:</span> {data.paypalEmail}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Notes</h3>
              <div className="bg-blue-50 p-4 rounded-lg text-sm">
                <p>{data.notes}</p>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Terms & Conditions</h3>
            <p className="text-sm text-gray-600">{data.terms}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
