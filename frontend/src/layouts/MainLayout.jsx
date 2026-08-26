import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="app-layout">
            <Navbar />

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}