import React from "react";
import { GiSnowflake1 } from "react-icons/gi";

export type SnowFlakeProps = {
  className?: string;
};
const SnowFlake: React.FC<SnowFlakeProps> = ({ className }) => {
  return <GiSnowflake1 className={className} />;
};

export default SnowFlake;
