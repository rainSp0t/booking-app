import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

export default function Register() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Player");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            await register({
                firstName,
                lastName,
                email,
                password,
                role
            });

            navigate("/login");
        } catch (error) {
            console.error(
                "Registration failed:",
                error
            );

            setError(
                error.response?.data ||
                "Failed to create account."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>

                    <p>
                        Create an account to book courts and
                        manage venues.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="firstName">
                                First Name
                            </label>

                            <input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(event) =>
                                    setFirstName(
                                        event.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="lastName">
                                Last Name
                            </label>

                            <input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(event) =>
                                    setLastName(
                                        event.target.value
                                    )
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="role">
                            Account Type
                        </label>

                        <select
                            id="role"
                            value={role}
                            onChange={(event) =>
                                setRole(
                                    event.target.value
                                )
                            }
                        >
                            <option value="Player">
                                Player
                            </option>

                            <option value="VenueOwner">
                                Venue Owner
                            </option>
                        </select>

                        <span className="form-help">
                            Venue Owner accounts can manage
                            their own venues, courts and
                            opening hours.
                        </span>
                    </div>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}