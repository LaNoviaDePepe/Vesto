import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";

export default function NavbarPageLayout() {
    return (
        <div className="min-h-screen flex flex-col">

            <Header />

            <main className="flex-1 bg-auxiliary-50 pt-12">
                <Outlet />
            </main>

        </div>
    );
}
