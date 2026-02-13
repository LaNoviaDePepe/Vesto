import { useState } from "react";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";

export default function LandingLayout() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const toggleLogin = () => {
        setIsLoggedIn(prev => !prev);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-50">
                <Header isLoggedIn={isLoggedIn} onToggleLogin={toggleLogin} />
            </div>
                
            


                <Outlet />


            <Footer />

        </div>
    );
}
