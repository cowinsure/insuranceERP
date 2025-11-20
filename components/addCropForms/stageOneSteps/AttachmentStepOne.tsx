"use client";
import React, { useState, useEffect } from "react";
import PhotoCaptureModal from "@/components/dialogs/PhotoCaptureModal";
import { X } from "lucide-react";
import { useLocalization } from "@/core/context/LocalizationContext";

interface AttachmentItem {
  attachment_details_id: number;
  attachment_path: string;
  remarks: string;
}

interface AttachmentStepOneProps {
  data: AttachmentItem[];
  onChange: (updatedData: AttachmentItem[]) => void;
}

const AttachmentStepOne: React.FC<AttachmentStepOneProps> = ({
  data,
  onChange,
}) => {
  const { t } = useLocalization();
  const [attachments, setAttachments] = useState<AttachmentItem[]>(data || []);

  useEffect(() => {
    setAttachments(data || []);
  }, [data]);

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
      };
      const updatedAttachments = [...attachments, newAttachment];
      setAttachments(updatedAttachments);
      onChange(updatedAttachments);
    } catch (error) {
      console.error("Error converting file to base64:", error);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    const updatedAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(updatedAttachments);
    onChange(updatedAttachments);
  };

  return (
    <div className="space-y-5 bg-white rounded-lg p-5">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        {t('attachments')}
      </h2>

      {/* Display added attachments */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative border rounded-lg overflow-hidden">
              <img
                src={attachment.attachment_path}
                alt={`Attachment ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => handleRemoveAttachment(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                title="Remove attachment"
              >
                <X size={16} />
              </button>
            </div>
          ))}
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

      {attachments.length === 0 && (
        <p className="text-center text-gray-500 italic">
          {t('no_photos_added_yet')}
        </p>
      )}
    </div>
  );
};

export default AttachmentStepOne;