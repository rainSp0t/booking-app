import apiClient from "../api/apiClient";

export async function getVenues() {
    const response = await apiClient.get("/venues");

    return response.data;
}

export async function getVenueById(id) {
    const response = await apiClient.get(`/venues/${id}`);

    return response.data;
}

export async function getCourtAvailability(courtId, date) {
    const response = await apiClient.get(
        `/courts/${courtId}/availability`,
        {
            params: {
                date
            }
        }
    );

    return response.data;
}

export async function getMyVenues() {
    const response = await apiClient.get("/venues/my-venues");

    return response.data;
}

export async function createVenue(venueData) {
    const response = await apiClient.post("/venues", venueData);

    return response.data;
}