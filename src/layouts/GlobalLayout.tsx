import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/common/Button";
import { ArrowBigUpDashIcon } from "lucide-react";
import ThemeToggle from "../components/common/ThemeToggle"; // <-- 1. Lo importas

const MotionArrow = motion(ArrowBigUpDashIcon);

export default function GlobalLayout() {
  return (
    <>
      <Outlet />

      {/* Botón flotante para cambiar el tema (esquina inferior izquierda) */}
      <div className="fixed bottom-6 left-6 z-50">
        <ThemeToggle />
      </div>

      {/* Tu botón de volver arriba (esquina inferior derecha) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="primary" 
          className="rounded-full min-w-0 ml-3 group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <MotionArrow 
            size={20} 
            strokeWidth={2.5}
            initial={{ y: 0 }}
            whileHover={{ 
              y: [0, -4, 0],
              transition: { 
                duration: 0.5, 
                repeat: Infinity, 
                repeatType: "loop",
                ease: "easeInOut" 
              } 
            }}
          />
        </Button>
      </div>
    </>
  );
}