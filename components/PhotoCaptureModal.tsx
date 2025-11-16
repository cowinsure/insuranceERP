"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import { Upload, Camera, RotateCcw, RefreshCw } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
// import { FaCamera } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface PhotoCaptureModalProps {
  onPhotoCapture?: (file: File) => void;
  triggerText?: string;
  title?: string;
}

export default function PhotoCaptureModal({
  onPhotoCapture,
  triggerText = "Take Photo",
  title = "Take a Photo",
}: PhotoCaptureModalProps) {
  const [open, setOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cameraMode, setCameraMode] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [cameraReady, setCameraReady] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleFile(file);
      } else {
        toast.warning("Please upload an image file");
      }
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  // Process the selected file
  const handleFile = (file: File) => {
    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setCapturedPhoto(imageUrl);

    if (onPhotoCapture) {
      onPhotoCapture(file);
    }
  };

  // Reset photo and go back to upload state
  const resetPhoto = () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto);
    }
    setCapturedPhoto(null);
    setSelectedFile(null);
  };

  // Initialize camera
  const initializeCamera = async () => {
    try {
      // Try to get the back camera first (environment)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true);
          };
        }
        setFacingMode("environment");
        return;
      } catch (err) {
        //("Back camera failed, trying front camera", err);
      }

      // If back camera fails, try front camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
      setFacingMode("user");
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  // Open camera
  const openCamera = async () => {
    setCameraMode(true);
  };

  // Initialize camera when entering camera mode
  useEffect(() => {
    if (cameraMode && open) {
      initializeCamera();
    }

    return () => {
      // Clean up when component unmounts or camera mode changes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraMode, open]);

  // Switch camera
  const switchCamera = async () => {
    // Stop current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setCameraReady(false);

    // Toggle facing mode
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);

    // Restart camera with new facing mode
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = newStream;
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
    } catch (error) {
      console.error("Error switching camera:", error);
      toast.error("Could not switch camera. Please check permissions.");
    }
  };

  // Take photo
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) return;

    setIsTakingPhoto(true);

    // Set canvas dimensions to match video
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Draw the current video frame on the canvas
    const context = canvasRef.current.getContext("2d");
    if (context) {
      // Flip horizontally if using front camera
      if (facingMode === "user") {
        context.translate(videoWidth, 0);
        context.scale(-1, 1);
      }

      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

      // Convert to blob
      canvasRef.current.toBlob(
        (blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            setCapturedPhoto(imageUrl);

            const file = new File([blob], "captured-photo.jpg", {
              type: "image/jpeg",
            });
            setSelectedFile(file);

            if (onPhotoCapture) {
              onPhotoCapture(file);
            }

            // Stop camera stream
            if (streamRef.current) {
              streamRef.current.getTracks().forEach((track) => track.stop());
            }

            setCameraMode(false);
            setIsTakingPhoto(false);
          }
        },
        "image/jpeg",
        0.95
      );
    }
  };

  // Cancel camera
  const cancelCamera = () => {
    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setCameraMode(false);
  };

  // Add a function to clear canvas
  const clearCanvas = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
      // Reset canvas dimensions
      canvasRef.current.width = 0;
      canvasRef.current.height = 0;
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset all states when closing
      cancelCamera();
      resetPhoto();
      setCameraMode(false);
      setCameraReady(false);
      setIsTakingPhoto(false);
      setDragActive(false);
      setSelectedFile(null);
      setFacingMode("environment");
      clearCanvas(); // Add canvas clearing
    }
  };

  // Update the cleanup effect
  useEffect(() => {
    if (!open) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setCameraMode(false);
      clearCanvas(); // Add canvas clearing
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      clearCanvas(); // Add canvas clearing on unmount
    };
  }, [open]);

  // Clean up captured photo URL when component unmounts
  useEffect(() => {
    // setCapturedPhoto(null)
    return () => {
      if (capturedPhoto) {
        URL.revokeObjectURL(capturedPhoto);
      }
    };
  }, [capturedPhoto]);

  const renderContent = () => (
    <div className="w-full">
      {cameraMode ? (
        <div className="w-full">
          <div className="relative bg-black" style={{ minHeight: "300px" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
              style={{
                transform: facingMode === "user" ? "scaleX(-1)" : "none",
              }}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Alignment guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Circular outline */}
              <div className="w-48 h-48 relative">
                <div className="w-full h-full rounded-full border-4 border-dashed border-primary"></div>
              </div>
            </div>
          </div>

          {/* Camera controls */}
          <div className="flex flex-col mt-4 gap-2">
            <button
              onClick={takePhoto}
              className="flex items-center justify-center"
              disabled={!cameraReady || isTakingPhoto}
            >
              {isTakingPhoto ? (
                "Processing..."
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </>
              )}
            </button>

            <button
              onClick={switchCamera}
              className="flex items-center justify-center"
              disabled={isTakingPhoto}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Switch Camera
            </button>

            <button
              onClick={cancelCamera}
              className="flex items-center justify-center"
              disabled={isTakingPhoto}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : capturedPhoto ? (
        <div className="w-full">
          <div className="relative border rounded-md overflow-hidden">
            <img
              src={capturedPhoto || "/placeholder.svg"}
              className="w-full h-auto"
              alt="Captured"
            />
          </div>

          {/* Retry button */}
          <button
            onClick={resetPhoto}
            className="w-full mt-4 flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>

          <button onClick={() => setOpen(false)} className="w-full mt-2">
            Done
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-lg font-medium">Drag and drop your image here</p>
            <p className="text-sm text-muted-foreground">
              Or use one of the options below
            </p>

            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              <button
                onClick={() =>
                  document.getElementById("file-upload-modal")?.click()
                }
                className="border px-2 py-1 rounded-md cursor-pointer hover:bg-gray-200"
              >
                Select Image
              </button>
              <button
                className="flex items-center border px-2 py-1 rounded-md cursor-pointer hover:bg-gray-200"
                onClick={openCamera}
              >
                <Camera className="h-4 w-4 mr-2" /> Use Camera
              </button>
              <input
                id="file-upload-modal"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Supported formats: JPG, PNG, GIF, WebP
          </p>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <button className=" border-2 border-dashed border-gray-300 text-start p-2 rounded-md w-full flex flex-col items-center justify-center gap-1 text-gray-400 font-medium ">
            <MdCloudUpload className="text-4xl text-gray-600" />
            {triggerText}
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{renderContent()}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="border-2 border-dashed border-gray-300 text-start p-2 rounded-md w-full flex flex-col items-center justify-center gap-1 text-gray-400 font-medium cursor-pointer hover:border-blue-400 custom-hover group">
          <MdCloudUpload className="text-4xl text-gray-600 group-hover:text-blue-600 custom-hover" />
          {triggerText}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="">{title}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
