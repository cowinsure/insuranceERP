"use client";

import { useEffect, useRef, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { FarmersFilters } from "@/components/farmers-filters";
import { FarmersTable } from "@/components/farmers-table";
import { Input } from "@/components/ui/input";
import { Bell, Search, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import GenericModal from "@/components/ui/GenericModal";
import { Stepper } from "@/components/Stepper";
import { toast, Toaster } from "sonner";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import PersonalInfoForm, {
  PersonalInfoRef,
} from "@/components/addFarmerForms/PersonalInfoForm";
import NomineeInfoForm, {
  NomineeInfoRef,
} from "@/components/addFarmerForms/NomineeInfoForm";
import FinancialInfoForm, {
  FinancialInfoRef,
} from "@/components/addFarmerForms/FinancialInfoForm";
import PreviewSubmit from "@/components/PreviewForm";

export default function FarmersPage() {
  const [isOpen, setIsOpen] = useState(false);

  // personal info state saved into local storage
  const [personalFormData, setPersonalFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("personalFormData");
      return saved
        ? JSON.parse(saved)
        : {
            phone: "",
            first_name: "",
            last_name: "",
            nid: "",
            date_of_birth: "",
            gender: "",
            tin: "",
            thana: "",
            upazila: "",
            zilla: "",
            union: "",
            village: "",
          };
    }
    return {
      phone: "",
      first_name: "",
      last_name: "",
      nid: "",
      date_of_birth: "",
      gender: "",
      tin: "",
      thana: "",
      upazila: "",
      zilla: "",
      union: "",
      village: "",
    };
  });
  const [financialInfo, setFinancialInfo] = useState({
    bank_name: "",
    branch_name: "",
    account_name: "",
    account_number: "",
  });
  const [nomineeInfo, setNomineeInfo] = useState({
    nominee_name: "",
    phone: "",
    nid: "",
    relationship: "",
    email: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [nidFront, setNidFront] = useState<File | null>(null);
  const [nidBack, setNidBack] = useState<File | null>(null);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const steps = [
    "Add Personal Info",
    "Add Financial Info",
    "Add Nominee Info",
    "Preview",
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const personalInfoRef = useRef<PersonalInfoRef>(null);
  const financialInfoRef = useRef<FinancialInfoRef>(null);
  const nomineeInfoRef = useRef<NomineeInfoRef>(null);

  // Load saved personal info form data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "personalFormData",
        JSON.stringify(personalFormData)
      );
    }
  }, [personalFormData]);

  // On mount, load saved data from localStorage
  useEffect(() => {
    const savedFinancialInfo = localStorage.getItem("financialFormData");
    if (savedFinancialInfo) {
      setFinancialInfo(JSON.parse(savedFinancialInfo));
    }
  }, []);

  // Load nominee info from localStorage on mount
  useEffect(() => {
    const savedNomineeInfo = localStorage.getItem("nomineeFormData");
    if (savedNomineeInfo) {
      setNomineeInfo(JSON.parse(savedNomineeInfo));
    }
  }, []);

  const resetAll = () => {
    setPersonalFormData({
      phone: "",
      first_name: "",
      last_name: "",
      nid: "",
      date_of_birth: "",
      gender: "",
      tin: "",
      thana: "",
      upazila: "",
      zilla: "",
      union: "",
      village: "",
    });

    setFinancialInfo({
      bank_name: "",
      branch_name: "",
      account_name: "",
      account_number: "",
    });

    setNomineeInfo({
      nominee_name: "",
      phone: "",
      nid: "",
      relationship: "",
      email: "",
    });

    setProfileImage(null);
    setNidFront(null);
    setNidBack(null);
    // reset other form states too (e.g. financial & nominee)
  };

  const handleNext = () => {
    let valid = false;

    if (currentStep === 0)
      valid = personalInfoRef.current?.validateFields() ?? false;
    else if (currentStep === 1)
      valid = financialInfoRef.current?.validateFields() ?? false;
    else if (currentStep === 2)
      valid = nomineeInfoRef.current?.validateFields() ?? false;
    else valid = true;

    if (!valid) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Combine all form data
      const combinedFormData = {
        personal: personalFormData,
        financial: financialInfo,
        nominee: nomineeInfo,
        files: {
          profileImage: profileImage ? profileImage.name : null,
          nidFront: nidFront ? nidFront.name : null,
          nidBack: nidBack ? nidBack.name : null,
        },
      };

      // 👉 Optional: Log or send data to API
      //("Submitting data:", combinedFormData);

      // Replace with real API call if needed
      // await api.post('/submit-farmer', formPayload);

      // Show success toast
      toast.success("Form submitted successfully!");
      resetAll();

      // Clear local storage
      localStorage.removeItem("personalFormData");
      localStorage.removeItem("financialFormData");
      localStorage.removeItem("nomineeFormData");

      // Reset the UI
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(0);
        setCompletedSteps(new Set());
        setIsOpen(false);
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong during submission.");
      setIsLoading(false);
    }
  };

  // Update handler to update state and save to localStorage
  const handleFinancialInfoChange = (field: string, value: string) => {
    setFinancialInfo((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem("financialFormData", JSON.stringify(updated));
      return updated;
    });
  };

  // Handler to update state and localStorage on change
  const handleNomineeInfoChange = (field: string, value: string) => {
    setNomineeInfo((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem("nomineeFormData", JSON.stringify(updated));
      return updated;
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoForm
            ref={personalInfoRef}
            formData={personalFormData}
            setFormData={setPersonalFormData}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            nidFront={nidFront}
            setNidFront={setNidFront}
            nidBack={nidBack}
            setNidBack={setNidBack}
          />
        );
      case 1:
        return (
          <FinancialInfoForm
            ref={financialInfoRef}
            data={financialInfo}
            onChange={handleFinancialInfoChange}
          />
        );
      case 2:
        return (
          <NomineeInfoForm
            ref={nomineeInfoRef}
            data={nomineeInfo}
            onChange={handleNomineeInfoChange}
          />
        );
      case 3:
        return (
          <PreviewSubmit
            data={{
              personalFormData,
              financialInfo,
              nomineeInfo,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 lg:p-6 pb-16 lg:pb-0">
      <div className="grid grid-cols-3 lg:flex items-center justify-between">
        <div className="col-span-2">
          <h1 className="text-xl lg:text-3xl font-bold text-gray-900">
            Farmers Management
          </h1>
          <p className="text-gray-600 text-sm md:text-md">
            Manage farmer registrations and view their insurance portfolios
          </p>
        </div>
        <div className="flex justify-end">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onOpen}
          >
            <Plus className="w-4 h-4" />
            Add Farmer
          </Button>
        </div>
      </div>

      <div className="animate__animated animate__fadeIn">
        <FarmersTable />
      </div>

      {/* Premium Modal */}
      {isOpen && (
        <GenericModal closeModal={onClose}>
          <div className="">
            {/* Stepper */}
            <div className="bg-white rounded-xl mb-4">
              <Stepper
                steps={steps}
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
            </div>

            {/* Step Content */}
            <div className="overflow-y-auto h-[550px] bg-white rounded-b-xl p-5 border rounded-lg">
              {renderStep()}
            </div>

            {/* Buttons */}
            <div
              className={`flex mt-4 ${
                currentStep === 0 ? "justify-end" : "justify-between"
              }`}
            >
              {currentStep !== 0 && (
                <button
                  onClick={handlePrev}
                  className="cursor-pointer px-4 py-2 border border-blue-700 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center gap-1"
                >
                  <IoIosArrowBack /> Prev
                </button>
              )}

              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center gap-1"
                >
                  <FaCircleCheck /> {isLoading ? "Submitting..." : "Submit"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center gap-1"
                >
                  Next <IoIosArrowForward />
                </button>
              )}
            </div>
          </div>
        </GenericModal>
      )}
      <Toaster richColors />
    </div>
  );
}
