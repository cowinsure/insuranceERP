import { Loader2 } from "lucide-react"

export default function PDFLoading() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-900" />
        <span className="text-lg font-medium">Generating PDF...</span>
      </div>
    </div>
  )
}
