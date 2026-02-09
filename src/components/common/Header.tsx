import { useState } from 'react';
import UserHeader from './UserHeader';
import GuestHeader from './GuestHeader';

export default function Header() {
    // Estado que almacena el estado de login para determinar qué header (user:guest) se muestra
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <>
            {isLoggedIn ? <UserHeader /> : <GuestHeader />}

            {/* BOTÓN DE PRUEBA (desarrollo) */}
            <button 
                onClick={() => setIsLoggedIn(!isLoggedIn)}
                className="fixed bottom-5 right-5 z-50 px-4 py-2 bg-black text-white text-xs rounded-full opacity-50 hover:opacity-100 transition-opacity shadow-2xl border border-white/20"
            >
                Simular: {isLoggedIn ? 'LOGOUT 🚪' : 'LOGIN 🔑'}
            </button>
        </>
    );
    
    
}