import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVenue } from "../services/venueService";

export default function CreateVenue() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [bookingDurationMinutes, setBookingDurationMinutes] = useState(60);

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            await createVenue({
                name,
                description,
                address,
                contactNumber,
                bookingDurationMinutes: Number(bookingDurationMinutes)
            });

            navigate("/venue-owner");
        } catch (error) {
            console.error("Failed to create venue:", error);

            setError(
                error.response?.data ||
                "Failed to create venue."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <h1>Create Venue</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label htmlFor="address">Address</label>
                    <input
                        id="address"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="contactNumber">
                        Contact Number
                    </label>
                    <input
                        id="contactNumber"
                        value={contactNumber}
                        onChange={(event) =>
                            setContactNumber(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label htmlFor="bookingDurationMinutes">
                        Booking Duration
                    </label>

                    <select
                        id="bookingDurationMinutes"
                        value={bookingDurationMinutes}
                        onChange={(event) =>
                            setBookingDurationMinutes(event.target.value)
                        }
                    >
                        <option value="30">30 minutes</option>
                        <option value="60">60 minutes</option>
                    </select>
                </div>

                {error && <p>{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Creating..."
                        : "Create Venue"}
                </button>
            </form>
        </div>
    );
}