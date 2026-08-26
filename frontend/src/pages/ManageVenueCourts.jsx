import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getVenueById,
    createCourt
} from "../services/venueService";

export default function ManageVenueCourts() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadVenue() {
            try {
                const data = await getVenueById(id);

                setVenue(data);
            } catch (error) {
                console.error("Failed to load venue:", error);

                setError("Failed to load venue.");
            }
        }

        loadVenue();
    }, [id]);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            await createCourt({
                venueId: Number(id),
                name,
                description
            });

            setName("");
            setDescription("");

            const updatedVenue = await getVenueById(id);
            setVenue(updatedVenue);
        } catch (error) {
            console.error("Failed to create court:", error);

            setError(
                error.response?.data ||
                "Failed to create court."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (error && !venue) {
        return <p>{error}</p>;
    }

    if (!venue) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <button onClick={() => navigate("/venue-owner")}>
                Back to My Venues
            </button>

            <h1>Manage Courts</h1>
            <h2>{venue.name}</h2>

            <h3>Existing Courts</h3>

            {venue.courts.length === 0 ? (
                <p>No courts have been added yet.</p>
            ) : (
                venue.courts.map((court) => (
                    <div key={court.id}>
                        <h4>{court.name}</h4>
                        <p>{court.description}</p>
                    </div>
                ))
            )}

            <h3>Add Court</h3>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Court Name</label>

                    <input
                        id="name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">
                        Description
                    </label>

                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                    />
                </div>

                {error && <p>{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Adding..."
                        : "Add Court"}
                </button>
            </form>
        </div>
    );
}