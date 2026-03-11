import { Outlet } from "react-router-dom";
import { motion } from "framer-motion"; // 2. Importamos motion
import Button from "../components/common/Button";
import { ArrowBigUpDashIcon } from "lucide-react";

// Creamos la versión animada del icono de Lucide
const MotionArrow = motion(ArrowBigUpDashIcon);

export default function GlobalLayout() {
  return (
    <>
      <Outlet />

      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="primary" 
          className="rounded-full min-w-0 ml-3 group" // Añadimos 'group'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <MotionArrow 
            size={20} 
            strokeWidth={2.5}
            initial={{ y: 0 }}
            whileHover={{ 
              y: [0, -4, 0], // Efecto de salto hacia arriba
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