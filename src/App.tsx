import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";

// Lazy loading for sections below the fold if needed, but for a one-page portfolio,
// direct imports are often fine for SEO. I'll stick to direct for now to ensure smooth scroll.

function App() {
  return (
    <div className="relative min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary">
      <Header />

      <main className="pb-32">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
