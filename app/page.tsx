"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, PrinterIcon as Print } from "lucide-react"
import InvoiceForm from "../invoice-form"
import Invoice, { type InvoiceData } from "../invoice"
import InvoicePDFSafe from "../invoice-pdf-safe"
import { generatePDF } from "../utils/pdf-generator"
import PDFLoading from "../components/pdf-loading"

export default function Page() {
  const [currentView, setCurrentView] = useState<"form" | "invoice">("form")
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const pdfRef = useRef<HTMLDivElement>(null)

  const handleFormSubmit = (data: InvoiceData) => {
    setInvoiceData(data)
    setCurrentView("invoice")
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    if (!invoiceData) return

    setIsGeneratingPDF(true)
    try {
      const filename = `${invoiceData.invoiceNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`

      // Use the unified PDF generation function
      await generatePDF(invoiceData, pdfRef.current, filename)
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "form" ? (
        <div>
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-4xl mx-auto px-6 py-4">
              <h1 className="text-2xl font-bold text-blue-900">Create Invoice</h1>
              <p className="text-gray-600">Fill out the form below to generate your professional invoice</p>
            </div>
          </div>
          <InvoiceForm onSubmit={handleFormSubmit} />
        </div>
      ) : (
        <div>
          <div className="bg-white shadow-sm border-b print:hidden">
            <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
              <Button variant="outline" onClick={() => setCurrentView("form")} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Form
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2 bg-transparent">
                  <Print className="w-4 h-4" />
                  Print
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={isGeneratingPDF}
                  className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
                </Button>
              </div>
            </div>
          </div>
          {invoiceData && (
            <>
              <Invoice data={invoiceData} />
              {/* Hidden PDF version for generation */}
              <div ref={pdfRef} className="fixed -left-[9999px] top-0 z-[-1]">
                <InvoicePDFSafe data={invoiceData} />
              </div>
            </>
          )}
          {isGeneratingPDF && <PDFLoading />}
        </div>
      )}
    </div>
  )
}
