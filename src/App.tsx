import AnimatedBento, {
  AnimatedBentoBlock,
  AnimatedBentoContent,
} from "@components";
import React from "react";

type AppProps = {
  className?: string;
};

function App({ className }: AppProps) {
  return (
    <div className="pt-10 px-10">
      <AnimatedBento>
        <AnimatedBentoContent
          className="text-left"
          header="Case Study"
          subHeader="Animations and interactions"
        >
          <AnimatedBentoBlock className="p-4 rounded-md bg-zinc-900">
            <p className="text-sm text-amber-100">Primary metric</p>
            <p className="text-3xl font-semibold text-white">42%</p>
          </AnimatedBentoBlock>
          <AnimatedBentoBlock className="p-4 rounded-md bg-zinc-900">
            <p className="text-sm text-amber-100">Secondary metric</p>
            <p className="text-3xl font-semibold text-white">16k</p>
          </AnimatedBentoBlock>
        </AnimatedBentoContent>
      </AnimatedBento>
    </div>
  );
}

export default App;
