import { Link } from "react-router-dom";

export default function VenueCard({ venue }) {
    return (
        <div>
            <h2>{venue.name}</h2>

            <p>{venue.description}</p>

            <p>{venue.address}</p>

            <Link to={`/venues/${venue.id}`}>
                View Venue
            </Link>
        </div>
    );
}