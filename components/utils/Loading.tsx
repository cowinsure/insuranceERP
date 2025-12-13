import React from "react";
import "@/styles/loader.css";

interface LoadingProps {
  text?: string;
}

const Loading = ({ text }: LoadingProps) => {
  return (
    <div className="flex flex-col justify-center items-center p-10">
      <span className="loader"></span>
      <p>{text}</p>
    </div>
  );
};

export default Loading;
