import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "@/components/pages/home";
import { ProjectDetail } from "@/components/pages/project-detail";
import { useLayoutEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Synchronous scroll to top before paint
    window.scrollTo(0, 0);
    // Disable browser scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="relative min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary">
      <ScrollToTop />
      <Header />

      <main className="pb-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
