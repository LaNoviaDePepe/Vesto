import { useState } from "react";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";

export default function LandingLayout() {

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}
