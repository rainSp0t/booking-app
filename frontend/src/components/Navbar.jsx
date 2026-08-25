import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav>
            <Link to="/">Booking App</Link>

            <div>
                {!isAuthenticated ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/my-bookings">My Bookings</Link>

                        <button onClick={logout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}