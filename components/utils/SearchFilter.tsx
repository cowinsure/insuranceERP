"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [query, setQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [resultCount, setResultCount] = useState<number>(data.length);

  useEffect(() => {
    // Initial load sets filtered data to full dataset
    setFilteredData(data);
    setResultCount(data.length);
  }, [data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input);

    const filtered = data.filter((item) =>
      searchKeys.some((key) =>
        item[key]?.toString().toLowerCase().includes(input.toLowerCase())
      )
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
    <div className="flex flex-col space-y-2 border bg-white py-6 px-5 rounded-lg">
      <h1 className="font-bold text-gray-800 text-xl">Search</h1>
      <div className="relative w-full ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
          className="pl-10 pr-10 bg-white border-gray-200"
        />
      </div>

      {query && (
        <>
          {noResults ? (
            <p className="text-sm text-red-500 animate-fadeIn">
              No results found
            </p>
          ) : (
            <p className="text-sm text-gray-500 animate-fadeIn">
              {resultCount} result{resultCount !== 1 && "s"} found
            </p>
          )}
        </>
      )}
    </div>
  );
};
