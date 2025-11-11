import React from "react";
import { GiSasquatch } from "react-icons/gi";

export type SasquatchProps = {
  className?: string;
};

const Sasquatch: React.FC<SasquatchProps> = ({ className }) => {
  return <GiSasquatch className={className} />;
};

export default Sasquatch;
