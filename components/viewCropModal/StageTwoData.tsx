import React from "react";

const StageTwoData = ({ data }: { data: any }) => {
  return (
    <div className="text-gray-600">
      {data ? (
        <pre className="bg-gray-50 p-4 rounded border">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        "No stage 2 data yet"
      )}
    </div>
  );
};

export default StageTwoData;
