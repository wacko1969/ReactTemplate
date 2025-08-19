import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App className="fixed top-0 left-0 w-full h-full -z-10 bg-cover bg-center bg-no-repeat transition-[background-image] duration-1000 ease-in-out overflow-x-hidden" />
    </BrowserRouter>
  </React.StrictMode>
);
