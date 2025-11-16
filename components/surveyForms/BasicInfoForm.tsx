import { forwardRef, useImperativeHandle, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type BasicInfoRef = {
  validateFields: () => boolean;
};

import { SurveyFormData } from "../model/survey/types";

type BasicInfoFormProps = {
  data: Pick<SurveyFormData, "farmer_id" | "plot_id" | "survey_date">;
  onChange: (field: keyof SurveyFormData, value: string) => void;
};

const BasicInfoForm = forwardRef<BasicInfoRef, BasicInfoFormProps>(
  ({ data, onChange }, ref) => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
      const newErrors: Record<string, string> = {};

      if (!data.farmer_id) {
        newErrors.farmer_id = "Farmer ID is required";
      }
      if (!data.plot_id) {
        newErrors.plot_id = "Plot ID is required";
      }
      if (!data.survey_date) {
        newErrors.survey_date = "Survey date is required";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
      validateFields: validate,
    }));

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="farmer_id">Farmer ID</Label>
          <Input
            id="farmer_id"
            value={data.farmer_id}
            onChange={(e) => onChange("farmer_id", e.target.value)}
            placeholder="Enter farmer ID"
            className={errors.farmer_id ? "border-red-500" : ""}
          />
          {errors.farmer_id && (
            <span className="text-red-500 text-sm">{errors.farmer_id}</span>
          )}
        </div>

        <div>
          <Label htmlFor="plot_id">Plot ID</Label>
          <Input
            id="plot_id"
            value={data.plot_id}
            onChange={(e) => onChange("plot_id", e.target.value)}
            placeholder="Enter plot ID"
            className={errors.plot_id ? "border-red-500" : ""}
          />
          {errors.plot_id && (
            <span className="text-red-500 text-sm">{errors.plot_id}</span>
          )}
        </div>

        <div>
          <Label htmlFor="survey_date">Survey Date</Label>
          <Input
            id="survey_date"
            type="date"
            value={data.survey_date}
            onChange={(e) => onChange("survey_date", e.target.value)}
            className={errors.survey_date ? "border-red-500" : ""}
          />
          {errors.survey_date && (
            <span className="text-red-500 text-sm">{errors.survey_date}</span>
          )}
        </div>
      </div>
    );
  }
);

BasicInfoForm.displayName = "BasicInfoForm";
export default BasicInfoForm;