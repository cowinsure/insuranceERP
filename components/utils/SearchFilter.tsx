"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/core/context/LocalizationContext";

interface SearchFilterProps {
  placeholder: string;
  data: any[];
  setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
  searchKeys: string[];
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  placeholder,
  data,
  setFilteredData,
  searchKeys,
}) => {
  const { t } = useLocalization();
  const [query, setQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [resultCount, setResultCount] = useState<number>(data.length);

  useEffect(() => {
    setFilteredData(data);
    setResultCount(data.length);
  }, [data]);

  // Recursive function to handle nested arrays and keys
  const getNestedValue = (obj: any, keys: string[]): any => {
    if (!obj || !keys.length) return obj;
    const [firstKey, ...restKeys] = keys;

    if (Array.isArray(obj)) {
      for (const el of obj) {
        const val = getNestedValue(el, keys);
        if (val !== undefined && val !== null && val !== "") return val;
      }
      return undefined;
    }

    return getNestedValue(obj[firstKey], restKeys);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input);

    const filtered = data.filter((item) =>
      searchKeys.some((key) => {
        // Convert [0] style to .0 for uniformity
        const keysArr = key.replace(/\[(\d+)\]/g, ".$1").split(".");
        const value = getNestedValue(item, keysArr);
        return value?.toString().toLowerCase().includes(input.toLowerCase());
      })
    );

    setFilteredData(filtered);
    setResultCount(filtered.length);
    setNoResults(input.trim().length > 0 && filtered.length === 0);
  };

  const clearSearch = () => {
    setQuery("");
    setFilteredData(data);
    setResultCount(data.length);
    setNoResults(false);
  };

  return (
    <div className="">
      {/* <h1 className="font-bold text-gray-800 lg:text-xl">{t("search")}</h1> */}
      <div className="">
        <div className="relative w-full ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
              onClick={clearSearch}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Input
            placeholder={placeholder}
            value={query}
            onChange={handleSearch}
            className="pl-8 pr-6 bg-white border-2 border-blue-300 focus-within:bg-amber-400"
          />
        </div>
      </div>

      {query && (
        <>
          {noResults ? (
            <p className="text-sm text-red-500 animate-fadeIn">
              {t("no_results_found")}
            </p>
          ) : (
            <p className="text-sm text-gray-500 animate-fadeIn">
              {resultCount}{" "}
              {t(resultCount === 1 ? "result_found" : "results_found")}
            </p>
          )}
        </>
      )}
    </div>
  );
};
