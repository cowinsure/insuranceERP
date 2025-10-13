"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import FallbackImage from "../FallBackImage";
import Image from "next/image";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineCalendarToday } from "react-icons/md";
import InputField from "../InputField";
import PhotoCaptureModal from "../PhotoCaptureModal";

export interface PersonalInfoRef {
  validateFields: () => boolean;
  getValues: () => Record<string, any>;
}

interface FormDataType {
  phone: string;
  first_name: string;
  last_name: string;
  nid: string;
  date_of_birth: string;
  gender: string;
  tin: string;
  thana: string;
  upazila: string;
  zilla: string;
  union: string;
  village: string;
}

interface PersonalInfoFormProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  profileImage: File | null;
  setProfileImage: React.Dispatch<React.SetStateAction<File | null>>;
  nidFront: File | null;
  setNidFront: React.Dispatch<React.SetStateAction<File | null>>;
  nidBack: File | null;
  setNidBack: React.Dispatch<React.SetStateAction<File | null>>;
}

const PersonalInfoForm = forwardRef<PersonalInfoRef, PersonalInfoFormProps>(
  (
    {
      formData,
      setFormData,
      profileImage,
      setProfileImage,
      nidFront,
      setNidFront,
      nidBack,
      setNidBack,
    },
    ref
  ) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [nidFrontUrl, setNidFrontUrl] = useState<string | null>(null);
    const [nidBackUrl, setNidBackUrl] = useState<string | null>(null);

    // Cleanup object URLs to prevent memory leaks
    useEffect(() => {
      if (profileImage) {
        const url = URL.createObjectURL(profileImage);
        setProfileImageUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    }, [profileImage]);

    useEffect(() => {
      if (nidFront) {
        const url = URL.createObjectURL(nidFront);
        setNidFrontUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    }, [nidFront]);

    useEffect(() => {
      if (nidBack) {
        const url = URL.createObjectURL(nidBack);
        setNidBackUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    }, [nidBack]);

    useImperativeHandle(ref, () => ({
      validateFields: () => validateForm(),
      getValues: () => ({
        ...formData,
        profileImage,
        nidFront,
        nidBack,
      }),
    }));

    // Date of birth validation
    const validateDateOfBirth = (dob: string): string | undefined => {
      if (!dob.trim()) {
        return "Date of birth is required";
      }

      const birthDate = new Date(dob);
      const today = new Date();

      if (birthDate > today) {
        return "Date of birth cannot be in the future";
      }

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--; // Birthday not yet reached this year
      }

      if (age < 18) {
        return "You must be at least 18 years old";
      }

      return undefined;
    };

    // Validations for form
    const validateForm = () => {
      const newErrors: { [key: string]: string } = {};

      if (!formData.first_name.trim())
        newErrors.first_name = "First name is required";
      if (!formData.last_name.trim())
        newErrors.last_name = "Last name is required";
      if (!formData.nid.trim()) newErrors.nid = "NID number is required";
      if (formData.nid.length !== 10) newErrors.nid = "NID must be 10 digits";

      const dobError = validateDateOfBirth(formData.date_of_birth);
      if (dobError) {
        newErrors.date_of_birth = dobError;
      }
      if (!formData.gender) newErrors.gender = "Gender is required";

      if (!formData.thana.trim()) newErrors.thana = "Thana is required";
      if (!formData.village.trim()) newErrors.village = "Village is required";
      if (!formData.union.trim()) newErrors.union = "Union is required";
      if (!formData.zilla.trim()) newErrors.zilla = "Zilla is required";

      // Image validations
      if (!profileImage && !profileImageUrl)
        newErrors.profile_image = "Profile image is required";
      if (!nidFront && !nidFrontUrl)
        newErrors.nid_front = "NID front image is required";
      if (!nidBack && !nidBackUrl)
        newErrors.nid_back = "NID back image is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Input change handler
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (newErrors[name]) {
          delete newErrors[name];
        }
        return newErrors;
      });

      if (name === "date_of_birth") {
        const error = validateDateOfBirth(value);
        setErrors((prev) => ({
          ...prev,
          date_of_birth: error ?? "",
        }));
      }
    };

    // Photo capture handler
    const handlePhotoCapture = (
      file: File,
      property: string,
      setImage: React.Dispatch<React.SetStateAction<File | null>>
    ) => {
      setImage(file);
      setErrors({});
      // updateStep({
      //     [property]: file,
      // });
      console.log("Photo captured:", file);
    };

    // Reset form data
    //   const resetFormData = () => {
    //     setFormData({
    //       userType: localStorage.getItem("userId") || "",
    //       first_name: "",
    //       last_name: "",
    //       nid: "",
    //       date_of_birth: "",
    //       gender: "Male",
    //       tin: "",
    //       thana: "",
    //       upazila: "",
    //       zilla: "",
    //       union: "",
    //       village: "",
    //     });
    //     // setProfileImage(null);
    //     // setNidFront(null);
    //     // setNidBack(null);
    //   };

    return (
      <div>
        <form className="w-full">
          <div
            data-aos="fade-in"
            data-aos-delay="400"
            className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-8"
          >
            {/* Profile Image */}
            <div className="flex flex-col w-full">
              <label
                htmlFor="userType"
                className="mb-1 text-sm font-bold text-gray-600"
              >
                Profile Image
              </label>
              {profileImageUrl && (
                <div className="mt-2 text-center flex items-center justify-center">
                  <FallbackImage
                    src={profileImageUrl}
                    alt="Profile Image"
                    width={128}
                    height={128}
                    className="w-[30%] object-cover rounded-full"
                    placeholderSrc="/userplaceholder.jpg"
                  />
                </div>
              )}
              <PhotoCaptureModal
                onPhotoCapture={(file) =>
                  handlePhotoCapture(file, "profile_image", setProfileImage)
                }
                triggerText="Capture profile Image"
                title="Capture profile Image"
              />
              {errors.profile_image && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.profile_image}
                </p>
              )}
              {/* {profileImage && (
                <div className="mt-2 text-center">
                  <Image
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile Image"
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover border rounded-full"
                  />
                </div>
              )} */}
            </div>

            {/* Phone Number (Read-only) */}
            <InputField
              placeholder="Enter Phone Number"
              type="number"
              label="Phone Number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />

            {/* First & Last Name */}
            <InputField
              placeholder="Enter first name"
              type="text"
              label="First Name"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              error={errors.first_name}
            />

            <InputField
              placeholder="Enter last name"
              type="text"
              label="Last Name"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              error={errors.last_name}
            />

            {/* Gender */}
            <div className="relative w-full flex flex-col">
              <label
                htmlFor="gender"
                className="mb-1 text-sm font-bold text-gray-600"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`appearance-none w-full border bg-gray-50 rounded-md p-2 pr-10 font-semibold cursor-pointer
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-blue-50 hover:bg-blue-50
          ${errors.gender ? "border-red-600" : "border-gray-300"}`}
              >
                <option value="" className="text-sm text-gray-400">
                  Select gender
                </option>
                <option value="male" className="text-sm text-gray-700">
                  Male
                </option>
                <option value="female" className="text-sm text-gray-700">
                  Female
                </option>
                <option value="other" className="text-sm text-gray-700">
                  Other
                </option>
              </select>
              <div className="pointer-events-none absolute right-3 top-8.5 text-gray-400">
                <IoMdArrowDropdown className="text-xl" />
              </div>
              {errors.gender && (
                <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="relative w-full">
              <InputField
                label="Date of Birth"
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                error={errors.date_of_birth}
                // max={new Date().toISOString().split("T")[0]}
              />
              <div className="pointer-events-none absolute right-3 bottom-2.5 text-gray-400">
                <MdOutlineCalendarToday className="text-lg" />
              </div>
            </div>

            {/* NID Front */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-bold text-gray-600">
                NID Front
              </label>
              {!nidFront && (
                <PhotoCaptureModal
                  onPhotoCapture={(file) =>
                    handlePhotoCapture(file, "nid_front", setNidFront)
                  }
                  triggerText="Click to upload front image"
                  title="Capture NID Front"
                />
              )}
              {errors.nid_front && (
                <p className="text-red-600 text-sm mt-1">{errors.nid_front}</p>
              )}
              {(nidFront || nidFrontUrl) && (
                <div className="mt-2 text-center flex items-center justify-center">
                  <FallbackImage
                    src={
                      nidFront
                        ? URL.createObjectURL(nidFront)
                        : nidFrontUrl || ""
                    }
                    alt="NID Front"
                    width={128}
                    height={128}
                    className="w-[50%] object-cover rounded"
                    placeholderSrc="/front.png"
                  />
                </div>
              )}
            </div>

            {/* NID Back */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-bold text-gray-600">
                NID Back
              </label>
              {!nidBack && (
                <PhotoCaptureModal
                  onPhotoCapture={(file) =>
                    handlePhotoCapture(file, "nid_back", setNidBack)
                  }
                  triggerText="Click to upload back image"
                  title="Capture NID Back"
                />
              )}
              {errors.nid_back && (
                <p className="text-red-600 text-sm mt-1">{errors.nid_back}</p>
              )}
              {(nidBack || nidBackUrl) && (
                <div className="mt-2 text-center flex items-center justify-center">
                  <FallbackImage
                    src={
                      nidBack ? URL.createObjectURL(nidBack) : nidBackUrl || ""
                    }
                    alt="NID Back"
                    width={128}
                    height={128}
                    className="w-[50%] object-cover rounded"
                    placeholderSrc="/back.png"
                  />
                </div>
              )}
            </div>

            {/* NID Number */}
            <InputField
              placeholder="Enter NID number"
              label="NID (10 digit number)"
              id="nid"
              name="nid"
              type="text"
              maxLength={10}
              value={formData.nid}
              onChange={handleInputChange}
              error={errors.nid}
            />

            {/* Address Fields */}
            <InputField
              placeholder="Enter TIN number"
              label="TIN No."
              id="tin"
              name="tin"
              value={formData.tin}
              onChange={handleInputChange}
              error={errors.tin}
            />

            <InputField
              placeholder="Enter thana"
              label="Thana"
              id="thana"
              name="thana"
              value={formData.thana}
              onChange={handleInputChange}
              error={errors.thana}
            />

            <InputField
              placeholder="Enter village"
              label="Village"
              id="village"
              name="village"
              value={formData.village}
              onChange={handleInputChange}
              error={errors.village}
            />

            <InputField
              placeholder="Enter union"
              label="Union"
              id="union"
              name="union"
              value={formData.union}
              onChange={handleInputChange}
              error={errors.union}
            />

            <InputField
              placeholder="Enter zilla"
              label="Zilla"
              id="zilla"
              name="zilla"
              value={formData.zilla}
              onChange={handleInputChange}
              error={errors.zilla}
            />
          </div>
        </form>
      </div>
    );
  }
);

export default PersonalInfoForm;
