import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { getMyVenues } from "../services/venueService";

export default function OwnedVenueRoute() {
    const { id } = useParams();

    const [isChecking, setIsChecking] = useState(true);
    const [ownsVenue, setOwnsVenue] = useState(false);

    useEffect(() => {
        async function checkOwnership() {
            try {
                const venues = await getMyVenues();

                const ownsVenue = venues.some(
                    (venue) => venue.id === Number(id)
                );

                setOwnsVenue(ownsVenue);
            } catch (error) {
                console.error(
                    "Failed to verify venue ownership:",
                    error
                );

                setOwnsVenue(false);
            } finally {
                setIsChecking(false);
            }
        }

        checkOwnership();
    }, [id]);

    if (isChecking) {
        return <p>Checking venue access...</p>;
    }

    if (!ownsVenue) {
        return <Navigate to="/venue-owner" replace />;
    }

    return <Outlet />;
}