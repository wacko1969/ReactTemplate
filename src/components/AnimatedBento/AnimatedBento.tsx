import React from "react";
import { twMerge } from "tailwind-merge";

//#region AnimatedBentoBlock
export type AnimatedBentoBlockProps = {
  className?: string;
  children: React.ReactNode;
};

export const AnimatedBentoBlock = ({
  className,
  children,
}: AnimatedBentoBlockProps) => {
  return (
    <div className={twMerge("border border-amber-200", className)}>
      {children}
    </div>
  );
};
//#endregion

//#region AnimatedBentoContent
export type AnimatedBentoContentProps = {
  className?: string;
  header: string;
  subHeader: string;
  children: [
    React.ReactElement<AnimatedBentoBlockProps, typeof AnimatedBentoBlock>,
    React.ReactElement<AnimatedBentoBlockProps, typeof AnimatedBentoBlock>,
  ];
};
export const AnimatedBentoContent = ({
  className,
  header,
  subHeader,
  children,
}: AnimatedBentoContentProps) => {
  const [primaryBlock, secondaryBlock] = children;
  return (
    <div className={twMerge("p-4 space-y-4", className)}>
      <header>
        <h1>{header}</h1>
        <h3>{subHeader}</h3>
      </header>
      <div className="grid gap-4">
        {primaryBlock}
        {secondaryBlock}
      </div>
    </div>
  );
};
//#endregion

//#region AnimatedBento
export type AnimatedBentoProps = {
  className?: string;
  children: React.ReactElement<
    AnimatedBentoContentProps,
    typeof AnimatedBentoContent
  >;
};

export const AnimatedBento = ({ className, children }: AnimatedBentoProps) => {
  return (
    <div
      className={twMerge(
        "border rounded-lg bg-zinc-800 border-amber-200 h-128",
        className
      )}
    >
      {children}
    </div>
  );
};
//#endregion

export default AnimatedBento;
