import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import InputField from "../InputField";

export interface FinancialInfoRef {
  validateFields: () => boolean;
  getValues: () => Record<string, any>;
}

const FinancialInfoForm = forwardRef<
  FinancialInfoRef,
  {
    data: {
      bank_name: string;
      branch_name: string;
      account_name: string;
      account_number: string;
    };
    onChange: (field: string, value: string) => void;
  }
>(({ data, onChange }, ref) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation functions use `data` prop values now

  useImperativeHandle(ref, () => ({
    validateFields: () => {
      const newErrors: { [key: string]: string } = {};
      if (!data.bank_name.trim()) newErrors.bank_name = "Bank name is required";
      if (!data.branch_name.trim())
        newErrors.branch_name = "Branch name is required";
      if (!data.account_name.trim())
        newErrors.account_name = "Account name is required";
      if (!data.account_number.trim())
        newErrors.account_number = "Account number is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    getValues: () => data,
  }));

  // Just call onChange from parent on input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.value);
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  return (
    <div>
      <form className="w-full">
        <div className="space-y-8 rounded-md">
          <InputField
            placeholder="Enter bank name"
            label="Bank Name"
            id="bank_name"
            name="bank_name"
            value={data.bank_name}
            onChange={handleChange}
            error={errors.bank_name}
          />
          <InputField
            placeholder="Enter branch name"
            label="Branch Name"
            id="branch_name"
            name="branch_name"
            value={data.branch_name}
            onChange={handleChange}
            error={errors.branch_name}
          />
          <InputField
            placeholder="Enter account name"
            label="Account Name"
            id="account_name"
            name="account_name"
            value={data.account_name}
            onChange={handleChange}
            error={errors.account_name}
          />
          <InputField
            placeholder="Enter account number"
            type="text"
            label="Account Number"
            id="account_number"
            name="account_number"
            value={data.account_number}
            onChange={handleChange}
            error={errors.account_number}
          />
        </div>
      </form>
    </div>
  );
});

export default FinancialInfoForm;
