import { useEffect, useState } from "react";
import { getVenues } from "../services/venueService";
import VenueCard from "../components/VenueCard";

export default function Home() {
    const [venues, setVenues] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadVenues() {
            try {
                const data = await getVenues();

                setVenues(data);
            } catch (error) {
                console.error("Failed to load venues:", error);

                setError("Failed to load venues.");
            }
        }

        loadVenues();
    }, []);

    return (
        <div>
            <h1>Venues</h1>

            {error && <p>{error}</p>}

            {venues.map((venue) => (
                <VenueCard
                    key={venue.id}
                    venue={venue}
                />
            ))}
        </div>
    );
}