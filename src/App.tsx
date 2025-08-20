import React from "react";
import AppProps from "@utils/AppProps";
import { SquareTable } from "@components/index";

function App({ className }: AppProps) {
  return (
    <div className={className}>
      <SquareTable rows={20} cols={20} />
    </div>
  );
}

export default App;
