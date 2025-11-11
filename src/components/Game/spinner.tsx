import React from "react";
import AppProps from "@utils/AppProps";

const Spinner: React.FC<AppProps> = ({ className }: AppProps) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center z-[1000] ${className ?? ""}`}
      id="spinner"
    >
      <div className="border-8 border-spinner-bg border-t-spinner-border rounded-full w-15 h-15 animate-spin"></div>
    </div>
  );
};

export default Spinner;
