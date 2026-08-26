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
        <div className="home-page">
            <header className="page-header">
                <h1>Find a venue</h1>
                <p>
                    Browse local courts and find a time that works for you.
                </p>
            </header>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {venues.length === 0 && !error ? (
                <p>No venues are currently available.</p>
            ) : (
                <div className="venue-grid">
                    {venues.map((venue) => (
                        <VenueCard
                            key={venue.id}
                            venue={venue}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}