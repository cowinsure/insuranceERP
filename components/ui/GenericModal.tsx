"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "animate.css";
import { MdClose } from "react-icons/md";

interface GenericModalProps {
  closeModal: () => void;
  title?: React.ReactNode | string;
  children?: React.ReactNode;
  content?: string;
  onConfirm?: () => void;
  widthValue?: string;
}

const GenericModal = ({
  closeModal,
  title,
  children,
  widthValue,
}: GenericModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalWrapperRef = useRef<HTMLDivElement>(null);

  // Mount check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ESC key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Outside click
  // const handleOverlayClick = (e: React.MouseEvent) => {
  //   if (
  //     modalWrapperRef.current &&
  //     !modalWrapperRef.current.contains(e.target as Node)
  //   ) {
  //     triggerClose();
  //   }
  // };

  // Closing animation handler
  const triggerClose = () => {
    setIsClosing(true);
  };

  // Wait for animation to finish before unmounting
  const handleAnimationEnd = () => {
    if (isClosing) {
      closeModal();
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate__animated ${
        isClosing ? "animate__fadeOut" : "animate__fadeIn"
      }`}
      // onClick={handleOverlayClick}
      onAnimationEnd={handleAnimationEnd}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalWrapperRef}
        className={`bg-white rounded-xl shadow-2xl p-2 md:p-6 ${
          widthValue ? widthValue : "w-full max-w-5xl"
        } animate__animated min-w-md ${
          isClosing ? "animate__fadeOutUp" : "animate__fadeInDown"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={triggerClose}
            className="text-gray-500 hover:text-gray-800 transition"
            aria-label="Close Modal"
          >
            <MdClose size={20} className="hover:text-red-600 cursor-pointer" />
          </button>
        </div>
        <div className="text-sm text-gray-700">
          {children || "This is a dynamic modal."}
        </div>
      </div>
    </div>
  );

  if (!isMounted) return null;

  return createPortal(modalContent, document.body);
};

export default GenericModal;
