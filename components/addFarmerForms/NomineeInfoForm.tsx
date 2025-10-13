import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import InputField from "../InputField";
import { IoMdArrowDropdown } from "react-icons/io";

export interface NomineeInfoRef {
  validateFields: () => boolean;
  getValues: () => Record<string, any>;
}

const NomineeInfoForm = forwardRef<
  NomineeInfoRef,
  {
    data: {
      nominee_name: string;
      phone: string;
      nid: string;
      relationship: string;
      email: string;
    };
    onChange: (field: string, value: string) => void;
  }
>(({ data, onChange }, ref) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const relationshipOptions = [
    { value: "", label: "Select Relationship" },
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "brother", label: "Brother" },
    { value: "sister", label: "Sister" },
    { value: "husband", label: "Husband" },
    { value: "wife", label: "Wife" },
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "grandfather", label: "Grandfather" },
    { value: "grandmother", label: "Grandmother" },
    { value: "uncle", label: "Uncle" },
    { value: "aunt", label: "Aunt" },
    { value: "nephew", label: "Nephew" },
    { value: "niece", label: "Niece" },
    { value: "cousin", label: "Cousin" },
    { value: "friend", label: "Friend" },
    { value: "partner", label: "Partner" },
    { value: "sibling", label: "Sibling" },
    { value: "other", label: "Other" },
  ];

  useImperativeHandle(ref, () => ({
    validateFields: () => {
      const newErrors: { [key: string]: string } = {};

      if (!data.nominee_name.trim())
        newErrors.nominee_name = "Nominee name is required";

      if (!data.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^\+?\d{7,15}$/.test(data.phone.trim()))
        newErrors.phone = "Invalid phone number";

      if (!data.nid.trim()) newErrors.nid = "NID is required";

      if (!data.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(data.email.trim()))
        newErrors.email = "Invalid email address";

      if (!data.relationship)
        newErrors.relationship = "Relationship is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    getValues: () => data,
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange(e.target.name, e.target.value);
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  return (
    <div>
      <form className="w-full">
        <div data-aos="fade-in" data-aos-delay="400" className="space-y-8">
          <InputField
            placeholder="Enter nominee name"
            label="Nominee Name"
            id="nominee_name"
            name="nominee_name"
            value={data.nominee_name}
            onChange={handleChange}
            error={errors.nominee_name}
          />
          <InputField
            placeholder="Enter phone no."
            label="Phone"
            id="phone"
            name="phone"
            type="number"
            value={data.phone}
            onChange={handleChange}
            error={errors.phone}
          />
          <InputField
            placeholder="Enter NID number"
            label="NID"
            id="nid"
            name="nid"
            type="number"
            value={data.nid}
            onChange={handleChange}
            error={errors.nid}
          />
          <InputField
            placeholder="Enter email"
            label="Email"
            id="email"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            error={errors.email}
          />
          <div className="relative w-full flex flex-col">
            <label
              htmlFor="relationship"
              className="mb-1 text-sm font-bold text-gray-600"
            >
              Relationship
            </label>

            <select
              id="relationship"
              name="relationship"
              value={data.relationship}
              onChange={handleChange}
              className={`appearance-none w-full border rounded-md p-2 pr-10 font-semibold cursor-pointer
    focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50
    hover:bg-green-50 hover:border-green-300
    ${errors.relationship ? "border-red-600" : "border-gray-300"}`}
            >
              {relationshipOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.relationship && (
              <p className="text-red-600 text-sm mt-1">{errors.relationship}</p>
            )}

            {/* Custom dropdown icon */}
            <div className="pointer-events-none absolute right-3 top-8.5 text-gray-400">
              <IoMdArrowDropdown className="text-xl" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});

export default NomineeInfoForm;
