import React from "react";
import { GiMushroomGills } from "react-icons/gi";

export type MushroomProps = {
  className?: string;
};

const Mushroom: React.FC<MushroomProps> = ({ className }) => {
  return <GiMushroomGills className={className} />;
};

export default Mushroom;
