import React from "react";
import "@/styles/loader.css";

interface LoadingProps {
  text?: string;
  className?: string;
}

const Loading = ({ text, className }: LoadingProps) => {
  return (
    <div
      className={`flex flex-col justify-center items-center p-10 ${className}`}
    >
      <span className="loader"></span>
      <p>{text}</p>
    </div>
  );
};

export default Loading;
