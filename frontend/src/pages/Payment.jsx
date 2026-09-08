import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../services/bookingService";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

export default function Payment() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        courtId,
        courtName,
        venueName,
        startTime,
        endTime
    } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!courtId || !startTime || !endTime) {
        return (
            <div className="payment-page">
                <h1>Payment</h1>
                <p>No booking details were provided.</p>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => navigate("/")}
                >
                    Back to Venues
                </button>
            </div>
        );
    }

    async function handleConfirmBooking() {
        if (!paymentMethod) {
            setError("Please select a payment method.");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            await createBooking(
                courtId,
                startTime,
                endTime
            );

            navigate(`/venues/${location.state.venueId}`, {
                state: {
                    bookingSuccess: true
                }
            });
        } catch (error) {
            console.error(
                "Failed to create booking:",
                error
            );

            setError(
                error.response?.data ||
                "Failed to create booking."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="payment-page">
            <button
                type="button"
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <header className="payment-header">
                <h1>Payment</h1>

                <p>
                    Complete your payment selection to confirm
                    your booking.
                </p>
            </header>

            <div className="payment-layout">
                <section className="payment-card">
                    <h2>Booking Summary</h2>

                    <div className="payment-summary-row">
                        <span>Venue</span>
                        <strong>{venueName}</strong>
                    </div>

                    <div className="payment-summary-row">
                        <span>Court</span>
                        <strong>{courtName}</strong>
                    </div>

                    <div className="payment-summary-row">
                        <span>Date</span>
                        <strong>{formatDate(startTime)}</strong>
                    </div>

                    <div className="payment-summary-row">
                        <span>Time</span>
                        <strong>
                            {formatTime(startTime)}
                            {" – "}
                            {formatTime(endTime)}
                        </strong>
                    </div>
                </section>

                <section className="payment-card">
                    <h2>Payment Method</h2>

                    <p className="payment-placeholder">
                        Payment processing will be implemented
                        later. For now, select an option to
                        continue with the booking flow.
                    </p>

                    <div className="payment-options">
                        <label
                            className={
                                paymentMethod === "card"
                                    ? "payment-option selected"
                                    : "payment-option"
                            }
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={
                                    paymentMethod === "card"
                                }
                                onChange={(event) =>
                                    setPaymentMethod(
                                        event.target.value
                                    )
                                }
                            />

                            <span>
                                Credit / Debit Card
                            </span>
                        </label>

                        <label
                            className={
                                paymentMethod === "online"
                                    ? "payment-option selected"
                                    : "payment-option"
                            }
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="online"
                                checked={
                                    paymentMethod === "online"
                                }
                                onChange={(event) =>
                                    setPaymentMethod(
                                        event.target.value
                                    )
                                }
                            />

                            <span>
                                Online Payment
                            </span>
                        </label>
                    </div>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        className="primary-button"
                        onClick={handleConfirmBooking}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Confirming..."
                            : "Confirm Booking"}
                    </button>
                </section>
            </div>
        </div>
    );
}