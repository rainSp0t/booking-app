import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import VenueDetails from "./pages/VenueDetails";
import VenueOwnerDashboard from "./pages/VenueOwnerDashboard";
import CreateVenue from "./pages/CreateVenue";

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

                <Route element={<ProtectedRoute />}>
                    <Route path="/my-bookings" element={<MyBookings />} />
                </Route>

                <Route element={<ProtectedRoute requiredRole="VenueOwner" />}>
                    <Route
                        path="/venue-owner"
                        element={<VenueOwnerDashboard />}
                    />
                </Route>

                <Route element={<ProtectedRoute requiredRole="VenueOwner" />}>
                    <Route
                        path="/venue-owner"
                        element={<VenueOwnerDashboard />}
                    />

                    <Route
                        path="/venue-owner/venues/create"
                        element={<CreateVenue />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;