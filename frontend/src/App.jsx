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
import ManageVenueCourts from "./pages/ManageVenueCourts";
import ManageOpeningHours from "./pages/ManageOpeningHours";
import ManageVenueBookings from "./pages/ManageVenueBookings";
import OwnedVenueRoute from "./components/OwnedVenueRoute";
import Payment from "./pages/Payment";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/venues/:id"
                        element={<VenueDetails />}
                    />

                    {/* Authenticated user routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/my-bookings"
                            element={<MyBookings />}
                        />

                        <Route
                            path="/payment"
                            element={<Payment />}
                        />
                    </Route>

                    {/* Venue Owner routes */}
                    <Route
                        element={
                            <ProtectedRoute
                                requiredRole="VenueOwner"
                            />
                        }
                    >
                        <Route
                            path="/venue-owner"
                            element={<VenueOwnerDashboard />}
                        />

                        <Route
                            path="/venue-owner/venues/create"
                            element={<CreateVenue />}
                        />

                        {/* Only owners of the specific venue */}
                        <Route element={<OwnedVenueRoute />}>
                            <Route
                                path="/venue-owner/venues/:id/courts"
                                element={<ManageVenueCourts />}
                            />

                            <Route
                                path="/venue-owner/venues/:id/opening-hours"
                                element={<ManageOpeningHours />}
                            />

                            <Route
                                path="/venue-owner/venues/:id/bookings"
                                element={<ManageVenueBookings />}
                            />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;