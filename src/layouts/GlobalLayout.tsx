import { Outlet } from "react-router-dom";
import Button from "../components/common/Button";
import { ChevronsUp } from "lucide-react";

export default function GlobalLayout() { //Layout global para incluir el botón de subir en todas las vistas.
  return (
    <>
      <Outlet />

      <div className="fixed bottom-6 right-6 z-50">
        <Button variant="icon" className="rounded-full min-w-0 ml-3"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ChevronsUp size={20} strokeWidth={2.5} />
        </Button>
      </div>
    </>
  );
}