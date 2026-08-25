import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import VenueDetails from "./pages/VenueDetails";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/venues/:id" element={<VenueDetails />} />

                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/my-bookings"
                        element={<MyBookings />}
                    />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;