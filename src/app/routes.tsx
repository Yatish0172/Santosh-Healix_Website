import { createHashRouter } from "react-router";
import Root from "./Root";
import { HomePage, AboutPage, ServicesPage, TeamPage, ContactPage } from "./App";

export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,       Component: HomePage },
      { path: "about",     Component: AboutPage },
      { path: "services",  Component: ServicesPage },
      { path: "team",      Component: TeamPage },
      { path: "contact",   Component: ContactPage },
    ],
  },
]);
