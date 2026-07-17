import { createContext, useContext } from "react";

export type Lang = "en" | "hi";
type LangCtx = { lang: Lang; setLang: (l: Lang) => void };

export const LangContext = createContext<LangCtx>({ lang: "en", setLang: () => {} });
export const useLang = () => useContext(LangContext);
