import { useState } from "react";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";

export default function NavbarPageFooterLayout() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const toggleLogin = () => {
        setIsLoggedIn(prev => !prev);
    };

    return (
        <div className="min-h-screen flex flex-col">

            <Header isLoggedIn={isLoggedIn} onToggleLogin={toggleLogin} />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />

        </div>
    );
}
