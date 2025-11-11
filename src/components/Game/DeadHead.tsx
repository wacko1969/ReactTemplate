import React from "react";
import { GiDeadHead } from "react-icons/gi";

export type DeadHeadProps = {
  className?: string;
};

const DeadHead: React.FC<DeadHeadProps> = ({ className }) => {
  return <GiDeadHead className={className} />;
};

export default DeadHead;
