import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getVenueById,
    getOpeningHours,
    createOpeningHours,
    updateOpeningHours,
    deleteOpeningHours
} from "../services/venueService";

const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" }
];

export default function ManageOpeningHours() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [openingHours, setOpeningHours] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [dayOfWeek, setDayOfWeek] = useState("");
    const [openTime, setOpenTime] = useState("08:00");
    const [closeTime, setCloseTime] = useState("22:00");
    const [isClosed, setIsClosed] = useState(false);

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [venueData, openingHoursData] = await Promise.all([
                    getVenueById(id),
                    getOpeningHours(id)
                ]);

                setVenue(venueData);
                setOpeningHours(openingHoursData);
            } catch (error) {
                console.error(
                    "Failed to load opening hours:",
                    error
                );

                setError("Failed to load opening hours.");
            }
        }

        loadData();
    }, [id]);

    function resetForm() {
        setEditingId(null);
        setDayOfWeek("");
        setOpenTime("08:00");
        setCloseTime("22:00");
        setIsClosed(false);
        setError("");
    }

    function startEditing(hours) {
        setEditingId(hours.id);
        setDayOfWeek(hours.dayOfWeek);
        setOpenTime(hours.openTime.slice(0, 5));
        setCloseTime(hours.closeTime.slice(0, 5));
        setIsClosed(hours.isClosed);
        setError("");
    }

    async function refreshOpeningHours() {
        const data = await getOpeningHours(id);
        setOpeningHours(data);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (dayOfWeek === "") {
            setError("Please select a day.");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const data = {
                dayOfWeek: Number(dayOfWeek),
                openTime: `${openTime}:00`,
                closeTime: `${closeTime}:00`,
                isClosed
            };

            if (editingId !== null) {
                await updateOpeningHours(editingId, data);
            } else {
                await createOpeningHours({
                    venueId: Number(id),
                    ...data
                });
            }

            await refreshOpeningHours();
            resetForm();
        } catch (error) {
            console.error(
                "Failed to save opening hours:",
                error
            );

            setError(
                error.response?.data ||
                "Failed to save opening hours."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(hoursId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete these opening hours?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteOpeningHours(hoursId);

            await refreshOpeningHours();

            if (editingId === hoursId) {
                resetForm();
            }
        } catch (error) {
            console.error(
                "Failed to delete opening hours:",
                error
            );

            setError(
                error.response?.data ||
                "Failed to delete opening hours."
            );
        }
    }

    const configuredDays = new Set(
        openingHours.map((hours) => Number(hours.dayOfWeek))
    );

    const availableDays = daysOfWeek.filter(
        (day) =>
            !configuredDays.has(day.value) ||
            (editingId !== null && day.value === Number(dayOfWeek))
    );

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

            <h1>Manage Opening Hours</h1>
            <h2>{venue.name}</h2>

            {error && <p>{error}</p>}

            <h3>Current Opening Hours</h3>

            {openingHours.length === 0 ? (
                <p>
                    No opening hours have been configured yet.
                </p>
            ) : (
                openingHours.map((hours) => {
                    const day = daysOfWeek.find(
                        (item) =>
                            item.value === hours.dayOfWeek
                    );

                    return (
                        <div key={hours.id}>
                            <strong>
                                {day?.label ?? "Unknown day"}
                            </strong>

                            <p>
                                {hours.isClosed
                                    ? "Closed"
                                    : `${hours.openTime.slice(0, 5)} - ${hours.closeTime.slice(0, 5)}`}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    startEditing(hours)
                                }
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleDelete(hours.id)
                                }
                            >
                                Delete
                            </button>
                        </div>
                    );
                })
            )}

            <h3>
                {editingId !== null
                    ? "Edit Opening Hours"
                    : "Add Opening Hours"}
            </h3>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="dayOfWeek">
                        Day
                    </label>

                    <select
                        id="dayOfWeek"
                        value={dayOfWeek}
                        onChange={(event) =>
                            setDayOfWeek(event.target.value)
                        }
                        required
                    >
                        <option value="">
                            Select a day
                        </option>

                        {availableDays.map((day) => (
                            <option
                                key={day.value}
                                value={day.value}
                            >
                                {day.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="openTime">
                        Opening Time
                    </label>

                    <input
                        id="openTime"
                        type="time"
                        value={openTime}
                        onChange={(event) =>
                            setOpenTime(event.target.value)
                        }
                        disabled={isClosed}
                    />
                </div>

                <div>
                    <label htmlFor="closeTime">
                        Closing Time
                    </label>

                    <input
                        id="closeTime"
                        type="time"
                        value={closeTime}
                        onChange={(event) =>
                            setCloseTime(event.target.value)
                        }
                        disabled={isClosed}
                    />
                </div>

                <div>
                    <label htmlFor="isClosed">
                        Closed
                    </label>

                    <input
                        id="isClosed"
                        type="checkbox"
                        checked={isClosed}
                        onChange={(event) =>
                            setIsClosed(event.target.checked)
                        }
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Saving..."
                        : editingId !== null
                            ? "Save Changes"
                            : "Add Opening Hours"}
                </button>

                {editingId !== null && (
                    <button
                        type="button"
                        onClick={resetForm}
                    >
                        Cancel Edit
                    </button>
                )}
            </form>
        </div>
    );
}