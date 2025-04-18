import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { routes } from "./utils/routes.ts";
import { Toaster } from "sonner";

const router = routes;

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        duration: 2000,
      }}
    />
  </>
);
