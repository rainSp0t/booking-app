# Domain Model

## User

Represents anyone who uses the system.

Types:

- Player
- Venue Owner
- Administrator


## Venue

Represents a sports facility available for booking.

Relationships:

- A Venue has one owner.
- A Venue contains many courts.


## Court

Represents a playable court inside a venue.

Relationships:

- A Court belongs to one venue.
- A Court can support one or more sports.
- A Court has many bookings.


## Sport

Represents a type of racket sport.

Examples:

- Badminton
- Pickleball
- Tennis


## Booking

Represents a reservation made by a player.

Relationships:

- A Booking belongs to one player.
- A Booking belongs to one court.
- A Booking has a start and end time.