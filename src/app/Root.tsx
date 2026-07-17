import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { LangContext, Lang } from "./LangContext";
import { Header, Footer, MobileBar, sans } from "./App";

export default function Root() {
  const [lang, setLang] = useState<Lang>("en");
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
  }, [lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className={`min-h-screen ${sans(lang)}`} style={{ background: "#FDFCF9", scrollbarWidth: "thin", scrollbarColor: "#E2DAD0 transparent" }}>
        <Header lang={lang} setLang={setLang} />
        <Outlet />
        <Footer lang={lang} setLang={setLang} />
        <MobileBar lang={lang} />
        <div className="h-20 lg:hidden" />
      </div>
    </LangContext.Provider>
  );
}
