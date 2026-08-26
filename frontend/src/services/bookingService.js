import apiClient from "../api/apiClient";

export async function createBooking(courtId, startTime, endTime) {
    const response = await apiClient.post("/bookings", {
        courtId,
        startTime,
        endTime
    });

    return response.data;
}

export async function getMyBookings() {
    const response = await apiClient.get("/bookings/my-bookings");

    return response.data;
}

export async function cancelBooking(bookingId) {
    const response = await apiClient.patch(
        `/bookings/${bookingId}/cancel`
    );

    return response.data;
}

export async function getVenueBookings(venueId) {
    const response = await apiClient.get(
        `/bookings/venue/${venueId}`
    );

    return response.data;
}