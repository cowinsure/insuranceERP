import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import type { InvoiceData } from "../invoice"

// Advanced PDF generation using html2canvas (with OKLCH fix)
export const generateInvoicePDF = async (invoiceElement: HTMLElement, filename = "invoice.pdf") => {
  try {
    // Pre-process the element to fix OKLCH colors
    const clonedElement = invoiceElement.cloneNode(true) as HTMLElement

    // Replace problematic CSS with safe alternatives
    const style = document.createElement("style")
    style.textContent = `
      * {
        color: rgb(0, 0, 0) !important;
      }
      .text-blue-900, [style*="color: #1e3a8a"] {
        color: rgb(30, 58, 138) !important;
      }
      .bg-blue-900, [style*="background-color: #1e3a8a"] {
        background-color: rgb(30, 58, 138) !important;
      }
      .bg-blue-50, [style*="background-color: #eff6ff"] {
        background-color: rgb(239, 246, 255) !important;
      }
      .text-gray-600, [style*="color: #4b5563"] {
        color: rgb(75, 85, 99) !important;
      }
    `
    clonedElement.appendChild(style)

    // Create canvas from the processed element
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: clonedElement.scrollWidth,
      height: clonedElement.scrollHeight,
      onclone: (clonedDoc) => {
        // Additional processing on the cloned document
        const clonedBody = clonedDoc.body
        clonedBody.style.fontFamily = "Arial, sans-serif"
      },
    })

    const imgData = canvas.toDataURL("image/png")

    // Calculate dimensions
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4")
    let position = 0

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save the PDF
    pdf.save(filename)
    return true
  } catch (error) {
    console.error("Error generating advanced PDF:", error)
    throw error
  }
}

