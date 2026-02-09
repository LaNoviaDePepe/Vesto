import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";

export default function NavbarPageFooterLayout() {
    return (
        <div className="min-h-screen flex flex-col">

            <Header />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />

        </div>
    );
}
