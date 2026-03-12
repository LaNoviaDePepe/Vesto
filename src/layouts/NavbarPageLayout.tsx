import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";

export default function NavbarPageLayout() {
    return (
        <div className="min-h-screen flex flex-col">

            <Header />

            <main className="flex-1 bg-auxiliary-50 dark:bg-gray-950 pt-12 transition-colors duration-300">                <Outlet />
            </main>

        </div>
    );
}
