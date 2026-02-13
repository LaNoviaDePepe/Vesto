import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";

export default function NavbarPageFooterLayout() {
    return (
        <div className="min-h-screen flex flex-col">

            <Header isLoggedIn={false} onToggleLogin={function (): void {
                throw new Error("Function not implemented.");
            } } />

            <main className="flex-1 container">
                <Outlet />
            </main>

        </div>
    );
}
