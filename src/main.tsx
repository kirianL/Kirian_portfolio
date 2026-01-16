import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import { LanguageProvider } from "./context/language-context";

// Prevent color transitions on page load
document.documentElement.classList.add("no-transition");
window.addEventListener("load", () => {
  // Remove no-transition class after page loads
  setTimeout(() => {
    document.documentElement.classList.remove("no-transition");
  }, 100);
});

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider
      defaultTheme="dark"
      storageKey="vite-ui-theme"
      attribute="class"
      enableSystem={false}
    >
      <LanguageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
