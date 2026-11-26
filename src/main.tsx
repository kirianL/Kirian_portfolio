import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@/styles/global.css";
import App from "@/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/*
      React Router wraps every history update in `startTransition` by default,
      and no `flushSync` can flush that: the route landed a frame or two after
      the view-transition callback resolved, so the incoming page was captured
      before it existed. Turning the wrapper off makes the navigation commit
      inside the callback, which is what a shared-element flight needs.
    */}
    <BrowserRouter useTransitions={false}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
