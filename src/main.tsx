import { createRoot } from "react-dom/client";
import "lenis/dist/lenis.css";
import App from "./app/App.tsx";
import LenisRoot from "./app/components/LenisRoot.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <LenisRoot>
    <App />
  </LenisRoot>,
);
