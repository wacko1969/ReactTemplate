import React from "react";
import { GiCoffin } from "react-icons/gi";

export type CoffinProps = {
  className?: string;
};

const Coffin: React.FC<CoffinProps> = ({ className }) => {
  return <GiCoffin className={className} />;
};

export default Coffin;
