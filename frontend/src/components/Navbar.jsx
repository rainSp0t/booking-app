import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { isAuthenticated, role, logout } = useAuth();

    function getNavClass({ isActive }) {
        return isActive
            ? "sidebar-link active"
            : "sidebar-link";
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <NavLink to="/">
                    Booking App
                </NavLink>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={getNavClass}>
                    Home
                </NavLink>

                {isAuthenticated && (
                    <NavLink
                        to="/my-bookings"
                        className={getNavClass}
                    >
                        My Bookings
                    </NavLink>
                )}

                {isAuthenticated && role === "VenueOwner" && (
                    <>
                        <div className="sidebar-section-title">
                            Venue Management
                        </div>

                        <NavLink
                            to="/venue-owner"
                            className={getNavClass}
                        >
                            My Venues
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="sidebar-bottom">
                {!isAuthenticated ? (
                    <>
                        <NavLink
                            to="/login"
                            className={getNavClass}
                        >
                            Login
                        </NavLink>

                        <NavLink
                            to="/register"
                            className={getNavClass}
                        >
                            Register
                        </NavLink>
                    </>
                ) : (
                    <button type="button" onClick={logout}>
                        Logout
                    </button>
                )}
            </div>
        </aside>
    );
}