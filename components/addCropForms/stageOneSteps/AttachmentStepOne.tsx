"use client";
import React, { useState, useEffect, useRef } from "react";
import PhotoCaptureModal from "@/components/dialogs/PhotoCaptureModal";
import { X } from "lucide-react";
import { useLocalization } from "@/core/context/LocalizationContext";

interface AttachmentItem {
  attachment_details_id: number;
  stage_id: number | null;
  attachment_path: string;
  remarks: string;
}

interface AttachmentStepOneProps {
  stageId?: number;
  data: AttachmentItem[];
  onChange: (updatedData: AttachmentItem[]) => void;
}

const AttachmentStepOne: React.FC<AttachmentStepOneProps> = ({
  stageId,
  data,
  onChange,
}) => {
  const { t } = useLocalization();
  const [previousImages, setPreviousImages] = useState<AttachmentItem[]>([]);
  const [recentUploads, setRecentUploads] = useState<AttachmentItem[]>([]);
  const isInitialized = useRef(false);

  // Initialize previousImages only once on mount, filtering by stageId
  useEffect(() => {
    if (!isInitialized.current && data && data.length > 0 && stageId !== undefined) {
      // Filter data to only include items with matching stageId
      const filteredData = data.filter((item) => item.stage_id === stageId);
      setPreviousImages(filteredData);
      isInitialized.current = true;
    }
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePhotoCapture = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const newAttachment: AttachmentItem = {
        attachment_details_id: 0,
        attachment_path: base64,
        remarks: "",
        stage_id: stageId ?? null,
      };
      const updatedUploads = [...recentUploads, newAttachment];
      setRecentUploads(updatedUploads);
      // Pass both previous images and recent uploads to parent
      const combinedData = [...previousImages, ...updatedUploads];
      onChange(combinedData);
    } catch (error) {
      console.error("Error converting file to base64:", error);
    }
  };

  const handleRemoveRecentAttachment = (index: number) => {
    const updatedUploads = recentUploads.filter((_, i) => i !== index);
    setRecentUploads(updatedUploads);
    // Pass combined data to parent after removal
    const combinedData = [...previousImages, ...updatedUploads];
    onChange(combinedData);
  };

  const handleRemovePreviousImage = (index: number) => {
    const updatedPrevious = previousImages.filter((_, i) => i !== index);
    setPreviousImages(updatedPrevious);
    // Pass combined data to parent after removal
    const combinedData = [...updatedPrevious, ...recentUploads];
    onChange(combinedData);
  };

  return (
    <div className="space-y-5 bg-white rounded-lg lg:p-5">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        {t('attachments')}
      </h2>

      {/* Previous Images Section - API Data */}
      {previousImages.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-2">
            Previous Images
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {previousImages.map((image, index) => (
              <div key={`previous-${index}`} className="relative border rounded-lg overflow-hidden shadow-sm">
                <img
                  // src={"https://dev-backend.insurecow.com/" + image?.attachment_path}
                  src={image?.attachment_path.startsWith("data:") ? image?.attachment_path :process.env.NEXT_PUBLIC_API_ATTACHMENT_IMAGE_URL + image?.attachment_path}

                  alt={`Previous Attachment ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => handleRemovePreviousImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove attachment"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Uploaded Images Section - Base64 Data */}
      {recentUploads.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-700 border-b-2 border-green-500 pb-2">
            Recent Uploaded Images
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentUploads.map((image, index) => (
              <div key={`recent-${index}`} className="relative border rounded-lg overflow-hidden shadow-sm">
                <img
                  src={image?.attachment_path}
                  alt={`Recent Upload ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => handleRemoveRecentAttachment(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove attachment"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add photo button */}
      <div className="flex justify-center">
        <PhotoCaptureModal
          onPhotoCapture={handlePhotoCapture}
          triggerText={t('add_photo')}
          title={t('capture_or_upload_photo')}
        />
      </div>

      {previousImages.length === 0 && recentUploads.length === 0 && (
        <p className="text-center text-gray-500 italic">
          {t('no_photos_added_yet')}
        </p>
      )}
    </div>
  );
};

export default AttachmentStepOne;