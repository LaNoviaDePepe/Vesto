import type { RegisterData } from "../../interfaces/RegisterData";

export const createUserRepository = () => {
    
    // Función para crear usuario
    const createUser = async (userData: RegisterData): Promise<boolean> => {
        try {
            console.log("🔵 Intentando registrar usuario en Base de Datos...");
            console.log("📦 Datos recibidos:", userData);

            // --- AQUÍ IRÍA LA LÓGICA REAL (Supabase) ---
            
            // Simulamos una espera de 1 segundo 
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log("✅ Usuario registrado con éxito (Simulación)");
            return true;

        } catch (error) {
            console.error("❌ Error al registrar usuario:", error);
            return false;
        }
    };

    // Aquí se pueden añadir más funciones como loginUser, getUser, etc.
    // Las añadiremos posteriormente
    const loginUser = async () => {
        console.log("Función de login pendiente de implementar");
    };

    return {
        createUser,
        loginUser
    };
};