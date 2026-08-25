import apiClient from "../api/apiClient";

export async function createBooking(courtId, startTime, endTime) {
    const response = await apiClient.post("/bookings", {
        courtId,
        startTime,
        endTime
    });

    return response.data;
}