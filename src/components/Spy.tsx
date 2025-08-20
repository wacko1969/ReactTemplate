import React from "react";
import { GiSpy } from "react-icons/gi";

export type SpyProps = {
  className?: string;
};

const Spy: React.FC<SpyProps> = ({ className }) => {
  return <GiSpy className={className} />;
};

export default Spy;
