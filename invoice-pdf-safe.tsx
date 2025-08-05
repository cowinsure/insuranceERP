import type { InvoiceData } from "./invoice"

interface InvoicePDFSafeProps {
  data: InvoiceData
}

export default function InvoicePDFSafe({ data }: InvoicePDFSafeProps) {
  const styles = {
    container: {
      width: "210mm",
      minHeight: "297mm",
      padding: "20mm",
      backgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif",
      color: "#000000",
      fontSize: "14px",
      lineHeight: "1.4",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "32px",
    },
    companyName: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#1e3a8a",
      marginBottom: "16px",
    },
    companyInfo: {
      color: "#4b5563",
      fontSize: "12px",
    },
    invoiceBadge: {
      backgroundColor: "#1e3a8a",
      color: "#ffffff",
      padding: "12px 24px",
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "16px",
      display: "inline-block",
    },
    invoiceDetails: {
      fontSize: "12px",
      textAlign: "right" as const,
    },
    billToSection: {
      marginBottom: "32px",
    },
    billToTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#1e3a8a",
      marginBottom: "12px",
    },
    billToBox: {
      backgroundColor: "#eff6ff",
      padding: "16px",
      borderRadius: "8px",
    },
    clientName: {
      fontWeight: "bold",
      color: "#1e3a8a",
      marginBottom: "8px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      marginBottom: "32px",
    },
    tableHeader: {
      backgroundColor: "#1e3a8a",
      color: "#ffffff",
      padding: "16px",
      fontWeight: "bold",
      fontSize: "12px",
    },
    tableCell: {
      padding: "16px",
      borderBottom: "1px solid #e5e7eb",
      fontSize: "12px",
    },
    totalsSection: {
      backgroundColor: "#eff6ff",
      padding: "16px",
      borderRadius: "0 0 8px 8px",
    },
    totalsBox: {
      width: "256px",
      marginLeft: "auto",
      fontSize: "12px",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
    },
    finalTotal: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#1e3a8a",
      paddingTop: "8px",
      borderTop: "1px solid #bfdbfe",
    },
    bottomSection: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "32px",
      marginBottom: "32px",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#1e3a8a",
      marginBottom: "12px",
    },
    infoBox: {
      backgroundColor: "#eff6ff",
      padding: "16px",
      borderRadius: "8px",
      fontSize: "12px",
    },
    termsSection: {
      borderTop: "1px solid #e5e7eb",
      paddingTop: "24px",
    },
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.companyName}>{data.companyName}</h1>
          <div style={styles.companyInfo}>
            <p>{data.companyAddress}</p>
            <p>
              {data.companyCity}, {data.companyState} {data.companyZip}
            </p>
            <p>{data.companyCountry}</p>
            <p style={{ marginTop: "12px" }}>{data.companyEmail}</p>
            <p>{data.companyPhone}</p>
            <p>{data.companyWebsite}</p>
          </div>
        </div>
        <div>
          <div style={styles.invoiceBadge}>INVOICE</div>
          <div style={styles.invoiceDetails}>
            <p>
              <strong>Invoice #:</strong> {data.invoiceNumber}
            </p>
            <p>
              <strong>Date:</strong> {new Date(data.invoiceDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Due Date:</strong> {new Date(data.dueDate).toLocaleDateString()}
            </p>
            <p style={{ marginTop: "8px", fontWeight: "bold" }}>{data.paymentTerms}</p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div style={styles.billToSection}>
        <h2 style={styles.billToTitle}>Bill To:</h2>
        <div style={styles.billToBox}>
          <h3 style={styles.clientName}>{data.clientName}</h3>
          <div style={styles.companyInfo}>
            <p>{data.clientAddress}</p>
            <p>
              {data.clientCity}, {data.clientState} {data.clientZip}
            </p>
            <p>{data.clientCountry}</p>
            <p style={{ marginTop: "8px" }}>{data.clientEmail}</p>
          </div>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div style={{ marginBottom: "32px" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.tableHeader, textAlign: "left" }}>Description</th>
              <th style={{ ...styles.tableHeader, textAlign: "center" }}>Quantity</th>
              <th style={{ ...styles.tableHeader, textAlign: "center" }}>Unit Price</th>
              <th style={{ ...styles.tableHeader, textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{item.description}</td>
                <td style={{ ...styles.tableCell, textAlign: "center" }}>{item.quantity}</td>
                <td style={{ ...styles.tableCell, textAlign: "center" }}>${item.unitPrice.toLocaleString()}</td>
                <td style={{ ...styles.tableCell, textAlign: "right", fontWeight: "bold" }}>
                  ${item.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={styles.totalsSection}>
          <div style={styles.totalsBox}>
            <div style={styles.totalRow}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: "bold" }}>${data.subtotal.toLocaleString()}</span>
            </div>
            <div style={styles.totalRow}>
              <span>Tax ({(data.taxRate * 100).toFixed(1)}%):</span>
              <span style={{ fontWeight: "bold" }}>${data.tax.toLocaleString()}</span>
            </div>
            <div style={{ ...styles.totalRow, ...styles.finalTotal }}>
              <span>Total Amount Due:</span>
              <span>${data.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information and Notes */}
      <div style={styles.bottomSection}>
        <div>
          <h3 style={styles.sectionTitle}>Payment Information</h3>
          <div style={styles.infoBox}>
            <p>
              <strong>Bank:</strong> {data.bankName}
            </p>
            <p>
              <strong>Account:</strong> {data.accountNumber}
            </p>
            <p>
              <strong>Routing:</strong> {data.routingNumber}
            </p>
            <p>
              <strong>PayPal:</strong> {data.paypalEmail}
            </p>
          </div>
        </div>

        <div>
          <h3 style={styles.sectionTitle}>Notes</h3>
          <div style={styles.infoBox}>
            <p>{data.notes}</p>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div style={styles.termsSection}>
        <h3 style={styles.sectionTitle}>Terms & Conditions</h3>
        <p style={{ fontSize: "12px", color: "#4b5563" }}>{data.terms}</p>
      </div>
    </div>
  )
}
