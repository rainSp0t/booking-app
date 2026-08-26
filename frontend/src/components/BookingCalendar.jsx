import { useMemo, useState } from "react";

const dayNames = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
];

function getDaysInMonth(year, month) {
    const days = new Date(year, month + 1, 0).getDate();

    return Array.from(
        { length: days },
        (_, index) => new Date(year, month, index + 1)
    );
}

function getMondayBasedDay(date) {
    const day = date.getDay();

    return day === 0 ? 6 : day - 1;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function BookingCalendar({
    openingHours,
    selectedDate,
    onDateSelect
}) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const [currentMonth, setCurrentMonth] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const days = useMemo(
        () =>
            getDaysInMonth(
                currentMonth.getFullYear(),
                currentMonth.getMonth()
            ),
        [currentMonth]
    );

    const firstDayOffset = getMondayBasedDay(days[0]);

    const openingHoursByDay = useMemo(() => {
        return new Map(
            openingHours.map((hours) => [
                Number(hours.dayOfWeek),
                hours
            ])
        );
    }, [openingHours]);

    function getDayStatus(date) {
        const dayOfWeek = date.getDay();
        const hours = openingHoursByDay.get(dayOfWeek);

        if (date < today) {
            return "past";
        }

        if (!hours) {
            return "unconfigured";
        }

        if (hours.isClosed) {
            return "closed";
        }

        return "available";
    }

    function goToPreviousMonth() {
        const previousMonth = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() - 1,
            1
        );

        const currentMonthStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        if (previousMonth >= currentMonthStart) {
            setCurrentMonth(previousMonth);
        }
    }

    function goToNextMonth() {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
            )
        );
    }

    return (
        <div className="booking-calendar">
            <div className="calendar-header">
                <button
                    type="button"
                    onClick={goToPreviousMonth}
                    aria-label="Previous month"
                >
                    ←
                </button>

                <h3>
                    {currentMonth.toLocaleDateString(
                        undefined,
                        {
                            month: "long",
                            year: "numeric"
                        }
                    )}
                </h3>

                <button
                    type="button"
                    onClick={goToNextMonth}
                    aria-label="Next month"
                >
                    →
                </button>
            </div>

            <div className="calendar-weekdays">
                {dayNames.map((day) => (
                    <div key={day}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="calendar-grid">
                {Array.from({
                    length: firstDayOffset
                }).map((_, index) => (
                    <div
                        key={`empty-${index}`}
                        className="calendar-empty"
                    />
                ))}

                {days.map((date) => {
                    const dateString = formatDate(date);
                    const status = getDayStatus(date);
                    const isSelected =
                        selectedDate === dateString;

                    const isClickable =
                        status === "available";

                    return (
                        <button
                            key={dateString}
                            type="button"
                            disabled={!isClickable}
                            className={[
                                "calendar-day",
                                status,
                                isSelected
                                    ? "selected"
                                    : ""
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            onClick={() =>
                                onDateSelect(dateString)
                            }
                        >
                            <span className="calendar-day-number">
                                {date.getDate()}
                            </span>

                            <span className="calendar-day-status">
                                {status === "available"
                                    ? "Available"
                                    : status === "closed"
                                        ? "Closed"
                                        : status === "unconfigured"
                                            ? "Unavailable"
                                            : "Past"}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}