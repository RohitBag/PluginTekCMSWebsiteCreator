import { createClient } from "@/utils/supabase/static";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import About from "@/components/home/About";
import Portfolio from "@/components/home/Portfolio";
import Contact from "@/components/home/Contact";
import CustomSections from "@/components/home/CustomSections";
import ItemsSection from "@/components/home/ItemsSection";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Testimonials from "@/components/sections/Testimonials";

export const dynamic = "force-static";
export const revalidate = 15;

// Static section ID → component
function getStaticComponent(id: string): React.ReactNode | null {
  const map: Record<string, React.ReactNode> = {
    "hero": <Hero key="hero" />,
    "about": <About key="about" />,
    "items": <ItemsSection key="items" />,
    "services": <Services key="services" />,
    "portfolio": <Portfolio key="portfolio" />,
    "testimonials": <Testimonials key="testimonials" />,
    "contact": <Contact key="contact" />,
  };
  return map[id] ?? null;
}

export default async function Home() {
  const supabase = createClient();

  const [{ data: layoutSettings }, { data: customSections }] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "home_layout").single(),
    supabase.from("custom_sections").select("id, title, page_id").order("display_order", { ascending: true }),
  ]);

  // Default layout if nothing is saved yet
  const defaultLayout = [
    { id: "hero", enabled: true },
    { id: "about", enabled: true },
    { id: "items", enabled: true },
    { id: "services", enabled: true },
    { id: "portfolio", enabled: true },
    ...((customSections || []).map((cs: any) => ({ id: `custom_section_${cs.id}`, enabled: !cs.page_id }))),
    { id: "contact", enabled: true },
  ];

  const layout: any[] = layoutSettings?.value || defaultLayout;

  const enabledSections = layout.filter((s) => s.enabled);
  const isHeroFirst = enabledSections.length > 0 && enabledSections[0].id === "hero";

  return (
    <main className="min-h-screen bg-white dark:bg-black w-full flex flex-col pt-[80px]">
      <Header />

      {layout.map((section: any) => {
        if (!section.enabled) return null;

        // Handle per-section custom entries
        if (section.id.startsWith("custom_section_")) {
          const sectionId = parseInt(section.id.replace("custom_section_", ""), 10);
          return <CustomSections key={section.id} sectionId={sectionId} />;
        }

        // Legacy generic 'custom' block (fallback for old layouts)
        if (section.id === "custom") {
          return <CustomSections key="custom" />;
        }

        return getStaticComponent(section.id);
      })}

      <Footer />
    </main>
  );
}
