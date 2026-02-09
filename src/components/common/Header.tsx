import GuestHeader from "./GuestHeader";
import UserHeader from "./UserHeader";

interface HeaderProps {
    isLoggedIn: boolean;
    onToggleLogin: () => void;
}

export default function Header({ isLoggedIn, onToggleLogin }: HeaderProps) {
    return (
        <>
            {isLoggedIn ? <UserHeader /> : <GuestHeader />}

            <button 
                onClick={onToggleLogin}
                className="fixed bottom-5 right-5 z-50 px-4 py-2 bg-black text-white text-xs rounded-full opacity-50 hover:opacity-100 transition-opacity shadow-2xl border border-white/20"
            >
                Simular: {isLoggedIn ? 'LOGOUT 🚪' : 'LOGIN 🔑'}
            </button>
        </>
    );
}