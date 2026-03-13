import { Outlet } from "react-router-dom";
import { motion } from "framer-motion"; 
import Button from "../components/common/Button";
import { ArrowBigUpDashIcon } from "lucide-react";
import ThemeToggle from "../components/common/ThemeToggle"; 

const MotionArrow = motion(ArrowBigUpDashIcon);

/**
 * Componente `GlobalLayout`.
 * * Es el contenedor raíz de toda la aplicación. En este layout se montan
 * elementos que deben estar siempre presentes sin importar la ruta, como 
 * el botón flotante del Modo Oscuro y el botón para volver arriba.
 * * @returns {JSX.Element} Layout con soporte global de tema y navegación.
 */
export default function GlobalLayout() {
  return (
    <>
      <Outlet />

      {/* BOTÓN FLOTANTE DEL MODO OSCURO */}
      <div className="fixed bottom-6 left-6 z-50">
        <ThemeToggle />
      </div>

      {/* BOTÓN FLOTANTE: VOLVER ARRIBA */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="primary" 
          className="rounded-full min-w-0 ml-3 group shadow-lg" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Volver arriba"
        >
          <MotionArrow 
            size={20} 
            strokeWidth={2.5}
            initial={{ y: 0 }}
            whileHover={{ 
              y: [0, -4, 0],
              transition: { duration: 0.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" } 
            }}
          />
        </Button>
      </div>
    </>
  );
}