// Enhanced PDF generation with 4-items-per-page limit
export const generateSimplePDF = (data: InvoiceData, filename = "invoice.pdf") => {
  try {
    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = 210
    const pageHeight = 297
    const margin = 20
    const contentWidth = pageWidth - 2 * margin
    const headerHeight = 60
    const footerHeight = 30
    const itemsPerPage = 4 // Maximum 4 items per page

    let currentPage = 1
    let yPosition = margin + headerHeight

    // Helper function to add text
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      pdf.setFontSize(options.fontSize || 12)
      pdf.setFont("helvetica", options.fontStyle || "normal")
      if (options.color) {
        if (Array.isArray(options.color)) {
          pdf.setTextColor(options.color[0], options.color[1], options.color[2])
        } else {
          pdf.setTextColor(options.color)
        }
      }
      pdf.text(text, x, y)
      return y + (options.lineHeight || 6)
    }

    // Function to add header to current page
    const addHeader = () => {
      // Header background
      pdf.setFillColor(248, 250, 252) // Light gray background
      pdf.rect(0, 0, pageWidth, headerHeight + margin, "F")

      // Company name and invoice badge
      pdf.setFillColor(30, 58, 138) // Blue-900
      pdf.rect(pageWidth - margin - 40, margin, 40, 15, "F")
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("INVOICE", pageWidth - margin - 35, margin + 10)

      // Company name
      pdf.setTextColor(30, 58, 138)
      pdf.setFontSize(20)
      pdf.setFont("helvetica", "bold")
      pdf.text(data.companyName, margin, margin + 15)

      // Invoice details (right side)
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      let rightY = margin + 25
      rightY = addText(`Invoice #: ${data.invoiceNumber}`, pageWidth - margin - 60, rightY, { fontSize: 9 })
      rightY = addText(`Date: ${new Date(data.invoiceDate).toLocaleDateString()}`, pageWidth - margin - 60, rightY, {
        fontSize: 9,
      })
      rightY = addText(`Due Date: ${new Date(data.dueDate).toLocaleDateString()}`, pageWidth - margin - 60, rightY, {
        fontSize: 9,
      })

      // Company details (left side)
      pdf.setTextColor(75, 85, 99)
      pdf.setFontSize(8)
      let leftY = margin + 25
      leftY = addText(data.companyAddress, margin, leftY, { fontSize: 8 })
      leftY = addText(`${data.companyCity}, ${data.companyState} ${data.companyZip}`, margin, leftY, { fontSize: 8 })
      leftY = addText(data.companyEmail, margin, leftY, { fontSize: 8 })
      leftY = addText(data.companyPhone, margin, leftY, { fontSize: 8 })

      // Header separator line
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, headerHeight + margin - 5, pageWidth - margin, headerHeight + margin - 5)
    }

    // Function to add footer to current page
    const addFooter = () => {
      const footerY = pageHeight - footerHeight

      // Footer separator line
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, footerY, pageWidth - margin, footerY)

      // Footer background
      pdf.setFillColor(248, 250, 252)
      pdf.rect(0, footerY, pageWidth, footerHeight, "F")

      // Page number
      pdf.setTextColor(100, 100, 100)
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "normal")
      pdf.text(`Page ${currentPage}`, pageWidth - margin - 15, footerY + 10)

      // Footer content
      pdf.setTextColor(30, 58, 138)
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "bold")
      pdf.text("Terms & Conditions:", margin, footerY + 10)

      pdf.setTextColor(75, 85, 99)
      pdf.setFontSize(7)
      pdf.setFont("helvetica", "normal")
      const termsText = data.terms.length > 100 ? data.terms.substring(0, 100) + "..." : data.terms
      pdf.text(termsText, margin, footerY + 17)

      // Contact info in footer
      pdf.setTextColor(75, 85, 99)
      pdf.setFontSize(7)
      pdf.text(`${data.companyEmail} | ${data.companyPhone}`, margin, footerY + 24)
    }

    // Function to add table header
    const addTableHeader = (y: number) => {
      pdf.setFillColor(30, 58, 138)
      pdf.rect(margin, y, contentWidth, 10, "F")
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "bold")
      pdf.text("Description", margin + 2, y + 7)
      pdf.text("Qty", margin + 100, y + 7)
      pdf.text("Unit Price", margin + 120, y + 7)
      pdf.text("Total", margin + 150, y + 7)
      return y + 10
    }

    // Function to start a new page
    const startNewPage = () => {
      addFooter()
      pdf.addPage()
      currentPage++
      addHeader()
      yPosition = margin + headerHeight + 10
    }

    // Add header to first page
    addHeader()
    yPosition = margin + headerHeight + 10

    // Bill To section (only on first page)
    if (currentPage === 1) {
      pdf.setFillColor(239, 246, 255) // Blue-50
      pdf.rect(margin, yPosition, contentWidth, 30, "F")

      yPosition += 8
      yPosition = addText("Bill To:", margin + 5, yPosition, { fontSize: 12, fontStyle: "bold", color: [30, 58, 138] })
      yPosition = addText(data.clientName, margin + 5, yPosition, { fontSize: 11, fontStyle: "bold" })
      yPosition = addText(data.clientAddress, margin + 5, yPosition, { fontSize: 10 })
      yPosition = addText(`${data.clientCity}, ${data.clientState} ${data.clientZip}`, margin + 5, yPosition, {
        fontSize: 10,
      })
      yPosition = addText(data.clientCountry, margin + 5, yPosition, { fontSize: 10 })
      yPosition = addText(data.clientEmail, margin + 5, yPosition, { fontSize: 10 })

      yPosition += 15
    }

    // Process items in chunks of 4 per page
    const totalItems = data.items.length
    let itemIndex = 0

    while (itemIndex < totalItems) {
      // Add table header
      yPosition = addTableHeader(yPosition)

      // Add up to 4 items on current page
      const itemsOnThisPage = Math.min(itemsPerPage, totalItems - itemIndex)
      const currentPageItems = data.items.slice(itemIndex, itemIndex + itemsOnThisPage)

      pdf.setTextColor(0, 0, 0)
      pdf.setFont("helvetica", "normal")

      currentPageItems.forEach((item, index) => {
        // Alternating row colors
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 251)
          pdf.rect(margin, yPosition, contentWidth, 12, "F")
        }

        // Handle long descriptions with text wrapping
        const maxDescWidth = 90
        const descLines = pdf.splitTextToSize(item.description, maxDescWidth)
        const rowHeight = Math.max(12, descLines.length * 4 + 4)

        // Draw the row
        pdf.text(descLines, margin + 2, yPosition + 8)
        pdf.text(item.quantity.toString(), margin + 100, yPosition + 8)
        pdf.text(`$${item.unitPrice.toLocaleString()}`, margin + 120, yPosition + 8)
        pdf.text(`$${item.total.toLocaleString()}`, margin + 150, yPosition + 8)
        yPosition += rowHeight
      })

      itemIndex += itemsOnThisPage

      // If there are more items, start a new page
      if (itemIndex < totalItems) {
        startNewPage()
      }
    }

    // Add totals section on the last page
    yPosition += 15
    pdf.setFillColor(239, 246, 255)
    pdf.rect(margin + contentWidth - 60, yPosition, 60, 35, "F")

    yPosition += 8
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")
    pdf.text("Subtotal:", margin + contentWidth - 55, yPosition)
    pdf.text(`$${data.subtotal.toLocaleString()}`, margin + contentWidth - 15, yPosition)
    yPosition += 6
    pdf.text(`Tax (${(data.taxRate * 100).toFixed(1)}%):`, margin + contentWidth - 55, yPosition)
    pdf.text(`$${data.tax.toLocaleString()}`, margin + contentWidth - 15, yPosition)
    yPosition += 8
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(30, 58, 138)
    pdf.text("Total Amount Due:", margin + contentWidth - 55, yPosition)
    pdf.text(`$${data.total.toLocaleString()}`, margin + contentWidth - 15, yPosition)

    // Payment info and notes (only on last page)
    yPosition += 25

    // Check if we need space for payment info, if not, start new page
    if (yPosition > pageHeight - footerHeight - 50) {
      startNewPage()
    }

    pdf.setTextColor(30, 58, 138)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(10)
    pdf.text("Payment Information", margin, yPosition)
    pdf.text("Notes", margin + contentWidth / 2, yPosition)

    yPosition += 8
    pdf.setTextColor(0, 0, 0)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(9)

    // Payment info
    let paymentY = yPosition
    paymentY = addText(`Bank: ${data.bankName}`, margin, paymentY, { fontSize: 9 })
    paymentY = addText(`Account: ${data.accountNumber}`, margin, paymentY, { fontSize: 9 })
    paymentY = addText(`Routing: ${data.routingNumber}`, margin, paymentY, { fontSize: 9 })
    paymentY = addText(`PayPal: ${data.paypalEmail}`, margin, paymentY, { fontSize: 9 })

    // Notes
    const noteLines = pdf.splitTextToSize(data.notes, contentWidth / 2 - 10)
    pdf.text(noteLines, margin + contentWidth / 2, yPosition)

    // Add footer to the last page
    addFooter()

    pdf.save(filename)
    return true
  } catch (error) {
    console.error("Error generating simple PDF:", error)
    throw new Error("Failed to generate PDF")
  }
}

// Main PDF generation function with automatic fallback
export const generatePDF = async (data: InvoiceData, pdfElement?: HTMLElement | null, filename = "invoice.pdf") => {
  try {
    // For multi-page support with headers/footers and 4-item limit, always use the simple method
    // which has proper multi-page handling
    generateSimplePDF(data, filename)
    return true
  } catch (error) {
    console.error("PDF generation failed:", error)
    throw new Error("Failed to generate PDF")
  }
}
