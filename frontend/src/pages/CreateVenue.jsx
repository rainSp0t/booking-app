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
                bookingDurationMinutes: Number(
                    bookingDurationMinutes
                )
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
        <div className="create-venue-page">
            <button
                type="button"
                className="back-button"
                onClick={() => navigate("/venue-owner")}
            >
                ← Back to My Venues
            </button>

            <div className="form-header">
                <h1>Create Venue</h1>

                <p>
                    Add a new venue and configure its basic
                    booking settings.
                </p>
            </div>

            <form
                className="venue-form"
                onSubmit={handleSubmit}
            >
                <div className="form-section">
                    <h2>Venue Details</h2>

                    <div className="form-field">
                        <label htmlFor="name">
                            Venue Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="e.g. Auckland Racket Centre"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Describe your venue..."
                            rows={4}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="address">
                            Address
                        </label>

                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(event) =>
                                setAddress(event.target.value)
                            }
                            placeholder="e.g. 123 Queen Street, Auckland"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="contactNumber">
                            Contact Number
                        </label>

                        <input
                            id="contactNumber"
                            type="tel"
                            value={contactNumber}
                            onChange={(event) =>
                                setContactNumber(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. 021 123 4567"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h2>Booking Settings</h2>

                    <div className="form-field">
                        <label htmlFor="bookingDurationMinutes">
                            Booking Duration
                        </label>

                        <select
                            id="bookingDurationMinutes"
                            value={bookingDurationMinutes}
                            onChange={(event) =>
                                setBookingDurationMinutes(
                                    event.target.value
                                )
                            }
                        >
                            <option value="30">
                                30 minutes
                            </option>

                            <option value="60">
                                60 minutes
                            </option>
                        </select>

                        <span className="form-help">
                            This determines the length of each
                            available booking slot.
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate("/venue-owner")
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Creating..."
                            : "Create Venue"}
                    </button>
                </div>
            </form>
        </div>
    );
}